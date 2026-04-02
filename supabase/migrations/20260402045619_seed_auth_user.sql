DO $
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
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'lgbwille20@gmail.com',
      crypt('Skip@Pass123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin AgroIA"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- The trigger handle_new_user might run and insert a public.users row. Update if so, else insert.
    INSERT INTO public.users (id, email, name, user_type, status, plan_active)
    VALUES (new_user_id, 'lgbwille20@gmail.com', 'Admin AgroIA', 'produtor', 'ativo', 'Plantio Solo')
    ON CONFLICT (id) DO UPDATE SET plan_active = 'Plantio Solo';
  END IF;
END $;
