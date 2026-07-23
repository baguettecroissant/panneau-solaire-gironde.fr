// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { onRequestOptions, onRequestPost } from './functions/api/lead.js';

function devLeadApi() {
	return {
		name: 'panneau-solaire-gironde-dev-lead-api',
		hooks: {
			'astro:server:setup': ({ server }) => {
				const handler = async (req, res, next) => {
				const pathname = new URL(req.url || '/', 'http://localhost').pathname;
				if (pathname !== '/api/lead' && pathname !== '/api/lead/') return next();
				if (req.method !== 'POST' && req.method !== 'OPTIONS') {
					res.statusCode = 405;
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					res.end(JSON.stringify({ success: false, message: 'Méthode non autorisée.' }));
					return;
				}

				try {
					const request = new Request(new URL(req.url || '/', 'http://localhost'), {
						method: req.method,
						headers: req.headers,
						body: req.method === 'POST' ? req : undefined,
						duplex: req.method === 'POST' ? 'half' : undefined,
					});
					const response = req.method === 'OPTIONS'
						? await onRequestOptions({ request, env: process.env })
						: await onRequestPost({ request, env: process.env });
					res.statusCode = response.status;
					response.headers.forEach((value, key) => res.setHeader(key, value));
					res.end(Buffer.from(await response.arrayBuffer()));
				} catch {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					res.end(JSON.stringify({ success: false, message: 'Une erreur serveur est survenue.' }));
				}
				};
				// Astro applique la redirection trailingSlash avant les middlewares
				// ajoutés normalement. Celui-ci doit donc être placé en tête pour
				// laisser l'API conserver son URL canonique sans slash.
				server.middlewares.stack.unshift({ route: '', handle: handler });
			},
		},
	};
}

export default defineConfig({
	site: 'https://panneau-solaire-gironde.fr',
	output: 'static',
	// Les pages sont générées sous forme de répertoires (`/route/index.html`) :
	// l’URL publique, les canonicals et le sitemap utilisent donc tous un slash final.
	trailingSlash: 'always',
	integrations: [
		devLeadApi(),
		sitemap({
			changefreq: 'weekly',
			filter: (page) =>
				!page.endsWith('/mentions-legales/') &&
				!page.endsWith('/politique-confidentialite/') &&
				!page.endsWith('/404/'),
			serialize(item) {
				const pathname = new URL(item.url).pathname;
				if (pathname === '/') item.priority = 1;
				else if (pathname.startsWith('/panneau-solaire-')) item.priority = 0.9;
				else if (pathname.startsWith('/installateur-solaire-')) item.priority = 0.82;
				else if (pathname.startsWith('/guides/')) item.priority = 0.75;
				else item.priority = 0.85;
				return item;
			},
		}),
	],
	build: {
		format: 'directory',
	},
});
