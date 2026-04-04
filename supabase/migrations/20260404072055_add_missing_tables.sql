-- Add dashboard_history table
CREATE TABLE IF NOT EXISTS public.dashboard_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day TEXT NOT NULL,
    temp NUMERIC NOT NULL DEFAULT 0,
    humidity NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add dashboard_kpis table
CREATE TABLE IF NOT EXISTS public.dashboard_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    produtividade NUMERIC NOT NULL DEFAULT 85,
    sensores_ativos TEXT NOT NULL DEFAULT '12/12',
    saude_safra TEXT NOT NULL DEFAULT 'Excelente',
    receita_estimada TEXT NOT NULL DEFAULT 'Em alta',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add weather_forecasts table
CREATE TABLE IF NOT EXISTS public.weather_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cidade TEXT NOT NULL,
    cultura TEXT NOT NULL,
    temperatura NUMERIC NOT NULL,
    umidade NUMERIC NOT NULL,
    risco_pragas TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add system_alerts table
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tipo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data_leitura TIMESTAMPTZ,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comunidade_posts table
CREATE TABLE IF NOT EXISTS public.comunidade_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS Policies
-- dashboard_history
ALTER TABLE public.dashboard_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own dashboard_history" ON public.dashboard_history;
CREATE POLICY "Users can read own dashboard_history" ON public.dashboard_history FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- dashboard_kpis
ALTER TABLE public.dashboard_kpis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own dashboard_kpis" ON public.dashboard_kpis;
CREATE POLICY "Users can read own dashboard_kpis" ON public.dashboard_kpis FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- weather_forecasts
ALTER TABLE public.weather_forecasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own weather_forecasts" ON public.weather_forecasts;
CREATE POLICY "Users can read own weather_forecasts" ON public.weather_forecasts FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own weather_forecasts" ON public.weather_forecasts;
CREATE POLICY "Users can insert own weather_forecasts" ON public.weather_forecasts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own weather_forecasts" ON public.weather_forecasts;
CREATE POLICY "Users can update own weather_forecasts" ON public.weather_forecasts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own weather_forecasts" ON public.weather_forecasts;
CREATE POLICY "Users can delete own weather_forecasts" ON public.weather_forecasts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- system_alerts
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own system_alerts" ON public.system_alerts;
CREATE POLICY "Users can read own system_alerts" ON public.system_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own system_alerts" ON public.system_alerts;
CREATE POLICY "Users can update own system_alerts" ON public.system_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- comunidade_posts
ALTER TABLE public.comunidade_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own comunidade_posts" ON public.comunidade_posts;
CREATE POLICY "Users can read own comunidade_posts" ON public.comunidade_posts FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own comunidade_posts" ON public.comunidade_posts;
CREATE POLICY "Users can insert own comunidade_posts" ON public.comunidade_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own comunidade_posts" ON public.comunidade_posts;
CREATE POLICY "Users can update own comunidade_posts" ON public.comunidade_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comunidade_posts" ON public.comunidade_posts;
CREATE POLICY "Users can delete own comunidade_posts" ON public.comunidade_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
