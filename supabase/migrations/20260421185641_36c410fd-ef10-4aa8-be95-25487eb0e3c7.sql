-- Replace the permissive INSERT policy with one that validates input lengths
DROP POLICY "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit valid contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 255
  AND char_length(phone) BETWEEN 5 AND 40
  AND char_length(state) BETWEEN 2 AND 60
  AND role IN ('dirigente', 'treinador', 'investidor', 'outro')
  AND (role <> 'outro' OR (role_other IS NOT NULL AND char_length(role_other) BETWEEN 1 AND 120))
  AND char_length(message) BETWEEN 1 AND 2000
);