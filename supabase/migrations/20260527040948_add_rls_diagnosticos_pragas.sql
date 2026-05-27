DO $$
BEGIN
  -- Enable RLS
  ALTER TABLE public.diagnosticos_pragas ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if any
  DROP POLICY IF EXISTS "Users can insert own diagnosticos" ON public.diagnosticos_pragas;
  DROP POLICY IF EXISTS "Users can view own diagnosticos" ON public.diagnosticos_pragas;
  DROP POLICY IF EXISTS "Users can delete own diagnosticos" ON public.diagnosticos_pragas;
  DROP POLICY IF EXISTS "Users can update own diagnosticos" ON public.diagnosticos_pragas;

  -- Create policies
  CREATE POLICY "Users can insert own diagnosticos" ON public.diagnosticos_pragas
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can view own diagnosticos" ON public.diagnosticos_pragas
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete own diagnosticos" ON public.diagnosticos_pragas
    FOR DELETE TO authenticated USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can update own diagnosticos" ON public.diagnosticos_pragas
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

END $$;
