-- Add pecuaria_animais table (if different from rebanho)
CREATE TABLE IF NOT EXISTS public.pecuaria_animais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tipo TEXT NOT NULL,
    peso NUMERIC NOT NULL,
    fase TEXT NOT NULL,
    racao_recomendada TEXT NOT NULL,
    custo_mensal NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add marketplace_produtos table
CREATE TABLE IF NOT EXISTS public.marketplace_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco_base NUMERIC NOT NULL,
    markup_10pct BOOLEAN NOT NULL DEFAULT true,
    preco_final NUMERIC NOT NULL,
    estoque NUMERIC NOT NULL DEFAULT 0,
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add marketplace_pedidos table
CREATE TABLE IF NOT EXISTS public.marketplace_pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    numero_pedido TEXT NOT NULL,
    data TEXT NOT NULL,
    produtos JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    frete NUMERIC NOT NULL,
    valor_total NUMERIC NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.pecuaria_animais ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own pecuaria_animais" ON public.pecuaria_animais;
CREATE POLICY "Users can manage own pecuaria_animais" ON public.pecuaria_animais FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.marketplace_produtos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read marketplace_produtos" ON public.marketplace_produtos;
CREATE POLICY "Anyone can read marketplace_produtos" ON public.marketplace_produtos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can manage own marketplace_produtos" ON public.marketplace_produtos;
CREATE POLICY "Users can manage own marketplace_produtos" ON public.marketplace_produtos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.marketplace_pedidos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own marketplace_pedidos" ON public.marketplace_pedidos;
CREATE POLICY "Users can manage own marketplace_pedidos" ON public.marketplace_pedidos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
