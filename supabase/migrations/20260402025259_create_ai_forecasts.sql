CREATE TABLE IF NOT EXISTS public.ai_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  current_price NUMERIC NOT NULL DEFAULT 0,
  trend_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commodity TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  condition TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_forecasts_select" ON public.ai_forecasts;
CREATE POLICY "ai_forecasts_select" ON public.ai_forecasts
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "ai_forecasts_insert" ON public.ai_forecasts;
CREATE POLICY "ai_forecasts_insert" ON public.ai_forecasts
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "price_alerts_select" ON public.price_alerts;
CREATE POLICY "price_alerts_select" ON public.price_alerts
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "price_alerts_insert" ON public.price_alerts;
CREATE POLICY "price_alerts_insert" ON public.price_alerts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "price_alerts_update" ON public.price_alerts;
CREATE POLICY "price_alerts_update" ON public.price_alerts
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "price_alerts_delete" ON public.price_alerts;
CREATE POLICY "price_alerts_delete" ON public.price_alerts
  FOR DELETE TO authenticated USING (user_id = auth.uid());
