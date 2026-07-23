import { mkdir, writeFile } from 'node:fs/promises';

const source = 'https://geo.api.gouv.fr/departements/33/communes?fields=nom,codesPostaux&format=json';
const output = new URL('../public/data/gironde-postal-cities.json', import.meta.url);

const response = await fetch(source, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error(`Référentiel communes indisponible (${response.status})`);

const communes = await response.json();
const byPostalCode = {};

for (const commune of communes) {
	for (const postalCode of commune.codesPostaux || []) {
		if (!/^33\d{3}$/.test(postalCode)) continue;
		(byPostalCode[postalCode] ||= []).push(commune.nom);
	}
}

for (const cities of Object.values(byPostalCode)) cities.sort((a, b) => a.localeCompare(b, 'fr'));

await mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
await writeFile(output, `${JSON.stringify(byPostalCode, null, 2)}\n`);
console.log(`${Object.keys(byPostalCode).length} codes postaux et ${communes.length} communes de Gironde synchronisés.`);
