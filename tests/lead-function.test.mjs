import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequestOptions, onRequestPost } from '../functions/api/lead.js';

const validPayload = {
	first_name: 'Marie',
	last_name: 'Durand',
	email: 'marie@example.test',
	phone: '0612345678',
	postal_code: '33000',
	project_city: 'Bordeaux',
	address: '12 rue de Test',
	property_type: 'maison',
	roof_surface: '30-50',
	orientation: 'sud',
	project_goal: 'autoconsommation',
	monthly_bill: '200',
	equipment: 've',
	timeframe: '3-months',
	source_url: 'https://panneau-solaire-gironde.fr/devis',
	consent: 'true',
	consent_timestamp: '2026-07-23T10:00:00.000Z',
	submission_id: '5f8c1a4e-7f3b-4c3d-9a21-43c0f431a9de',
	website: '',
};

function requestFor(payload, {
	origin = 'https://panneau-solaire-gironde.fr',
	omitOrigin = false,
	contentLength,
	rawBody,
} = {}) {
	const headers = {
		'Content-Type': 'application/json',
		'CF-Connecting-IP': '203.0.113.1',
	};
	if (!omitOrigin) headers.Origin = origin;
	if (contentLength) headers['Content-Length'] = String(contentLength);
	return new Request('https://panneau-solaire-gironde.fr/api/lead', {
		method: 'POST',
		headers,
		body: rawBody ?? JSON.stringify(payload),
	});
}

test('refuse un code postal hors Gironde avant tout appel externe', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor({ ...validPayload, postal_code: '31000' }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 400);
		const body = await response.json();
		assert.equal(body.success, false);
		assert.match(body.message, /Gironde/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('respecte l’ordre dual-write Supabase → ping → VUD → update', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), method: options.method, body: String(options.body || '') });
		if (calls.length === 1) {
			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		if (calls.length === 2) {
			return new Response(JSON.stringify([{ id: 'lead-test-1' }]), {
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		if (calls.length === 3) {
			return new Response(JSON.stringify({ accept: 1, recommande: 1, cpl: '37', ecpl: '37', buyers: 2 }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		if (calls.length === 4) {
			return new Response(JSON.stringify({
				code_retour: [{ code: '200', code_texte: 'OK' }],
				devis_data: { devis_id: '123', devis_hash: 'abc' },
			}), { status: 200, headers: { 'Content-Type': 'application/json' } });
		}
		return new Response(JSON.stringify([{ id: 'lead-test-1' }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
	};

	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 200);
		const result = await response.json();
		assert.equal(result.success, true);
		assert.equal(result.outcome, 'sent');
		assert.equal(result.tracking_sync, 'synced');
		assert.equal(calls.length, 5);
		assert.match(calls[0].url, /vud_response/);
		assert.match(calls[1].url, /rank_rent_leads$/);
		assert.match(calls[2].url, /ping\.php$/);
		assert.match(calls[3].url, /get\.php$/);
		assert.match(calls[4].url, /rank_rent_leads\?id=eq\.lead-test-1&select=id$/);
		assert.match(calls[3].body, /cat_id=37/);
		assert.match(calls[3].body, /cp=33000/);
		assert.match(calls[3].body, /type_bien=2/);
		assert.match(calls[3].body, /consent_date=/);
		assert.match(calls[3].body, /consent_ip=203.0.113.1/);
		assert.match(calls[3].body, /consent_texte=/);
		assert.match(calls[3].body, /consent_url=https%3A%2F%2Fpanneau-solaire-gironde.fr%2Fdevis/);
		assert.match(calls[1].body, /"vud_response":\{"submission_id":/);
		assert.match(calls[4].body, /"submission_id":"5f8c1a4e-7f3b-4c3d-9a21-43c0f431a9de"/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('refuse tout POST sans en-tête Origin', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload, { omitOrigin: true }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 403);
		assert.match((await response.json()).message, /Origine/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('répond correctement au preflight local et refuse un preflight sans Origin', async () => {
	const allowedRequest = new Request('http://localhost:4324/api/lead', {
		method: 'OPTIONS',
		headers: {
			Origin: 'http://localhost:4324',
			'Access-Control-Request-Method': 'POST',
		},
	});
	const allowed = await onRequestOptions({ request: allowedRequest });
	assert.equal(allowed.status, 204);
	assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), 'http://localhost:4324');
	assert.equal(allowed.headers.get('Access-Control-Allow-Methods'), 'POST, OPTIONS');

	const rejected = await onRequestOptions({
		request: new Request('https://panneau-solaire-gironde.fr/api/lead', { method: 'OPTIONS' }),
	});
	assert.equal(rejected.status, 403);
	assert.equal(rejected.headers.get('Access-Control-Allow-Origin'), null);
});

test('refuse un consentement ambigu ou faux', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor({ ...validPayload, consent: 'false' }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 400);
		assert.match((await response.json()).message, /consentement/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('refuse une origine ressemblante mais étrangère', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload, { origin: 'https://panneau-solaire-gironde.fr.example.com' }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 403);
		assert.match((await response.json()).message, /Origine/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('refuse les valeurs techniques hors liste avant tout appel externe', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor({ ...validPayload, roof_surface: '1000+', equipment: 'inconnu' }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 400);
		assert.match((await response.json()).message, /Surface/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('refuse une requête annoncée au-delà de 32 Ko', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload, { contentLength: 40_000 }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 413);
		assert.match((await response.json()).message, /volumineuse/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('refuse un corps réellement supérieur à 32 Ko même sans Content-Length', async () => {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error('fetch ne doit pas être appelé');
	};
	try {
		const response = await onRequestPost({
			request: requestFor(null, { rawBody: JSON.stringify({ padding: 'x'.repeat(33_000) }) }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 413);
		assert.match((await response.json()).message, /volumineuse/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('refuse proprement les corps JSON null et tableau', async () => {
	for (const payload of [null, []]) {
		const response = await onRequestPost({
			request: requestFor(payload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 400);
		assert.match((await response.json()).message, /objet/);
	}
});

test('conserve le lead dans Supabase sans envoi VUD lorsqu’aucun acheteur ne répond au ping', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), body: String(options.body || '') });
		if (calls.length === 1) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 2) return new Response(JSON.stringify([{ id: 'lead-test-2' }]), { status: 201, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 3) return new Response(JSON.stringify({ accept: 0, recommande: 0, cpl: '0', buyers: 0, error: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		return new Response(JSON.stringify([{ id: 'lead-test-2' }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		const body = await response.json();
		assert.equal(response.status, 200);
		assert.equal(body.success, true);
		assert.equal(body.queued, true);
		assert.equal(body.outcome, 'no_buyer');
		assert.equal(calls.length, 4);
		assert.doesNotMatch(calls[3].url, /get\.php$/);
		assert.match(calls[3].body, /"vud_status":"no_buyer"/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('classe une panne du ping VUD en ping_error, jamais en no_buyer', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), body: String(options.body || '') });
		if (calls.length === 1) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 2) return new Response(JSON.stringify([{ id: 'lead-test-ping' }]), { status: 201, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 3) throw new Error('Ping indisponible');
		return new Response(JSON.stringify([{ id: 'lead-test-ping' }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		const body = await response.json();
		assert.equal(response.status, 200);
		assert.equal(body.success, true);
		assert.equal(body.outcome, 'partner_unavailable');
		assert.equal(body.partner_stage, 'ping');
		assert.match(calls[3].body, /"vud_status":"ping_error"/);
		assert.doesNotMatch(calls[3].body, /"vud_status":"no_buyer"/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('confirme la capture Supabase si ViteUnDevis devient indisponible après le ping', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), body: String(options.body || '') });
		if (calls.length === 1) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 2) return new Response(JSON.stringify([{ id: 'lead-test-3' }]), { status: 201, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 3) return new Response(JSON.stringify({ accept: 1, recommande: 1, cpl: '37', buyers: 1 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 4) throw new Error('VUD indisponible');
		return new Response(JSON.stringify([{ id: 'lead-test-3' }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		const body = await response.json();
		assert.equal(response.status, 200);
		assert.equal(body.success, true);
		assert.equal(body.queued, true);
		assert.equal(body.outcome, 'partner_unavailable');
		assert.equal(body.partner_stage, 'post');
		assert.equal(calls.length, 5);
		assert.match(calls[4].body, /"vud_status":"post_error"/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('n’envoie jamais le lead à ViteUnDevis si Supabase ne peut pas l’enregistrer', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), method: options.method });
		if (calls.length === 1) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
		return new Response(JSON.stringify({ message: 'RLS blocked' }), { status: 401 });
	};

	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 503);
		assert.equal(calls.length, 2);
		assert.equal(calls[0].method, 'GET');
		assert.match(calls[1].url, /rank_rent_leads$/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('normalise un numéro +33 avec espaces avant stockage', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), body: String(options.body || '') });
		if (calls.length === 1) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 2) return new Response(JSON.stringify([{ id: 'lead-phone' }]), { status: 201, headers: { 'Content-Type': 'application/json' } });
		if (calls.length === 3) return new Response(JSON.stringify({ accept: 0, recommande: 0, buyers: 0, error: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		return new Response(JSON.stringify([{ id: 'lead-phone' }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
	};
	try {
		const response = await onRequestPost({
			request: requestFor({ ...validPayload, phone: '+33 6 12 34 56 78' }),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		assert.equal(response.status, 200);
		assert.match(calls[1].body, /"telephone":"0612345678"/);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('réutilise une soumission existante sans doublonner ni appeler VUD', async () => {
	const originalFetch = globalThis.fetch;
	const calls = [];
	globalThis.fetch = async (url, options = {}) => {
		calls.push({ url: String(url), method: options.method });
		return new Response(JSON.stringify([{
			id: 'lead-existing',
			vud_status: 'sent',
			vud_devis_id: '#456',
		}]), { status: 200, headers: { 'Content-Type': 'application/json' } });
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		const body = await response.json();
		assert.equal(response.status, 200);
		assert.equal(body.duplicate, true);
		assert.equal(body.request_id, 'lead-existing');
		assert.equal(body.devis_id, '456');
		assert.equal(body.outcome, 'sent');
		assert.equal(calls.length, 1);
		assert.equal(calls[0].method, 'GET');
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('signale un échec de synchronisation du PATCH sans perdre la capture', async () => {
	const originalFetch = globalThis.fetch;
	const originalConsoleError = console.error;
	const logs = [];
	console.error = (message) => logs.push(String(message));
	let call = 0;
	globalThis.fetch = async () => {
		call += 1;
		if (call === 1) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
		if (call === 2) return new Response(JSON.stringify([{ id: 'lead-sync-fail' }]), { status: 201, headers: { 'Content-Type': 'application/json' } });
		if (call === 3) return new Response(JSON.stringify({ accept: 0, recommande: 0, buyers: 0, error: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		return new Response(JSON.stringify({ error: 'failure' }), { status: 500 });
	};
	try {
		const response = await onRequestPost({
			request: requestFor(validPayload),
			env: { VUD_API_KEY: 'test-key', SUPABASE_ANON_KEY: 'test-key' },
		});
		const body = await response.json();
		assert.equal(body.success, true);
		assert.equal(body.tracking_sync, 'failed');
		assert.equal(logs.length, 1);
		assert.match(logs[0], /lead_tracking_sync_failed/);
		assert.doesNotMatch(logs[0], /test-key|marie@example/);
	} finally {
		globalThis.fetch = originalFetch;
		console.error = originalConsoleError;
	}
});
