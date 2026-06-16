DO $$
DECLARE
  new_user_id uuid;
  maquina_id uuid;
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
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'lgbwille20@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Produtor Wille"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    maquina_id := gen_random_uuid();
    INSERT INTO public.maquinas (id, user_id, nome, tipo, marca, modelo, ano, horimetro_atual)
    VALUES (maquina_id, new_user_id, 'Trator Principal', 'Trator', 'John Deere', '7J', 2021, 1200)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.maquinas_documentos (maquina_id, tipo, descricao, vencimento)
    VALUES (maquina_id, 'Seguro', 'Seguro Total', CURRENT_DATE + INTERVAL '15 days');

    INSERT INTO public.maquinas_manutencao (maquina_id, descricao, tipo_gatilho, horas_gatilho, status)
    VALUES (maquina_id, 'Troca de Óleo', 'horas', 1250, 'agendado');

    INSERT INTO public.maquinas_despesas (maquina_id, categoria, valor, data)
    VALUES (maquina_id, 'Combustível', 1500.00, CURRENT_DATE);

    maquina_id := gen_random_uuid();
    INSERT INTO public.maquinas (id, user_id, nome, tipo, marca, modelo, ano, horimetro_atual)
    VALUES (maquina_id, new_user_id, 'Colheitadeira', 'Colheitadeira', 'Case IH', 'Axial-Flow', 2020, 800)
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.maquinas_documentos (maquina_id, tipo, descricao, vencimento)
    VALUES (maquina_id, 'CRLV', 'Licenciamento Anual', CURRENT_DATE - INTERVAL '5 days');
  END IF;
END $$;
