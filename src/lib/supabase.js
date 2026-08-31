import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const SUPABASE_URL = URL;
export const SUPABASE_KEY = KEY;
export const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '';

export const supabase = URL && KEY ? createClient(URL, KEY) : null;

/** Submit contact via the verify-contact edge function (server-side hCaptcha + insert). */
export async function submitContact(payload) {
  if (!URL || !KEY) throw new Error('supabase_not_configured');
  const res = await fetch(`${URL}/functions/v1/verify-contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const err = new Error(data.error || 'request_failed');
    err.status = res.status;
    throw err;
  }
  return data;
}
