import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'src/data/communes.json');

const GEO_COMMUNES_URL =
  'https://geo.api.gouv.fr/departements/33/communes?fields=nom,code,codesPostaux,population,centre,surface,codeEpci&format=json&geometry=centre';
const GEO_EPCI_URL = 'https://geo.api.gouv.fr/epcis?fields=nom,code&format=json';
const PVGIS_ENDPOINT = 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc';
const PVGIS_SOURCE = 'PVGIS 5.3';
const PVGIS_LOSS_PERCENT = 14;
const PVGIS_PEAK_POWER_KWC = 1;
const PVGIS_CONCURRENCY = Math.min(
  8,
  Math.max(1, Number.parseInt(process.env.PVGIS_CONCURRENCY || '8', 10) || 8),
);
const forceSolarRefresh = process.argv.includes('--refresh-solar');

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

async function fetchJson(url, { attempts = 4, timeoutMs = 45_000 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'panneau-solaire-gironde.fr/2.0 (official-local-data)',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status} ${response.statusText}`);
        error.retryable = response.status === 429 || response.status >= 500;
        throw error;
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      const canRetry =
        attempt < attempts &&
        (error?.retryable ||
          error?.name === 'AbortError' ||
          error?.name === 'TypeError' ||
          error?.cause?.code === 'ECONNRESET' ||
          error?.cause?.code === 'ETIMEDOUT' ||
          error?.cause?.code === 'ENOTFOUND');

      if (!canRetry) break;
      await delay(750 * 2 ** (attempt - 1) + attempt * 125);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`Échec après ${attempts} tentative(s) pour ${url}: ${lastError?.message || lastError}`);
}

async function readCachedCommunes() {
  try {
    const cached = JSON.parse(await readFile(output, 'utf8'));
    return Array.isArray(cached) ? cached : [];
  } catch {
    return [];
  }
}

function slugify(name) {
  return name
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function hasReusableSolar(cached, commune) {
  if (forceSolarRefresh || !cached?.solar) return false;

  return (
    cached.solar.source === PVGIS_SOURCE &&
    cached.solar.lossPercent === PVGIS_LOSS_PERCENT &&
    cached.solar.peakPowerKwc === PVGIS_PEAK_POWER_KWC &&
    Number.isFinite(cached.solar.yieldPerKwc) &&
    cached.solar.yieldPerKwc > 0 &&
    Math.abs(Number(cached.latitude) - Number(commune.latitude)) < 0.000_001 &&
    Math.abs(Number(cached.longitude) - Number(commune.longitude)) < 0.000_001
  );
}

async function fetchPvgisSolar(commune) {
  const parameters = new URLSearchParams({
    lat: String(commune.latitude),
    lon: String(commune.longitude),
    peakpower: String(PVGIS_PEAK_POWER_KWC),
    loss: String(PVGIS_LOSS_PERCENT),
    pvtechchoice: 'crystSi',
    mountingplace: 'free',
    optimalangles: '1',
    outputformat: 'json',
  });
  const payload = await fetchJson(`${PVGIS_ENDPOINT}?${parameters}`, {
    attempts: 4,
    timeoutMs: 60_000,
  });

  const annual = Number(payload?.outputs?.totals?.fixed?.E_y);
  const fixed = payload?.inputs?.mounting_system?.fixed;
  const meteo = payload?.inputs?.meteo_data;

  if (!Number.isFinite(annual) || annual <= 0) {
    throw new Error(`Réponse PVGIS incomplète pour ${commune.name} (${commune.insee})`);
  }

  return {
    yieldPerKwc: Math.round(annual),
    unit: 'kWh/kWc/an',
    source: PVGIS_SOURCE,
    sourceUrl: PVGIS_ENDPOINT,
    model: 'PVcalc, silicium cristallin, système fixe, inclinaison et azimut optimisés',
    peakPowerKwc: PVGIS_PEAK_POWER_KWC,
    lossPercent: PVGIS_LOSS_PERCENT,
    optimalTiltDeg: Number(fixed?.slope?.value),
    optimalAzimuthDeg: Number(fixed?.azimuth?.value),
    radiationDatabase: meteo?.radiation_db || null,
    meteoDatabase: meteo?.meteo_db || null,
    dataPeriod:
      Number.isFinite(Number(meteo?.year_min)) && Number.isFinite(Number(meteo?.year_max))
        ? `${meteo.year_min}-${meteo.year_max}`
        : null,
    useHorizon: Boolean(meteo?.use_horizon),
    fetchedAt: new Date().toISOString(),
    method:
      'Estimation au centre géographique de la commune pour 1 kWc, pertes système de 14 %, inclinaison et azimut optimisés par PVGIS. Ce productible ne remplace pas une étude de toiture et de masques solaires.',
  };
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function consume() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => consume()),
  );
  return results;
}

const cachedCommunes = await readCachedCommunes();
const cachedByInsee = new Map(cachedCommunes.map((commune) => [commune.insee, commune]));

console.log('Récupération du référentiel officiel des communes et EPCI…');
const [rawCommunes, rawEpcis] = await Promise.all([
  fetchJson(GEO_COMMUNES_URL, { attempts: 4, timeoutMs: 30_000 }),
  fetchJson(GEO_EPCI_URL, { attempts: 4, timeoutMs: 30_000 }),
]);
const epciNames = new Map(rawEpcis.map((epci) => [epci.code, epci.nom]));

const communes = rawCommunes
  .filter((commune) => Number(commune.population || 0) >= 2000)
  .map((commune) => {
    const latitude = commune.centre?.coordinates?.[1] ?? null;
    const longitude = commune.centre?.coordinates?.[0] ?? null;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error(`Coordonnées officielles manquantes pour ${commune.nom} (${commune.code})`);
    }

    return {
      name: commune.nom,
      slug: slugify(commune.nom),
      insee: commune.code,
      postalCode: commune.codesPostaux?.[0] || '33',
      postalCodes: commune.codesPostaux || [],
      population: Number(commune.population || 0),
      surfaceKm2: Math.round((Number(commune.surface || 0) / 100) * 10) / 10,
      latitude,
      longitude,
      codeEpci: commune.codeEpci || null,
      epciName: epciNames.get(commune.codeEpci) || null,
      epciSource: {
        source: 'API Découpage administratif (geo.api.gouv.fr)',
        communesUrl: GEO_COMMUNES_URL,
        epcisUrl: GEO_EPCI_URL,
        method:
          'Population, surface, centre géographique, code EPCI et nom EPCI issus du référentiel officiel au moment de la génération.',
      },
    };
  })
  .sort((a, b) => b.population - a.population || a.name.localeCompare(b.name, 'fr'));

const toFetch = communes.filter(
  (commune) => !hasReusableSolar(cachedByInsee.get(commune.insee), commune),
);
const reusedCount = communes.length - toFetch.length;

console.log(
  `PVGIS: ${reusedCount} résultat(s) en cache, ${toFetch.length} appel(s) à effectuer (concurrence ${PVGIS_CONCURRENCY}).`,
);

let completed = 0;
const freshSolar = await mapWithConcurrency(toFetch, PVGIS_CONCURRENCY, async (commune) => {
  const solar = await fetchPvgisSolar(commune);
  completed += 1;
  if (completed % 20 === 0 || completed === toFetch.length) {
    console.log(`PVGIS: ${completed}/${toFetch.length} nouveaux calculs terminés`);
  }
  return [commune.insee, solar];
});
const freshSolarByInsee = new Map(freshSolar);

const enriched = communes.map((commune) => ({
  ...commune,
  solar:
    freshSolarByInsee.get(commune.insee) ||
    cachedByInsee.get(commune.insee)?.solar,
}));

const invalid = enriched.filter(
  (commune) =>
    !commune.codeEpci ||
    !commune.epciName ||
    !Number.isFinite(commune.solar?.yieldPerKwc) ||
    commune.solar?.source !== PVGIS_SOURCE,
);

if (communes.length !== 140) {
  throw new Error(`Nombre de communes inattendu: ${communes.length} (140 attendu)`);
}
if (invalid.length > 0) {
  throw new Error(
    `Données officielles incomplètes pour ${invalid.length} commune(s): ${invalid
      .map((commune) => commune.name)
      .join(', ')}`,
  );
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(enriched, null, 2)}\n`);
console.log(
  `${enriched.length} communes de Gironde enrichies (EPCI + productible PVGIS 5.3) → ${output}`,
);
