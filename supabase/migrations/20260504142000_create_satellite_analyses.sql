CREATE TABLE IF NOT EXISTS public.satellite_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  ndvi_value NUMERIC NOT NULL,
  soil_moisture NUMERIC NOT NULL,
  temperature NUMERIC NOT NULL,
  image_url TEXT,
  analysis_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.satellite_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own satellite analyses" ON public.satellite_analyses;
CREATE POLICY "Users can insert own satellite analyses" ON public.satellite_analyses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own satellite analyses" ON public.satellite_analyses;
CREATE POLICY "Users can read own satellite analyses" ON public.satellite_analyses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
