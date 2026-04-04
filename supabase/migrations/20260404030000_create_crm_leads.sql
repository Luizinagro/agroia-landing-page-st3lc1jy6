DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Tenta garantir que o usuário de teste lgbwille20@gmail.com exista e seja admin
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'lgbwille20@gmail.com' LIMIT 1;
  
  IF admin_user_id IS NULL THEN
    admin_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'lgbwille20@gmail.com',
      crypt('Skip@Pass123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin AgroIA"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  INSERT INTO public.users (id, email, name, user_type, status, plan_active)
  VALUES (admin_user_id, 'lgbwille20@gmail.com', 'Admin AgroIA', 'admin', 'ativo', 'Completo')
  ON CONFLICT (id) DO UPDATE SET user_type = 'admin';

END $$;

CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    tamanho_propriedade TEXT,
    regiao TEXT,
    tipo_cultura TEXT,
    status TEXT DEFAULT 'Novo',
    valor_estimado NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_all_crm_leads" ON public.crm_leads;
CREATE POLICY "admins_all_crm_leads" ON public.crm_leads
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin'
        )
    );

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.crm_leads WHERE email = 'joao@example.com') THEN
    INSERT INTO public.crm_leads (nome, email, telefone, tamanho_propriedade, regiao, tipo_cultura, status, valor_estimado)
    VALUES 
    ('João Silva', 'joao@example.com', '11999999999', '500 ha', 'Centro-Oeste', 'Soja', 'Novo', 15000),
    ('Maria Souza', 'maria@example.com', '11888888888', '1200 ha', 'Sul', 'Milho', 'Em Negociação', 35000),
    ('Carlos Santos', 'carlos@example.com', '11777777777', '300 ha', 'Sudeste', 'Trigo', 'Convertido', 8000),
    ('Ana Costa', 'ana@example.com', '11666666666', '800 ha', 'Nordeste', 'Café', 'Perdido', 0);
  END IF;
END $$;
