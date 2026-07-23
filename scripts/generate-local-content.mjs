import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const communesPath = resolve(root, 'src/data/communes.json');
const output = resolve(root, 'src/data/local-content.json');
const checkOnly = process.argv.includes('--check');

const PRICE_MIN = 7000;
const PRICE_MAX = 22000;
const PRICE_METHOD =
  'Fourchette éditoriale départementale commune à toutes les pages pour des projets résidentiels de 3 à 9 kWc. Elle ne constitue ni un devis ni un prix local observé.';
const TERRITORY_METHOD =
  'Zone attribuée d’abord par le nom officiel de l’EPCI, puis par seuils explicites de latitude/longitude du centre communal: ouest ≤ -0,85; nord ≥ 45,00; sud ≤ 44,65; est ≥ -0,25. Aucun quartier, monument ou type de toiture n’est déduit.';

const communes = JSON.parse(await readFile(communesPath, 'utf8'));

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits }).format(value);
}

function communeWithDe(name) {
  if (/^Le\s/u.test(name)) return `du ${name.slice(3)}`;
  if (/^Les\s/u.test(name)) return `des ${name.slice(4)}`;
  if (/^L['’]/u.test(name)) return `de l’${name.slice(2)}`;
  return /^[aeiouyhàâäéèêëîïôöùûü]/iu.test(name) ? `d’${name}` : `de ${name}`;
}

function communeWithA(name) {
  if (/^Le\s/u.test(name)) return `au ${name.slice(3)}`;
  if (/^Les\s/u.test(name)) return `aux ${name.slice(4)}`;
  if (/^L['’]/u.test(name)) return `à l’${name.slice(2)}`;
  return `à ${name}`;
}

function formatCoordinate(value, positiveCardinal, negativeCardinal) {
  const numericValue = Number(value);
  return `${Math.abs(numericValue).toFixed(4)}° ${numericValue >= 0 ? positiveCardinal : negativeCardinal}`;
}

function classifyDensity(commune) {
  const densityPerKm2 =
    commune.surfaceKm2 > 0 ? Math.round(commune.population / commune.surfaceKm2) : null;

  if (!Number.isFinite(densityPerKm2)) {
    return {
      densityPerKm2: null,
      densityLabel: 'densité non calculable',
      context:
        'La densité communale n’est pas calculable avec les données disponibles ; seule une visite permet de caractériser l’environnement immédiat du bâtiment.',
      installerCheck:
        'Faire décrire et photographier les obstacles proches : bâtiments, arbres, cheminées et relief.',
    };
  }
  if (densityPerKm2 >= 1500) {
    return {
      densityPerKm2,
      densityLabel: 'commune très dense',
      context:
        'La densité communale est élevée ; l’étude doit mesurer les ombres proches sans les présumer à partir de la seule adresse.',
      installerCheck:
        'En contexte communal très dense, exiger un relevé précis des ombres portées par les bâtiments et obstacles voisins.',
    };
  }
  if (densityPerKm2 >= 500) {
    return {
      densityPerKm2,
      densityLabel: 'commune dense',
      context:
        'La densité communale est soutenue ; le masque solaire et l’accès au chantier doivent être vérifiés à l’échelle de la parcelle.',
      installerCheck:
        'En contexte communal dense, comparer les relevés d’ombrage et les conditions réelles d’accès à la toiture.',
    };
  }
  if (densityPerKm2 >= 150) {
    return {
      densityPerKm2,
      densityLabel: 'commune de densité intermédiaire',
      context:
        'La densité communale est intermédiaire ; les arbres, bâtiments et usages électriques propres à la parcelle restent les données décisives.',
      installerCheck:
        'Faire chiffrer séparément les effets des ombres végétales ou bâties observées lors de la visite.',
    };
  }
  return {
    densityPerKm2,
    densityLabel: 'commune peu dense',
    context:
      'La densité communale est faible ; cela ne garantit pas une toiture dégagée et une étude de masque solaire reste nécessaire.',
    installerCheck:
      'Même en contexte communal peu dense, exiger une étude d’ombre et un diagnostic de la couverture et de la charpente.',
  };
}

function classifyTerritory(commune) {
  const epci = (commune.epciName || '').toLocaleLowerCase('fr');
  const latitude = Number(commune.latitude);
  const longitude = Number(commune.longitude);

  if (epci.includes('bordeaux métropole')) {
    return {
      name: 'bordeaux-metropole',
      label: 'Bordeaux Métropole',
      context:
        'La commune appartient officiellement à Bordeaux Métropole. Les règles d’urbanisme doivent néanmoins être vérifiées pour la parcelle concernée.',
    };
  }
  if (/(bassin d['’]arcachon|val de l['’]eyre)/u.test(epci)) {
    return {
      name: 'bassin-arcachon-val-eyre',
      label: 'Bassin d’Arcachon et Val de l’Eyre',
      context:
        'Le rattachement territorial est déterminé par l’EPCI officiel du Bassin d’Arcachon ou du Val de l’Eyre.',
    };
  }
  if (epci.includes('médoc')) {
    return {
      name: 'medoc',
      label: 'Médoc',
      context: 'Le rattachement au Médoc est déterminé par le nom officiel de l’EPCI.',
    };
  }
  if (/(libournais|saint-emilion|saint-émilion|fronsadais|castillon)/u.test(epci)) {
    return {
      name: 'libournais-est-girondin',
      label: 'Libournais et Est girondin',
      context:
        'Le rattachement au Libournais ou à l’Est girondin est déterminé par le nom officiel de l’EPCI.',
    };
  }
  if (longitude <= -0.85) {
    return {
      name: 'ouest-girondin',
      label: 'Ouest girondin',
      context:
        'La zone Ouest girondin est attribuée par la longitude du centre communal (≤ -0,85°), sans déduire l’exposition réelle du bâtiment.',
    };
  }
  if (latitude >= 45) {
    return {
      name: 'nord-gironde',
      label: 'Nord Gironde',
      context:
        'La zone Nord Gironde est attribuée par la latitude du centre communal (≥ 45,00°).',
    };
  }
  if (latitude <= 44.65) {
    return {
      name: 'sud-gironde',
      label: 'Sud Gironde',
      context:
        'La zone Sud Gironde est attribuée par la latitude du centre communal (≤ 44,65°).',
    };
  }
  if (longitude >= -0.25) {
    return {
      name: 'est-girondin',
      label: 'Est girondin',
      context:
        'La zone Est girondin est attribuée par la longitude du centre communal (≥ -0,25°).',
    };
  }
  return {
    name: 'gironde-centrale',
    label: 'Gironde centrale',
    context:
      'La zone Gironde centrale correspond aux centres communaux situés entre les seuils géographiques documentés.',
  };
}

function validateCommunes(records) {
  const invalid = records.filter(
    (commune) =>
      !commune.codeEpci ||
      !commune.epciName ||
      !Number.isFinite(commune.solar?.yieldPerKwc) ||
      commune.solar?.source !== 'PVGIS 5.3',
  );

  if (records.length !== 140) {
    throw new Error(`Nombre de communes inattendu: ${records.length} (140 attendu)`);
  }
  if (invalid.length > 0) {
    throw new Error(
      `Communes sans EPCI ou PVGIS valide: ${invalid.map((commune) => commune.name).join(', ')}`,
    );
  }
}

function validateGenerated(records) {
  const invalid = records.filter(
    (record) =>
      record.orientation !== undefined ||
      record.priceMin !== PRICE_MIN ||
      record.priceMax !== PRICE_MAX ||
      record.market?.yieldPerKwc !== record.solar?.yieldPerKwc ||
      !record.territory?.name ||
      !record.territory?.label ||
      !Array.isArray(record.installerChecks) ||
      record.installerChecks.length !== 3 ||
      !Array.isArray(record.faqs) ||
      record.faqs.length !== 3,
  );
  const serialized = JSON.stringify(records);
  const forbidden = [
    'Chartrons',
    'Miroir d’Eau',
    'dune du Pilat',
    'cabanes tchanquées',
    'type de toiture local',
  ];
  const residues = forbidden.filter((term) => serialized.includes(term));

  if (records.length !== 140 || invalid.length > 0 || residues.length > 0) {
    throw new Error(
      `Validation locale échouée: ${records.length}/140, ${invalid.length} fiche(s) invalide(s), résidus: ${residues.join(', ') || 'aucun'}`,
    );
  }
}

validateCommunes(communes);

if (checkOnly) {
  const existing = JSON.parse(await readFile(output, 'utf8'));
  validateGenerated(existing);
  console.log(
    `Validation réussie: ${existing.length} communes, ${existing.length} rendements PVGIS, aucun signal local issu d’un hash.`,
  );
  process.exit(0);
}

const generated = communes.map((commune) => {
  const yieldPerKwc = commune.solar.yieldPerKwc;
  const density = classifyDensity(commune);
  const zone = classifyTerritory(commune);
  const cityLabel = commune.name;
  const cityAt = communeWithA(cityLabel);
  const population = formatNumber(commune.population);
  const surface = formatNumber(commune.surfaceKm2, 1);
  const densityValue = Number.isFinite(density.densityPerKm2)
    ? `${formatNumber(density.densityPerKm2)} hab./km²`
    : 'non disponible';
  const production3 = Math.round(yieldPerKwc * 3);
  const production6 = Math.round(yieldPerKwc * 6);
  const production9 = Math.round(yieldPerKwc * 9);
  const latitudeLabel = formatCoordinate(commune.latitude, 'N', 'S');
  const longitudeLabel = formatCoordinate(commune.longitude, 'E', 'O');

  const methodology = {
    administrative: {
      source: 'API Découpage administratif (geo.api.gouv.fr)',
      method:
        'Population, surface, centre communal, code et nom EPCI repris de src/data/communes.json.',
    },
    solar: {
      source: commune.solar.source,
      sourceUrl: commune.solar.sourceUrl,
      method: commune.solar.method,
    },
    prices: {
      source: 'Fourchette éditoriale départementale',
      method: PRICE_METHOD,
    },
    territory: {
      source: 'EPCI officiel et coordonnées du centre communal',
      method: TERRITORY_METHOD,
    },
  };

  const faqs = [
    [
      `Quel productible solaire PVGIS est retenu ${cityAt} ?`,
      `PVGIS 5.3 estime ${formatNumber(yieldPerKwc)} kWh/kWc/an au centre géographique ${communeWithDe(cityLabel)}, pour un système fixe de 1 kWc, ${commune.solar.lossPercent} % de pertes et des angles optimisés. Cette valeur est un modèle territorial : l’orientation, la pente et les ombres de la toiture réelle peuvent modifier le résultat.`,
    ],
    [
      `Quel budget indicatif prévoir ${cityAt} ?`,
      `Le site utilise la même enveloppe départementale de ${formatNumber(PRICE_MIN)} à ${formatNumber(PRICE_MAX)} € pour les projets résidentiels de 3 à 9 kWc dans toute la Gironde. Elle sert à cadrer le projet ; seuls des devis détaillés après visite permettent de comparer un prix applicable ${cityAt}.`,
    ],
    [
      `Quelles règles locales vérifier avant une pose ${cityAt} ?`,
      `${cityLabel} appartient à l’EPCI « ${commune.epciName} ». Ce rattachement ne suffit pas à déterminer les règles de la parcelle : il faut consulter le service urbanisme, le document d’urbanisme applicable et, le cas échéant, les prescriptions patrimoniales avant de déposer la déclaration préalable.`,
    ],
  ];

  return {
    ...commune,
    intro: `${cityAt.charAt(0).toLocaleUpperCase('fr')}${cityAt.slice(1)}, commune officielle de ${population} habitants sur ${surface} km², PVGIS 5.3 estime un productible de ${formatNumber(yieldPerKwc)} kWh/kWc/an au centre communal. Le calcul utilise 1 kWc, ${commune.solar.lossPercent} % de pertes et des angles optimisés ; il doit être affiné sur la toiture réelle.`,
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    yieldPerKwc,
    roof: 'toiture existante à diagnostiquer sur place',
    densityPerKm2: density.densityPerKm2,
    densityLabel: density.densityLabel,
    territory: {
      ...zone,
      method: TERRITORY_METHOD,
    },
    localIntro: `${cityAt.charAt(0).toLocaleUpperCase('fr')}${cityAt.slice(1)}, le point de calcul officiel est situé à ${latitudeLabel} et ${longitudeLabel}. Le productible PVGIS associé est de ${formatNumber(yieldPerKwc)} kWh/kWc/an, soit environ ${formatNumber(production6)} kWh/an pour 6 kWc dans les hypothèses du modèle. La commune compte ${densityValue} : ${density.context}`,
    localAdvice: `Comparer les offres ${cityAt} suppose de faire relever la pente, l’orientation réelle, les ombres, l’état de la couverture et la capacité de la charpente. Côté administratif, la commune relève de « ${commune.epciName} » ; le professionnel doit néanmoins vérifier les règles applicables à l’adresse, le raccordement Enedis et son assurance décennale.`,
    heritage: `Aucun statut patrimonial n’est déduit automatiquement pour ${cityLabel}. La présence éventuelle d’un site protégé, d’un monument historique ou d’une prescription architecturale doit être contrôlée à l’adresse du projet auprès du service urbanisme et des référentiels officiels.`,
    installerIntro: `Pour comparer des installateurs ${cityAt}, partez des mêmes données vérifiables : productible PVGIS de ${formatNumber(yieldPerKwc)} kWh/kWc/an au centre communal, densité de ${densityValue} et appartenance à l’EPCI « ${commune.epciName} ». Aucun de ces indicateurs ne remplace la visite technique de la toiture.`,
    installerChecks: [
      `${density.installerCheck} Demander le relevé ou le rapport utilisé dans l’offre.`,
      `Faire confirmer par écrit le diagnostic de la toiture existante, la méthode de fixation, les garanties matériel et main-d’œuvre ainsi que l’assurance décennale couvrant le photovoltaïque.`,
      `Vérifier la qualification RGE adaptée, le dimensionnement par rapport aux consommations, les démarches d’urbanisme ${cityAt} et le raccordement Enedis ; comparer les offres sur un même périmètre.`,
    ],
    market: {
      yieldPerKwc,
      threeKwcProduction: production3,
      sixKwcProduction: production6,
      nineKwcProduction: production9,
      source: commune.solar.source,
      method: commune.solar.method,
    },
    faqs,
    methodology,
    metaDescription: `Panneaux solaires ${cityAt} (${commune.postalCode}) : productible PVGIS ${formatNumber(yieldPerKwc)} kWh/kWc/an, budget départemental ${formatNumber(PRICE_MIN)} à ${formatNumber(PRICE_MAX)} €, devis RGE.`,
    cta: `Estimer mon projet solaire ${cityAt} (33)`,
  };
});

validateGenerated(generated);
await writeFile(output, `${JSON.stringify(generated, null, 2)}\n`);
console.log(
  `${generated.length} contenus locaux générés à partir des EPCI, coordonnées, densités et rendements PVGIS officiels → ${output}`,
);
