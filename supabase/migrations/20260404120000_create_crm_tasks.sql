CREATE TABLE IF NOT EXISTS public.crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own tasks" ON public.crm_tasks;
CREATE POLICY "Users can manage their own tasks" ON public.crm_tasks
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS crm_tasks_user_id_idx ON public.crm_tasks(user_id);
