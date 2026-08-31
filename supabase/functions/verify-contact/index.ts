// Edge function: verifies hCaptcha token and inserts contact submission server-side.
// Runs with service role so RLS validation + DB trigger (rate-limit) still apply,
// but the captcha verification cannot be bypassed by talking to PostgREST directly.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const ROLES = ['dirigente', 'treinador', 'investidor', 'outro'] as const;
const REASONS = ['demonstracao', 'parcerias', 'duvidas', 'suporte'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+\-]{5,40}$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  state?: unknown;
  role?: unknown;
  role_other?: unknown;
  reason?: unknown;
  message?: unknown;
  captchaToken?: unknown;
};

const isStr = (v: unknown, min: number, max: number) =>
  typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  // --- Validate captcha token presence ---
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';
  if (!captchaToken) {
    return json(400, { error: 'captcha_required' });
  }

  // --- Validate fields ---
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const state = String(body.state ?? '').trim();
  const role = String(body.role ?? '').trim();
  const roleOther = body.role_other == null ? null : String(body.role_other).trim();
  const reason = String(body.reason ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!isStr(name, 1, 120)) return json(400, { error: 'invalid_name' });
  if (!isStr(email, 3, 255) || !EMAIL_RE.test(email)) return json(400, { error: 'invalid_email' });
  if (!PHONE_RE.test(phone)) return json(400, { error: 'invalid_phone' });
  if (!isStr(state, 2, 60)) return json(400, { error: 'invalid_state' });
  if (!ROLES.includes(role as (typeof ROLES)[number])) return json(400, { error: 'invalid_role' });
  if (role === 'outro' && (!roleOther || roleOther.length < 1 || roleOther.length > 120)) {
    return json(400, { error: 'invalid_role_other' });
  }
  if (!REASONS.includes(reason as (typeof REASONS)[number])) {
    return json(400, { error: 'invalid_reason' });
  }
  if (!isStr(message, 1, 2000)) return json(400, { error: 'invalid_message' });

  // --- Verify hCaptcha ---
  const secret = Deno.env.get('HCAPTCHA_SECRET_KEY') ?? '';
  if (!secret) {
    console.error('HCAPTCHA_SECRET_KEY missing');
    return json(500, { error: 'server_misconfigured' });
  }

  // Best-effort client IP (Supabase forwards it via x-forwarded-for)
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const remoteip = fwd.split(',')[0]?.trim() || undefined;

  const params = new URLSearchParams();
  params.set('secret', secret);
  params.set('response', captchaToken);
  if (remoteip) params.set('remoteip', remoteip);

  let captchaOk = false;
  try {
    const verifyRes = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const verifyJson = (await verifyRes.json()) as { success?: boolean; 'error-codes'?: string[] };
    captchaOk = !!verifyJson.success;
    if (!captchaOk) {
      console.warn('hCaptcha verification failed', verifyJson['error-codes']);
    }
  } catch (err) {
    console.error('hCaptcha network error', err);
    return json(502, { error: 'captcha_verification_failed' });
  }

  if (!captchaOk) {
    return json(403, { error: 'captcha_invalid' });
  }

  // --- Insert via service role (RLS bypassed, but DB trigger still runs) ---
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!supabaseUrl || !serviceKey) {
    return json(500, { error: 'server_misconfigured' });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await admin.from('contact_submissions').insert({
    name,
    email,
    phone,
    state,
    role,
    role_other: role === 'outro' ? roleOther : null,
    reason,
    message,
  });

  if (error) {
    const msg = error.message || '';
    if (/rate_limited|spam_links/i.test(msg) || error.code === '23514') {
      // Neutral response: do not reveal which rule fired
      return json(200, { ok: true });
    }
    console.error('insert failed', error);
    return json(500, { error: 'insert_failed' });
  }

  return json(200, { ok: true });
});
