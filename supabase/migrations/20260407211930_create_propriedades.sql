CREATE TABLE IF NOT EXISTS public.propriedades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  cultura_principal TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.propriedades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own propriedades" ON public.propriedades;
CREATE POLICY "Users can manage own propriedades" ON public.propriedades
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS propriedades_user_id_idx ON public.propriedades USING btree (user_id);
