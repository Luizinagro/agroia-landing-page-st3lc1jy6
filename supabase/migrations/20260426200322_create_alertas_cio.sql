CREATE TABLE IF NOT EXISTS public.alertas_cio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  animal_id UUID REFERENCES public.animais(id) ON DELETE CASCADE NOT NULL,
  mensagem TEXT NOT NULL,
  data_alerta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.alertas_cio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own alertas_cio" ON public.alertas_cio;
CREATE POLICY "Users can manage own alertas_cio" ON public.alertas_cio
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all alertas_cio" ON public.alertas_cio;
CREATE POLICY "Service role can manage all alertas_cio" ON public.alertas_cio
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS alertas_cio_user_id_idx ON public.alertas_cio USING btree (user_id);
CREATE INDEX IF NOT EXISTS alertas_cio_animal_id_idx ON public.alertas_cio USING btree (animal_id);

-- Seed an animal close to estrus to trigger an alert if one doesn't exist
DO $$
DECLARE
  v_user_id UUID;
  v_animal_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.animais 
      WHERE user_id = v_user_id 
        AND proximo_cio_estimado >= CURRENT_DATE 
        AND proximo_cio_estimado <= CURRENT_DATE + INTERVAL '3 days'
    ) THEN
      v_animal_id := gen_random_uuid();
      INSERT INTO public.animais (
        id, user_id, nome, tipo, raca, proximo_cio_estimado, confianca_previsao, recomendacoes_ia, ultima_data_cio
      ) VALUES (
        v_animal_id, 
        v_user_id, 
        'Estrela (Simulado)', 
        'Gado', 
        'Nelore', 
        CURRENT_DATE + INTERVAL '2 days', 
        92, 
        'Atenção redobrada nos próximos dias. Sugerida suplementação mineral e observação de sinais clínicos.',
        CURRENT_DATE - INTERVAL '19 days'
      );
    END IF;
  END IF;
END $$;
