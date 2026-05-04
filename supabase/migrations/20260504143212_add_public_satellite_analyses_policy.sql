DROP POLICY IF EXISTS "Public can read satellite_analyses" ON public.satellite_analyses;
CREATE POLICY "Public can read satellite_analyses" ON public.satellite_analyses
  FOR SELECT TO anon, authenticated USING (true);
