import { access, readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const root = resolve('dist');

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = resolve(directory, entry.name);
		if (entry.isDirectory()) files.push(...await walk(full));
		else files.push(full);
	}
	return files;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const errors = [];
let checkedLinks = 0;
const canonicals = new Map();
const inboundLinks = new Map();

function visibleWordCount(html) {
	const text = html
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&(?:[a-z]+|#\d+|#x[a-f0-9]+);/gi, ' ');
	return text.match(/\p{L}[\p{L}\p{M}’'-]*/gu)?.length || 0;
}

function routeTarget(href) {
	const path = decodeURIComponent(href.split('#')[0].split('?')[0]);
	if (!path || path === '/') return resolve(root, 'index.html');
	if (path.endsWith('.xml') || path.endsWith('.txt') || /\.[a-z0-9]+$/i.test(path)) {
		return resolve(root, path.replace(/^\//, ''));
	}
	return resolve(root, path.replace(/^\//, ''), 'index.html');
}

function decodeHtmlText(value = '') {
	return value
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ');
}

for (const file of htmlFiles) {
	const html = await readFile(file, 'utf8');
	const label = relative(root, file);
	const title = decodeHtmlText(html.match(/<title>([^<]+)<\/title>/)?.[1] || '');
	const description = decodeHtmlText(html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '');
	if (title.length < 12) errors.push(`${label}: title absent ou trop court`);
	if (title.length > 75) errors.push(`${label}: title trop long (${title.length} caractères)`);
	if (description.length < 60) errors.push(`${label}: meta description absente ou trop courte`);
	if (description.length > 175) errors.push(`${label}: meta description trop longue (${description.length} caractères)`);
	if (!/<link rel="canonical" href="https:\/\/panneau-solaire-gironde\.fr[^"]*"/.test(html)) errors.push(`${label}: canonical absente`);
	if (!/<h1[\s>]/.test(html)) errors.push(`${label}: H1 absent`);
	if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) errors.push(`${label}: image sans attribut alt`);
	if (html.includes('[object Object]')) errors.push(`${label}: objet sérialisé dans le contenu visible`);
	if (/Haute-Garonne|Toulouse|31xxx|vent d.Autan|brique rose|Cité de l.Espace|Airbus|salleb-uf/.test(html)) {
		errors.push(`${label}: résidu éditorial du projet précédent`);
	}
	if (/[Àà] (?:Le|Les) /.test(html)) errors.push(`${label}: préposition communale incorrecte`);
	const isGuideArticle =
		label === 'aides-panneau-solaire-33/index.html' ||
		label === 'guide-solaire-patrimoine-bordeaux/index.html' ||
		(label.startsWith('guides/') && label !== 'guides/index.html');
	if (isGuideArticle) {
		for (const schemaType of ['Article', 'FAQPage', 'BreadcrumbList']) {
			if (!html.includes(`"@type":"${schemaType}"`)) errors.push(`${label}: schema ${schemaType} absent`);
		}
		const wordCount = visibleWordCount(html);
		if (wordCount < 700) errors.push(`${label}: contenu trop court (${wordCount} mots visibles)`);
	}
	const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
	if (canonical) {
		const canonicalPath = new URL(canonical).pathname;
		if (canonicalPath !== '/' && !canonicalPath.endsWith('/')) errors.push(`${label}: canonical sans slash final`);
		if (canonicals.has(canonical)) errors.push(`${label}: canonical dupliquée avec ${canonicals.get(canonical)}`);
		else canonicals.set(canonical, label);
	}

	for (const match of html.matchAll(/href="([^"]+)"/g)) {
		const href = match[1];
		if (!href.startsWith('/') || href.startsWith('//')) continue;
		checkedLinks += 1;
		const routePath = decodeURIComponent(href.split('#')[0].split('?')[0]);
		if (routePath !== '/' && routePath && !routePath.endsWith('/') && !/\.[a-z0-9]+$/i.test(routePath)) {
			errors.push(`${label}: lien interne sans slash final ${href}`);
		}
		const target = routeTarget(href);
		const targetLabel = relative(root, target);
		inboundLinks.set(targetLabel, (inboundLinks.get(targetLabel) || 0) + 1);
		try {
			await access(target);
		} catch {
			errors.push(`${label}: lien interne cassé ${href}`);
		}
	}
	for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
		const src = match[1];
		if (!src.startsWith('/')) continue;
		try {
			await access(resolve(root, src.replace(/^\//, '')));
		} catch {
			errors.push(`${label}: image absente ${src}`);
		}
	}
}

const sitemap = await readFile(resolve(root, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length < 293) errors.push(`Sitemap incomplet : ${sitemapUrls.length} URLs`);
if (sitemapUrls.some((url) => /mentions-legales|politique-confidentialite|404/.test(url))) {
	errors.push('Le sitemap contient une page noindex.');
}
const cityPages = htmlFiles.filter((file) => relative(root, file).startsWith('panneau-solaire-'));
const installerPages = htmlFiles.filter((file) => relative(root, file).startsWith('installateur-solaire-'));
if (cityPages.length !== 140) errors.push(`Pages communes incomplètes : ${cityPages.length}/140`);
if (installerPages.length !== 140) errors.push(`Pages installateurs incomplètes : ${installerPages.length}/140`);
for (const installerPage of installerPages) {
	const label = relative(root, installerPage);
	if (!inboundLinks.get(label)) errors.push(`${label}: page installateur orpheline`);
}

for (const route of [
	'guide-solaire-patrimoine-bordeaux',
	'aides-panneau-solaire-33',
	'guides/prix-panneaux-solaires-gironde-2026',
	'guides/autoconsommation-solaire-bordeaux',
	'guides/rentabilite-panneaux-solaires-gironde',
	'guides/solaire-vignoble-bordelais',
	'guides/batterie-solaire-autoconsommation-gironde',
	'guides/installateur-solaire-rge-qualipv-gironde',
]) {
	try {
		await access(resolve(root, route, 'index.html'));
	} catch {
		errors.push(`Route obligatoire absente : /${route}`);
	}
}

for (const route of ['404.html', 'mentions-legales/index.html', 'politique-confidentialite/index.html']) {
	const html = await readFile(resolve(root, route), 'utf8');
	if (!/<meta name="robots" content="noindex,nofollow"/.test(html)) {
		errors.push(`${route}: directive noindex absente`);
	}
}

const localContent = JSON.parse(await readFile(resolve('src/data/local-content.json'), 'utf8'));
if (localContent.length !== 140) errors.push(`Données locales incomplètes : ${localContent.length}/140`);
for (const city of localContent) {
	if (!city.codeEpci || !city.epciName) errors.push(`${city.slug}: EPCI officiel absent`);
	if (city.solar?.source !== 'PVGIS 5.3' || city.market?.source !== 'PVGIS 5.3') errors.push(`${city.slug}: source PVGIS absente`);
	if (!Number.isFinite(city.solar?.yieldPerKwc) || city.market?.yieldPerKwc !== city.solar?.yieldPerKwc) errors.push(`${city.slug}: productible incohérent`);
	if (city.orientation !== undefined) errors.push(`${city.slug}: orientation communale artificielle`);
	if (city.priceMin !== 7000 || city.priceMax !== 22000) errors.push(`${city.slug}: faux prix local`);
	if (!Array.isArray(city.installerChecks) || city.installerChecks.length !== 3) errors.push(`${city.slug}: contrôles installateur incomplets`);
}
for (const key of ['intro', 'localIntro', 'localAdvice', 'heritage', 'metaDescription', 'cta']) {
	const uniqueCount = new Set(localContent.map((city) => city[key])).size;
	if (uniqueCount !== localContent.length) errors.push(`Bloc local "${key}" non unique : ${uniqueCount}/${localContent.length}`);
}
const uniqueFaqSets = new Set(localContent.map((city) => JSON.stringify(city.faqs))).size;
if (uniqueFaqSets !== localContent.length) errors.push(`FAQ locales non uniques : ${uniqueFaqSets}/${localContent.length}`);

if (errors.length) {
	console.error(errors.join('\n'));
	process.exit(1);
}

console.log(`${htmlFiles.length} pages HTML auditées.`);
console.log(`${checkedLinks} liens internes vérifiés.`);
console.log(`${sitemapUrls.length} URLs indexables dans le sitemap.`);
