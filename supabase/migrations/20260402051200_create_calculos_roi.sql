CREATE TABLE IF NOT EXISTS public.calculos_roi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    custo_producao NUMERIC NOT NULL,
    receita_esperada NUMERIC NOT NULL,
    tempo_retorno NUMERIC NOT NULL,
    lucro_liquido NUMERIC NOT NULL,
    margem_lucro NUMERIC NOT NULL,
    roi_percentual NUMERIC NOT NULL,
    payback_meses NUMERIC NOT NULL,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.calculos_roi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calculos_roi_select" ON public.calculos_roi;
CREATE POLICY "calculos_roi_select" ON public.calculos_roi
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "calculos_roi_insert" ON public.calculos_roi;
CREATE POLICY "calculos_roi_insert" ON public.calculos_roi
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "calculos_roi_update" ON public.calculos_roi;
CREATE POLICY "calculos_roi_update" ON public.calculos_roi
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "calculos_roi_delete" ON public.calculos_roi;
CREATE POLICY "calculos_roi_delete" ON public.calculos_roi
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE VIEW public.usuarios AS
SELECT 
  id, 
  email, 
  name as nome, 
  plan_active as plano
FROM public.users;
