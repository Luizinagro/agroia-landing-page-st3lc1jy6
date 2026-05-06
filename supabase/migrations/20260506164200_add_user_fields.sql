ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS estado TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cidade TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    cidade
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
    NEW.raw_user_meta_data->>'cidade'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Fallback to ensure auth.users insert doesn't fail even if public.users insert fails
  RETURN NEW;
END;
$function$;
