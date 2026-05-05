CREATE TABLE IF NOT EXISTS public.consultas_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  regiao TEXT NOT NULL,
  pergunta TEXT NOT NULL,
  resposta JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP POLICY IF EXISTS "Users can manage own consultas_ia" ON public.consultas_ia;
CREATE POLICY "Users can manage own consultas_ia" ON public.consultas_ia
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.consultas_ia ENABLE ROW LEVEL SECURITY;
