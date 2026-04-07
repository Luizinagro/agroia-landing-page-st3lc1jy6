-- Create clima table
CREATE TABLE IF NOT EXISTS public.clima (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE CASCADE NOT NULL,
  temperatura NUMERIC NOT NULL DEFAULT 0,
  umidade NUMERIC NOT NULL DEFAULT 0,
  precipitacao NUMERIC NOT NULL DEFAULT 0,
  vento NUMERIC NOT NULL DEFAULT 0,
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clima ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to ensure idempotency
DROP POLICY IF EXISTS "Users can view clima for their properties" ON public.clima;
DROP POLICY IF EXISTS "Users can insert clima for their properties" ON public.clima;
DROP POLICY IF EXISTS "Service role can manage all clima" ON public.clima;

-- Create policies
CREATE POLICY "Users can view clima for their properties" ON public.clima
  FOR SELECT TO authenticated
  USING (propriedade_id IN (SELECT id FROM public.propriedades WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert clima for their properties" ON public.clima
  FOR INSERT TO authenticated
  WITH CHECK (propriedade_id IN (SELECT id FROM public.propriedades WHERE user_id = auth.uid()));

-- Allow service role full access for the edge function
CREATE POLICY "Service role can manage all clima" ON public.clima
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
