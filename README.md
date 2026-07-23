# Panneau Solaire Gironde

Site Rank & Rent photovoltaïque pour la Gironde (33), construit avec Astro 7 en génération statique et une fonction Cloudflare Pages pour le formulaire de devis.

## Stack

- Astro 7.1.3
- CSS vanilla
- `@astrojs/sitemap`
- Cloudflare Pages Functions
- Supabase `rank_rent_leads`
- ViteUnDevis catégorie 37

## Commandes

```bash
npm install
npm run generate:data
npm run verify:data
npm run dev -- --background
npm test
npm run build
npm run audit:site
```

Le build Cloudflare est généré dans `dist`.

## Variables Cloudflare

Créer les variables suivantes dans Cloudflare Pages, pour `Production` et `Preview` :

```text
VUD_API_KEY
SUPABASE_PUBLISHABLE_KEY
```

`SUPABASE_ANON_KEY` reste accepté pour la clé JWT historique. Une seule des deux clés Supabase est nécessaire. Les variables Cloudflare sont facultatives : elles surchargent la configuration partenaire commune déjà utilisée par les sites Rank & Rent existants. Le fichier `.dev.vars.example` documente les noms acceptés si une rotation de clés est nécessaire.

## Configuration Cloudflare Pages

- Build command : `npm run build`
- Build output directory : `dist`
- Node.js : `22.12` ou supérieur
- Root directory : `/`

La fonction `/functions/api/lead.js` est détectée automatiquement par Cloudflare Pages.

En développement, `astro dev` expose aussi `/api/lead/` via un pont local vers cette même fonction. Le formulaire peut donc être testé sur `localhost` sans publier le site et sans obtenir une réponse HTML à la place du JSON attendu.

## Sécurité et fiabilité du tunnel

- seuls les `Origin` exacts du domaine, de `www` et de l’environnement local sont acceptés ;
- le corps JSON est lu en flux et interrompu au-delà de 32 Ko, même sans `Content-Length` ;
- chaque tentative reçoit un UUID v4 `submission_id`, conservé lors d’une nouvelle tentative client et recherché avant l’insertion ;
- `no_buyer`, `ping_error`, `post_error`, `rejected` et `sent` restent distincts dans Supabase et dans l’issue renvoyée au navigateur ;
- le résultat du `PATCH` de suivi Supabase est contrôlé et exposé sous la forme `tracking_sync`, sans donnée sensible dans les logs ;
- l’événement `lead_submitted` transporte `outcome`, `request_id` et `devis_id`. Ces valeurs sont aussi encodées dans `query_string`, champ actuellement conservé par le collecteur PimpSEO.

L’idempotence est volontairement **best effort** : `submission_id` est stocké dans le JSON `vud_response`, sans contrainte unique en base. Deux requêtes strictement simultanées peuvent donc encore passer la recherche préalable. Pour une garantie forte, il faudra ajouter une colonne dédiée avec index `UNIQUE`. Aucun faux « champ de temps signé » n’est ajouté : une valeur générée uniquement dans le navigateur serait falsifiable. `Origin` et le honeypot réduisent les soumissions triviales mais ne remplacent pas un rate limiting Cloudflare ou Turnstile lorsqu’une clé sera disponible.

## Contenu programmatique

`scripts/fetch-cities.mjs` récupère les communes de 2 000 habitants ou plus, leurs EPCI et leurs coordonnées depuis `geo.api.gouv.fr`. Il interroge ensuite PVGIS 5.3 pour chaque centre communal : système fixe de 1 kWc, silicium cristallin, 14 % de pertes, horizon et angles optimisés. Les réponses sont mises en cache dans `src/data/communes.json`; `npm run refresh:solar` force leur actualisation.

`scripts/generate-local-content.mjs` transforme uniquement ces données vérifiables en blocs locaux :

- productible PVGIS et méthode de calcul ;
- population, surface, densité et EPCI officiels ;
- contexte territorial sans déduire de quartier, de monument ou de type de toiture ;
- contrôles techniques et administratifs propres au profil communal ;
- FAQ et grille de vérification d’un installateur ;
- fourchette éditoriale Gironde commune de 7 000 à 22 000 € pour 3 à 9 kWc.

`npm run verify:data` refuse les rendements issus d’un hash, les communes sans source PVGIS/EPCI et les anciennes anecdotes géographiquement incohérentes.

Les pages générées sont :

- `/panneau-solaire-[commune]` ;
- `/installateur-solaire-[commune]`.

## Vérifications

Le script `npm run audit:site` contrôle toutes les pages produites :

- présence du title, de la meta description, du canonical et du H1 ;
- validité des liens internes ;
- volume et propreté du sitemap ;
- exclusion des pages `noindex`.

Les tests Node simulent l’API afin de vérifier la validation `33xxx`, les pannes partenaires, les corps invalides, l’idempotence et l’ordre :

1. recherche du `submission_id` dans Supabase ;
2. Supabase INSERT ;
3. ViteUnDevis PING ;
4. ViteUnDevis POST ;
5. Supabase UPDATE vérifié.

Ils n’envoient aucun lead réel.
