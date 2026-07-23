/**
 * Cloudflare Pages Function — panneau-solaire-gironde.fr
 * Dual-write: Supabase rank_rent_leads + ViteUnDevis category #37.
 */

const SITE_DOMAIN = 'panneau-solaire-gironde.fr';
const SITE_NICHE = 'panneau-solaire';
const DEPT_CODE = '33';
const CP_PATTERN = /^33\d{3}$/;
const CAT_ID = 37;
const CAT_NAME = 'Panneaux photovoltaïques';
const CONSENT_TEXT = 'J’accepte d’être contacté(e) par téléphone par ViteUnDevis.com et ses partenaires afin de qualifier ma demande de devis.';
const MAX_BODY_BYTES = 32_768;
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SUPABASE_URL = 'https://nhmvgsrwhjsjnpncpiaj.supabase.co';
const VUD_PING_URL = 'https://www.viteundevis.com/api/ping.php';
const VUD_POST_URL = 'https://www.viteundevis.com/api/get.php';

// Les sites Rank & Rent déjà en ligne partagent ces accès partenaire. Les
// variables Cloudflare restent prioritaires lorsqu'elles sont renseignées.
// Cela permet à une nouvelle Pages Function de recevoir des leads dès son
// premier déploiement, comme pac-nord.fr et borne-recharge-rhone.fr.
const DEFAULT_VUD_API_KEY = '17695301406978e31c715766978e31c715ae';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obXZnc3J3aGpzam5wbmNwaWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTY0NjQsImV4cCI6MjA4MzU3MjQ2NH0.qpG5CJDNa53BB7ZpDy414GL3hmb51omxqPrnrrd7O6I';

const JSON_HEADERS = {
	'Content-Type': 'application/json; charset=utf-8',
	'Cache-Control': 'no-store',
	'X-Content-Type-Options': 'nosniff',
};

function isAllowedOrigin(origin) {
	if (!origin) return false;
	try {
		const url = new URL(origin);
		const isProduction =
			url.protocol === 'https:' &&
			!url.port &&
			(url.hostname === SITE_DOMAIN || url.hostname === `www.${SITE_DOMAIN}`);
		const isLocal =
			(url.protocol === 'http:' || url.protocol === 'https:') &&
			(url.hostname === 'localhost' || url.hostname === '127.0.0.1');
		return isProduction || isLocal;
	} catch {
		return false;
	}
}

function corsHeaders(request) {
	const origin = request.headers.get('Origin') || '';
	const headers = {
		...JSON_HEADERS,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Vary': 'Origin',
	};
	if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin;
	return headers;
}

function json(request, body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: corsHeaders(request),
	});
}

function clean(value, maxLength = 180) {
	return String(value ?? '').trim().slice(0, maxLength);
}

function sourceUrl(value) {
	try {
		const url = new URL(clean(value, 500));
		const allowed = url.hostname === SITE_DOMAIN || url.hostname === `www.${SITE_DOMAIN}` || url.hostname === 'localhost' || url.hostname === '127.0.0.1';
		return allowed ? url.toString() : `https://${SITE_DOMAIN}`;
	} catch {
		return `https://${SITE_DOMAIN}`;
	}
}

function normalizePhone(value) {
	const digits = String(value ?? '').replace(/\D/g, '');
	if (digits.startsWith('33') && digits.length === 11) return `0${digits.slice(2)}`;
	return digits;
}

function isPlainObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function readBodyWithLimit(request) {
	if (!request.body) return { text: '', tooLarge: false };
	const reader = request.body.getReader();
	const decoder = new TextDecoder();
	let bytesRead = 0;
	let text = '';
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		bytesRead += value.byteLength;
		if (bytesRead > MAX_BODY_BYTES) {
			await reader.cancel().catch(() => {});
			return { text: '', tooLarge: true };
		}
		text += decoder.decode(value, { stream: true });
	}
	text += decoder.decode();
	return { text, tooLarge: false };
}

function supabaseKey(env = {}) {
	return env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

function supabaseHeaders(key, extra = {}) {
	const headers = {
		'Content-Type': 'application/json',
		apikey: key,
		...extra,
	};
	if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
	return headers;
}

function validate(body) {
	const errors = [];
	const submissionId = clean(body.submission_id, 36).toLowerCase();
	const firstName = clean(body.first_name, 80);
	const lastName = clean(body.last_name, 80);
	const email = clean(body.email, 160).toLowerCase();
	const phone = normalizePhone(body.phone);
	const postalCode = clean(body.postal_code, 5);
	const city = clean(body.project_city || body.city, 100);
	const address = clean(body.address, 180);

	if (clean(body.website)) errors.push('Requête invalide.');
	if (!UUID_V4_PATTERN.test(submissionId)) errors.push('Identifiant de soumission invalide.');
	if (firstName.length < 2) errors.push('Prénom requis.');
	if (lastName.length < 2) errors.push('Nom requis.');
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail invalide.');
	if (!/^0[1-9]\d{8}$/.test(phone)) errors.push('Téléphone invalide.');
	if (!CP_PATTERN.test(postalCode)) errors.push('Le code postal doit appartenir à la Gironde (33).');
	if (city.length < 2) errors.push('Commune requise.');
	if (address.length < 5) errors.push('Adresse du projet requise.');
	if (!['maison', 'professionnel'].includes(body.property_type)) errors.push('Type de bâtiment requis.');
	if (!['15-30', '30-50', '50+', 'unknown'].includes(body.roof_surface)) errors.push('Surface de toiture requise.');
	if (!['sud', 'sud-est', 'sud-ouest', 'est-ouest', 'unknown'].includes(body.orientation)) errors.push('Orientation requise.');
	if (!['autoconsommation', 'batterie', 'revente'].includes(body.project_goal)) errors.push('Objectif énergétique requis.');
	if (!['80', '130', '200', '300'].includes(body.monthly_bill)) errors.push('Facture électrique requise.');
	if (!['standard', 'clim', 've', 'pool', 'all'].includes(body.equipment)) errors.push('Équipements requis.');
	if (!['immediat', '3-months', '6-months', 'information'].includes(body.timeframe)) errors.push('Délai de projet requis.');
	if (body.consent !== 'true') errors.push('Votre consentement est requis.');

	return {
		errors,
		data: {
			submissionId,
			firstName,
			lastName,
			email,
			phone,
			postalCode,
			city,
			address,
			propertyType: clean(body.property_type, 40),
			roofSurface: clean(body.roof_surface, 40),
			orientation: clean(body.orientation, 40),
			projectGoal: clean(body.project_goal, 50),
			monthlyBill: clean(body.monthly_bill, 20),
			equipment: clean(body.equipment, 50),
			timeframe: clean(body.timeframe, 40),
			sourceUrl: sourceUrl(body.source_url),
			consentTimestamp: new Date().toISOString(),
		},
	};
}

function safeLog(event, details = {}) {
	console.error(JSON.stringify({ event, ...details }));
}

async function findExistingSubmission(env, submissionId) {
	const key = supabaseKey(env);
	if (!key) return { existing: null, checked: false };
	const query = new URLSearchParams({
		select: 'id,vud_status,vud_devis_id',
		source_site: `eq.${SITE_DOMAIN}`,
		'vud_response->>submission_id': `eq.${submissionId}`,
		limit: '1',
	});
	try {
		const response = await fetch(`${SUPABASE_URL}/rest/v1/rank_rent_leads?${query}`, {
			method: 'GET',
			signal: AbortSignal.timeout(5_000),
			headers: supabaseHeaders(key),
		});
		if (!response.ok) {
			safeLog('lead_idempotency_lookup_failed', { status: response.status });
			return { existing: null, checked: false };
		}
		const rows = await response.json();
		return { existing: rows?.[0] || null, checked: true };
	} catch {
		safeLog('lead_idempotency_lookup_failed', { status: 'network' });
		return { existing: null, checked: false };
	}
}

function delayCode(timeframe) {
	if (timeframe === 'immediat') return '1';
	if (timeframe === '3-months' || timeframe === '6-months') return '2';
	if (timeframe === 'information') return '4';
	return '3';
}

function propertyCode(propertyType) {
	return propertyType === 'professionnel' ? '4' : '2';
}

function buildDescription(data) {
	const goalLabels = {
		autoconsommation: 'réduction des factures et autoconsommation',
		batterie: 'autonomie avec batterie LFP',
		revente: 'production et valorisation de la toiture',
	};
	return [
		`Projet: ${CAT_NAME} à ${data.city} (${data.postalCode}).`,
		`Bâtiment: ${data.propertyType}; toiture: ${data.roofSurface}; orientation: ${data.orientation}.`,
		`Objectif: ${goalLabels[data.projectGoal] || data.projectGoal}; facture mensuelle: ${data.monthlyBill} €; équipements: ${data.equipment}.`,
		`Délai: ${data.timeframe}. Adresse chantier: ${data.address}, ${data.postalCode} ${data.city}.`,
	].join(' ');
}

async function insertSupabase(env, request, data, description) {
	const key = supabaseKey(env);
	if (!key) return { id: null, error: 'Clé Supabase manquante' };

	const payload = {
		source_site: SITE_DOMAIN,
		niche: SITE_NICHE,
		nom: data.lastName,
		prenom: data.firstName,
		email: data.email,
		telephone: data.phone,
		adresse: data.address,
		ville: data.city,
		code_postal: data.postalCode,
		departement: DEPT_CODE,
		cat_id: CAT_ID,
		cat_name: CAT_NAME,
		type_bien: propertyCode(data.propertyType),
		situation: '1',
		chauffage_actuel: data.equipment || null,
		delais: delayCode(data.timeframe),
		description,
		ip_address: request.headers.get('CF-Connecting-IP') || '',
		user_agent: clean(request.headers.get('User-Agent'), 500),
		page_url: data.sourceUrl,
		vud_status: 'pending',
		vud_response: {
			submission_id: data.submissionId,
			consent: {
				date: data.consentTimestamp,
				ip: request.headers.get('CF-Connecting-IP') || '',
				text: CONSENT_TEXT,
				url: data.sourceUrl,
			},
		},
	};

	try {
		const response = await fetch(`${SUPABASE_URL}/rest/v1/rank_rent_leads`, {
			method: 'POST',
			signal: AbortSignal.timeout(8_000),
			headers: supabaseHeaders(key, { Prefer: 'return=representation' }),
			body: JSON.stringify(payload),
		});
		if (!response.ok) return { id: null, error: `Supabase ${response.status}` };
		const rows = await response.json();
		return { id: rows?.[0]?.id || null, error: null };
	} catch {
		return { id: null, error: 'Supabase indisponible' };
	}
}

async function pingVud(apiKey, data, description) {
	const body = new URLSearchParams({
		token: apiKey,
		cat_id: String(CAT_ID),
		code_postal: data.postalCode,
		pays: 'fr',
		description,
		cpl_mini: '0',
	});
	try {
		const response = await fetch(VUD_PING_URL, {
			method: 'POST',
			signal: AbortSignal.timeout(6_000),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body,
		});
		if (!response.ok) {
			return {
				ok: false,
				payload: { accept: 0, recommande: 0, cpl: '0', ecpl: '0', buyers: 0 },
				error: `http_${response.status}`,
			};
		}
		let payload;
		try {
			payload = await response.json();
		} catch {
			return {
				ok: false,
				payload: { accept: 0, recommande: 0, cpl: '0', ecpl: '0', buyers: 0 },
				error: 'invalid_response',
			};
		}
		const hasDecision =
			isPlainObject(payload) &&
			['0', '1'].includes(String(payload.accept)) &&
			['0', '1'].includes(String(payload.recommande));
		if (!hasDecision || (payload.error && String(payload.error) !== '0')) {
			return {
				ok: false,
				payload: isPlainObject(payload) ? payload : { accept: 0, recommande: 0, cpl: '0', ecpl: '0', buyers: 0 },
				error: hasDecision ? 'partner_error' : 'invalid_response',
			};
		}
		return { ok: true, payload, error: null };
	} catch {
		return {
			ok: false,
			payload: { accept: 0, recommande: 0, cpl: '0', ecpl: '0', buyers: 0 },
			error: 'network',
		};
	}
}

async function postVud(apiKey, data, description, request) {
	const isMobile = data.phone.startsWith('06') || data.phone.startsWith('07');
	const body = new URLSearchParams({
		key: apiKey,
		cat_id: String(CAT_ID),
		nom: data.lastName,
		prenom: data.firstName,
		email: data.email,
		tel: isMobile ? '' : data.phone,
		mobile: isMobile ? data.phone : '',
		adresse1: data.address,
		adresse2: '',
		cp: data.postalCode,
		ville: data.city,
		cp_projet: data.postalCode,
		ville_projet: data.city,
		pays: 'fr',
		tp: '1',
		type_bien: propertyCode(data.propertyType),
		situation: '1',
		delais: delayCode(data.timeframe),
		terrain: '0',
		permis: '3',
		description,
		site_name: SITE_DOMAIN,
		format_return: 'json',
		matin: '1',
		midi: '1',
		soir: '1',
		we: '0',
		consent_date: data.consentTimestamp,
		consent_ip: request.headers.get('CF-Connecting-IP') || '',
		consent_texte: CONSENT_TEXT,
		consent_url: data.sourceUrl,
	});
	try {
		const response = await fetch(VUD_POST_URL, {
			method: 'POST',
			signal: AbortSignal.timeout(10_000),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': `partenaire-apivud-${apiKey}`,
			},
			body,
		});
		const text = await response.text();
		if (!response.ok) {
			return {
				ok: false,
				payload: { code_retour: [{ code: String(response.status), code_texte: 'Service partenaire indisponible' }] },
				error: `http_${response.status}`,
			};
		}
		try {
			const payload = JSON.parse(text);
			if (!isPlainObject(payload)) {
				return {
					ok: false,
					payload: { code_retour: [{ code: '502', code_texte: 'Réponse partenaire invalide' }] },
					error: 'invalid_response',
				};
			}
			return { ok: true, payload, error: null };
		} catch {
			return {
				ok: false,
				payload: { code_retour: [{ code: '502', code_texte: 'Réponse partenaire invalide' }] },
				error: 'invalid_response',
			};
		}
	} catch {
		return {
			ok: false,
			payload: { code_retour: [{ code: '503', code_texte: 'Service partenaire indisponible' }] },
			error: 'network',
		};
	}
}

async function updateSupabase(env, id, ping, vud, data, request, status, partnerError = null) {
	const key = supabaseKey(env);
	if (!id || !key) return { synced: false, reason: 'not_configured' };
	const code = String(vud?.code_retour?.[0]?.code || '');
	const devisId = vud?.devis_data?.devis_id || '';
	const payload = {
		vud_ping_accept: Number(ping.accept) === 1,
		vud_ping_recommande: Number(ping.recommande) === 1,
		vud_ping_cpl: Number(ping.cpl) || 0,
		vud_ping_ecpl: Number(ping.ecpl) || 0,
		vud_ping_buyers: Number(ping.buyers) || 0,
		vud_devis_id: devisId ? `#${devisId}` : null,
		vud_devis_hash: vud?.devis_data?.devis_hash || null,
		vud_status: status || (code === '200' ? 'sent' : 'error'),
		vud_response: {
			submission_id: data.submissionId,
			consent: {
				date: data.consentTimestamp,
				ip: request.headers.get('CF-Connecting-IP') || '',
				text: CONSENT_TEXT,
				url: data.sourceUrl,
			},
			ping,
			response: vud,
			partner_error: partnerError,
		},
		vud_cpl: Number(ping.cpl) || 0,
		updated_at: new Date().toISOString(),
	};
	try {
		const response = await fetch(`${SUPABASE_URL}/rest/v1/rank_rent_leads?id=eq.${encodeURIComponent(id)}&select=id`, {
			method: 'PATCH',
			signal: AbortSignal.timeout(8_000),
			headers: supabaseHeaders(key, { Prefer: 'return=representation' }),
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			safeLog('lead_tracking_sync_failed', { request_id: id, status: response.status });
			return { synced: false, reason: 'http_error' };
		}
		let rows;
		try {
			rows = await response.json();
		} catch {
			safeLog('lead_tracking_sync_failed', { request_id: id, status: 'invalid_response' });
			return { synced: false, reason: 'invalid_response' };
		}
		if (!Array.isArray(rows) || rows[0]?.id !== id) {
			safeLog('lead_tracking_sync_failed', { request_id: id, status: 'not_updated' });
			return { synced: false, reason: 'not_updated' };
		}
		return { synced: true, reason: null };
	} catch {
		safeLog('lead_tracking_sync_failed', { request_id: id, status: 'network' });
		return { synced: false, reason: 'network' };
	}
}

export async function onRequestOptions(context) {
	const origin = context.request.headers.get('Origin') || '';
	if (!isAllowedOrigin(origin)) {
		return json(context.request, { success: false, message: 'Origine non autorisée.' }, 403);
	}
	return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
	const request = context.request;
	const env = context.env || {};
	const origin = request.headers.get('Origin') || '';
	if (!isAllowedOrigin(origin)) {
		return json(request, { success: false, message: 'Origine non autorisée.' }, 403);
	}
	const contentLength = Number(request.headers.get('Content-Length') || 0);
	if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
		return json(request, { success: false, message: 'Requête trop volumineuse.' }, 413);
	}
	if (!request.headers.get('Content-Type')?.includes('application/json')) {
		return json(request, { success: false, message: 'Format de requête invalide.' }, 415);
	}

	let rawBody;
	let body;
	try {
		const bodyRead = await readBodyWithLimit(request);
		if (bodyRead.tooLarge) {
			return json(request, { success: false, message: 'Requête trop volumineuse.' }, 413);
		}
		rawBody = bodyRead.text;
	} catch {
		return json(request, { success: false, message: 'Corps JSON invalide.' }, 400);
	}
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json(request, { success: false, message: 'Corps JSON invalide.' }, 400);
	}
	if (!isPlainObject(body)) {
		return json(request, { success: false, message: 'Le corps JSON doit être un objet.' }, 400);
	}

	const { errors, data } = validate(body);
	if (errors.length) return json(request, { success: false, message: errors[0], errors }, 400);

	const apiKey = env.VUD_API_KEY || DEFAULT_VUD_API_KEY;
	if (!apiKey || !supabaseKey(env)) {
		return json(request, { success: false, message: 'Le service de devis est momentanément indisponible.' }, 503);
	}

	const description = buildDescription(data);
	const lookup = await findExistingSubmission(env, data.submissionId);
	if (lookup.existing?.id) {
		const existingStatus = clean(lookup.existing.vud_status, 40) || 'pending';
		const sent = existingStatus === 'sent';
		const outcome = sent
			? 'sent'
			: existingStatus === 'no_buyer'
				? 'no_buyer'
				: existingStatus === 'ping_error' || existingStatus === 'post_error'
					? 'partner_unavailable'
					: 'captured';
		return json(request, {
			success: true,
			duplicate: true,
			request_id: lookup.existing.id,
			devis_id: clean(lookup.existing.vud_devis_id, 80).replace(/^#/, '') || null,
			queued: !sent,
			outcome,
			tracking_sync: 'existing',
		});
	}
	const supabase = await insertSupabase(env, request, data, description);
	if (supabase.error || !supabase.id) {
		return json(request, {
			success: false,
			message: 'Votre demande ne peut pas être enregistrée pour le moment. Merci de réessayer plus tard.',
		}, 503);
	}
	const pingResult = await pingVud(apiKey, data, description);
	const ping = pingResult.payload;
	if (!pingResult.ok) {
		const sync = await updateSupabase(env, supabase.id, ping, null, data, request, 'ping_error', {
			stage: 'ping',
			code: pingResult.error,
		});
		return json(request, {
			success: true,
			message: 'Votre demande est bien enregistrée et sera traitée prochainement.',
			request_id: supabase.id,
			queued: true,
			outcome: 'partner_unavailable',
			partner_stage: 'ping',
			tracking_sync: sync.synced ? 'synced' : 'failed',
		});
	}
	if (Number(ping.accept) !== 1 && Number(ping.recommande) !== 1) {
		const sync = await updateSupabase(env, supabase.id, ping, null, data, request, 'no_buyer');
		return json(request, {
			success: true,
			request_id: supabase.id,
			queued: true,
			outcome: 'no_buyer',
			tracking_sync: sync.synced ? 'synced' : 'failed',
		});
	}
	const postResult = await postVud(apiKey, data, description, request);
	const vud = postResult.payload;

	const code = String(vud?.code_retour?.[0]?.code || '');
	const status = !postResult.ok ? 'post_error' : code === '200' ? 'sent' : 'rejected';
	const sync = await updateSupabase(
		env,
		supabase.id,
		ping,
		vud,
		data,
		request,
		status,
		postResult.ok ? null : { stage: 'post', code: postResult.error },
	);
	if (code === '200') {
		return json(request, {
			success: true,
			request_id: supabase.id,
			devis_id: vud?.devis_data?.devis_id || null,
			outcome: 'sent',
			tracking_sync: sync.synced ? 'synced' : 'failed',
		});
	}

	return json(request, {
		success: true,
		message: 'Votre demande est bien enregistrée et sera traitée prochainement.',
		request_id: supabase.id,
		queued: true,
		outcome: postResult.ok ? 'partner_rejected' : 'partner_unavailable',
		partner_stage: 'post',
		tracking_sync: sync.synced ? 'synced' : 'failed',
	});
}
