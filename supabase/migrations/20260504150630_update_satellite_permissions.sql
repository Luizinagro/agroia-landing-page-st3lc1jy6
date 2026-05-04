CREATE OR REPLACE FUNCTION public.user_has_satellite_access()
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
BEGIN
  SELECT plan_active INTO user_plan FROM public.users WHERE id = auth.uid();
  RETURN user_plan IN ('Completo', 'Família Coop');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Users can insert own satellite analyses" ON public.satellite_analyses;

CREATE POLICY "Users can insert own satellite analyses" ON public.satellite_analyses
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.user_has_satellite_access());
