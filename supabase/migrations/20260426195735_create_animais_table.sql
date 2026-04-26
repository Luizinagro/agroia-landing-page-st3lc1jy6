CREATE TABLE IF NOT EXISTS public.animais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    raca TEXT,
    data_nascimento DATE,
    peso_atual NUMERIC,
    ultima_data_cio DATE,
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP POLICY IF EXISTS "Users can manage own animais" ON public.animais;
CREATE POLICY "Users can manage own animais" ON public.animais
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.animais ENABLE ROW LEVEL SECURITY;
