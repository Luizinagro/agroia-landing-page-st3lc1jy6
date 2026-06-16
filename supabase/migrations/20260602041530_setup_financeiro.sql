DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lgbwille20@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id, '00000000-0000-0000-0000-000000000000', 'lgbwille20@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Produtor"}', false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.users (id, email, name, user_type, status, plan_active)
    VALUES (new_user_id, 'lgbwille20@gmail.com', 'Produtor', 'produtor', 'ativo', 'Lavoura')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

ALTER TABLE public.financeiro_lancamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "financeiro_lancamentos_select" ON public.financeiro_lancamentos;
CREATE POLICY "financeiro_lancamentos_select" ON public.financeiro_lancamentos
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "financeiro_lancamentos_insert" ON public.financeiro_lancamentos;
CREATE POLICY "financeiro_lancamentos_insert" ON public.financeiro_lancamentos
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "financeiro_lancamentos_update" ON public.financeiro_lancamentos;
CREATE POLICY "financeiro_lancamentos_update" ON public.financeiro_lancamentos
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "financeiro_lancamentos_delete" ON public.financeiro_lancamentos;
CREATE POLICY "financeiro_lancamentos_delete" ON public.financeiro_lancamentos
  FOR DELETE TO authenticated USING (user_id = auth.uid());
