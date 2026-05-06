DO $$
BEGIN
  -- user_estoque
  CREATE TABLE IF NOT EXISTS public.user_estoque (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      item_nome TEXT NOT NULL,
      categoria TEXT,
      quantidade NUMERIC NOT NULL DEFAULT 0,
      unidade TEXT DEFAULT 'un',
      custo_total NUMERIC NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- maquinario
  CREATE TABLE IF NOT EXISTS public.maquinario (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      nome TEXT NOT NULL,
      modelo TEXT,
      horas_uso NUMERIC NOT NULL DEFAULT 0,
      proxima_manutencao_horas NUMERIC,
      status TEXT DEFAULT 'Operacional',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- agenda_manejo
  CREATE TABLE IF NOT EXISTS public.agenda_manejo (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      titulo TEXT NOT NULL,
      data_prevista DATE NOT NULL,
      status TEXT DEFAULT 'Pendente',
      tipo_atividade TEXT,
      clima_recomendado BOOLEAN,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- safras_benchmarking
  CREATE TABLE IF NOT EXISTS public.safras_benchmarking (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      ano TEXT NOT NULL,
      cultura TEXT NOT NULL,
      sacas_por_ha NUMERIC NOT NULL,
      custo_por_ha NUMERIC NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
END $$;

-- RLS user_estoque
ALTER TABLE public.user_estoque ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_estoque_all" ON public.user_estoque;
CREATE POLICY "user_estoque_all" ON public.user_estoque FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS maquinario
ALTER TABLE public.maquinario ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "maquinario_all" ON public.maquinario;
CREATE POLICY "maquinario_all" ON public.maquinario FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS agenda_manejo
ALTER TABLE public.agenda_manejo ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agenda_manejo_all" ON public.agenda_manejo;
CREATE POLICY "agenda_manejo_all" ON public.agenda_manejo FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS safras_benchmarking
ALTER TABLE public.safras_benchmarking ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "safras_benchmarking_all" ON public.safras_benchmarking;
CREATE POLICY "safras_benchmarking_all" ON public.safras_benchmarking FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
