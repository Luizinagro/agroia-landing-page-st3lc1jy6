ALTER TABLE public.animais ADD COLUMN IF NOT EXISTS proximo_cio_estimado DATE;
ALTER TABLE public.animais ADD COLUMN IF NOT EXISTS confianca_previsao NUMERIC;
ALTER TABLE public.animais ADD COLUMN IF NOT EXISTS recomendacoes_ia TEXT;
