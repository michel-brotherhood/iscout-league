-- Remove the public INSERT policy: only the edge function (service role) may write.
DROP POLICY IF EXISTS "Anyone can submit valid contact form" ON public.contact_submissions;

-- RLS stays enabled; with no policy for anon/authenticated, direct PostgREST writes are denied.
-- Service role bypasses RLS, so the verify-contact edge function continues to work.
-- The rate_limit_contact() trigger still runs on every insert (including from service role).