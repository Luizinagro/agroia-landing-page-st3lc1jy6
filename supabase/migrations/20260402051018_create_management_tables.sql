-- Create 'rebanho' table
CREATE TABLE IF NOT EXISTS public.rebanho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_animal TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  data_entrada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'previsoes' table
CREATE TABLE IF NOT EXISTS public.previsoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cultura TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  preco_atual NUMERIC NOT NULL DEFAULT 0,
  previsao_30d NUMERIC,
  previsao_60d NUMERIC,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'rastreabilidade' table
CREATE TABLE IF NOT EXISTS public.rastreabilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responsavel TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'carrinho' table
CREATE TABLE IF NOT EXISTS public.carrinho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantidade NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rebanho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previsoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rastreabilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrinho ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'rebanho'
DROP POLICY IF EXISTS "rebanho_select" ON public.rebanho;
CREATE POLICY "rebanho_select" ON public.rebanho
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "rebanho_insert" ON public.rebanho;
CREATE POLICY "rebanho_insert" ON public.rebanho
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rebanho_update" ON public.rebanho;
CREATE POLICY "rebanho_update" ON public.rebanho
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rebanho_delete" ON public.rebanho;
CREATE POLICY "rebanho_delete" ON public.rebanho
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for 'previsoes'
DROP POLICY IF EXISTS "previsoes_select" ON public.previsoes;
CREATE POLICY "previsoes_select" ON public.previsoes
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "previsoes_insert" ON public.previsoes;
CREATE POLICY "previsoes_insert" ON public.previsoes
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "previsoes_update" ON public.previsoes;
CREATE POLICY "previsoes_update" ON public.previsoes
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "previsoes_delete" ON public.previsoes;
CREATE POLICY "previsoes_delete" ON public.previsoes
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for 'rastreabilidade'
DROP POLICY IF EXISTS "rastreabilidade_select" ON public.rastreabilidade;
CREATE POLICY "rastreabilidade_select" ON public.rastreabilidade
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "rastreabilidade_insert" ON public.rastreabilidade;
CREATE POLICY "rastreabilidade_insert" ON public.rastreabilidade
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rastreabilidade_update" ON public.rastreabilidade;
CREATE POLICY "rastreabilidade_update" ON public.rastreabilidade
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rastreabilidade_delete" ON public.rastreabilidade;
CREATE POLICY "rastreabilidade_delete" ON public.rastreabilidade
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for 'carrinho'
DROP POLICY IF EXISTS "carrinho_select" ON public.carrinho;
CREATE POLICY "carrinho_select" ON public.carrinho
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "carrinho_insert" ON public.carrinho;
CREATE POLICY "carrinho_insert" ON public.carrinho
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "carrinho_update" ON public.carrinho;
CREATE POLICY "carrinho_update" ON public.carrinho
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "carrinho_delete" ON public.carrinho;
CREATE POLICY "carrinho_delete" ON public.carrinho
  FOR DELETE TO authenticated USING (user_id = auth.uid());
