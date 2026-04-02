CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL DEFAULT 'produtor',
    estado TEXT NOT NULL DEFAULT 'ativo',
    plano_ativo TEXT NOT NULL DEFAULT 'Básico',
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    data_trial_expira TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days') NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
    ON public.users FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, tipo_usuario, estado, plano_ativo, data_criacao, data_trial_expira)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'produtor'),
    COALESCE(NEW.raw_user_meta_data->>'estado', 'ativo'),
    'Básico',
    NOW(),
    NOW() + INTERVAL '30 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.previsoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cidade TEXT NOT NULL,
    cultura TEXT NOT NULL,
    temperatura NUMERIC NOT NULL,
    umidade NUMERIC NOT NULL,
    risco_pragas TEXT NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE public.alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data_leitura TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.comunidade_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE public.pecuaria_animais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    peso NUMERIC NOT NULL,
    fase TEXT NOT NULL,
    racao_recomendada TEXT NOT NULL,
    custo_mensal NUMERIC NOT NULL
);

CREATE TABLE public.marketplace_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    preco NUMERIC NOT NULL,
    markup_10pct NUMERIC NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.previsoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunidade_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pecuaria_animais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own previsoes"
    ON public.previsoes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own alertas"
    ON public.alertas FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own comunidade_posts"
    ON public.comunidade_posts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own pecuaria_animais"
    ON public.pecuaria_animais FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own marketplace_produtos"
    ON public.marketplace_produtos FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
