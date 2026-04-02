-- Create the users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT,
  nome TEXT NOT NULL,
  tipo_usuario TEXT NOT NULL,
  estado TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_trial_expira TIMESTAMP WITH TIME ZONE,
  plano_ativo TEXT DEFAULT 'Básico'
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a trigger to automatically create the profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, tipo_usuario, estado, data_criacao, data_trial_expira, plano_ativo)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE(new.raw_user_meta_data->>'tipo_usuario', 'Produtor'),
    'ativo',
    NOW(),
    NOW() + INTERVAL '30 days',
    'Básico'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = COALESCE(public.users.nome, EXCLUDED.nome),
    tipo_usuario = COALESCE(public.users.tipo_usuario, EXCLUDED.tipo_usuario),
    estado = EXCLUDED.estado;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a function to securely check if a user exists (used for authentication validation)
CREATE OR REPLACE FUNCTION public.check_user_exists(lookup_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Checks auth.users to accurately verify credentials and avoid blocking valid users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE lower(email) = lower(lookup_email)) INTO user_exists;
  
  -- Fallback to public.users just in case auth.users is inaccessible
  IF NOT user_exists THEN
    SELECT EXISTS(SELECT 1 FROM public.users WHERE lower(email) = lower(lookup_email)) INTO user_exists;
  END IF;

  RETURN user_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Expose an RPC edge function replacement for manual sync if trigger fails
CREATE OR REPLACE FUNCTION public.sync_user_profile(
  user_id UUID,
  user_email TEXT,
  user_nome TEXT,
  user_tipo TEXT,
  user_estado TEXT
)
RETURNS JSON AS $$
DECLARE
  result_record RECORD;
BEGIN
  INSERT INTO public.users (id, email, nome, tipo_usuario, estado, data_criacao, data_trial_expira, plano_ativo)
  VALUES (
    user_id,
    user_email,
    COALESCE(user_nome, 'Usuário'),
    COALESCE(user_tipo, 'Produtor'),
    'ativo',
    NOW(),
    NOW() + INTERVAL '30 days',
    'Básico'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = COALESCE(public.users.nome, EXCLUDED.nome),
    tipo_usuario = COALESCE(public.users.tipo_usuario, EXCLUDED.tipo_usuario),
    estado = EXCLUDED.estado
  RETURNING * INTO result_record;
  
  RETURN row_to_json(result_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
