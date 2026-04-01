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
