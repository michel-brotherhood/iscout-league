-- 1. Add submitted_ip column for audit
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS submitted_ip inet;

-- 2. Index for cheap rate-limit lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email_created
  ON public.contact_submissions (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_created
  ON public.contact_submissions (submitted_ip, created_at DESC);

-- 3. Drop old policy and recreate with full validation (incl. reason + email regex)
DROP POLICY IF EXISTS "Anyone can submit valid contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit valid contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(phone) BETWEEN 5 AND 40
  AND char_length(state) BETWEEN 2 AND 60
  AND role = ANY (ARRAY['dirigente','treinador','investidor','outro'])
  AND (role <> 'outro' OR (role_other IS NOT NULL AND char_length(role_other) BETWEEN 1 AND 120))
  AND reason = ANY (ARRAY['parcerias','duvidas','suporte'])
  AND char_length(message) BETWEEN 1 AND 2000
);

-- 4. Rate-limit + anti-spam trigger
CREATE OR REPLACE FUNCTION public.rate_limit_contact()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_same_email int;
  recent_same_ip int;
  hourly_same_email int;
  url_count int;
  client_ip inet;
BEGIN
  -- Capture IP from connection (works for direct PostgREST calls)
  BEGIN
    client_ip := inet_client_addr();
  EXCEPTION WHEN OTHERS THEN
    client_ip := NULL;
  END;

  NEW.submitted_ip := client_ip;

  -- Block double-submits in last 60s by email
  SELECT count(*) INTO recent_same_email
  FROM public.contact_submissions
  WHERE email = NEW.email
    AND created_at > now() - interval '60 seconds';

  IF recent_same_email > 0 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'check_violation';
  END IF;

  -- Block double-submits in last 60s by IP (if available)
  IF client_ip IS NOT NULL THEN
    SELECT count(*) INTO recent_same_ip
    FROM public.contact_submissions
    WHERE submitted_ip = client_ip
      AND created_at > now() - interval '60 seconds';

    IF recent_same_ip > 0 THEN
      RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  -- Cap at 5 submissions / hour per email
  SELECT count(*) INTO hourly_same_email
  FROM public.contact_submissions
  WHERE email = NEW.email
    AND created_at > now() - interval '1 hour';

  IF hourly_same_email >= 5 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'check_violation';
  END IF;

  -- Reject obvious link-spam: >3 URLs in message
  url_count := (
    SELECT count(*) FROM regexp_matches(NEW.message, 'https?://', 'gi')
  );
  IF url_count > 3 THEN
    RAISE EXCEPTION 'spam_links' USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_rate_limit_contact ON public.contact_submissions;
CREATE TRIGGER trg_rate_limit_contact
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.rate_limit_contact();

-- 5. LGPD: purge function (manual / scheduled later)
CREATE OR REPLACE FUNCTION public.purge_old_contact_submissions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count int;
BEGIN
  WITH d AS (
    DELETE FROM public.contact_submissions
    WHERE created_at < now() - interval '180 days'
    RETURNING 1
  )
  SELECT count(*) INTO deleted_count FROM d;
  RETURN deleted_count;
END;
$$;