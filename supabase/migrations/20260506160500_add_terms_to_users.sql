ALTER TABLE public.users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $function$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    user_type, 
    status, 
    plan_active, 
    created_at, 
    trial_expires_at,
    phone,
    cpf,
    estado,
    cidade,
    terms_accepted,
    terms_accepted_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'nome', 'Usuário'),
    'produtor',
    'ativo',
    'Básico',
    NOW(),
    NOW() + INTERVAL '30 days',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'estado',
    NEW.raw_user_meta_data->>'cidade',
    COALESCE((NEW.raw_user_meta_data->>'terms_accepted')::boolean, false),
    NULLIF(NEW.raw_user_meta_data->>'terms_accepted_at', '')::timestamptz
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';
