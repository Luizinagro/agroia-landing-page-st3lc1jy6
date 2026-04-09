-- Allow users to see other users so they can assign tasks in a team environment
DROP POLICY IF EXISTS "Users can read all users" ON public.users;
CREATE POLICY "Users can read all users" ON public.users FOR SELECT TO authenticated USING (true);

-- Add assignment tracking fields to crm_tasks
ALTER TABLE public.crm_tasks ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id);
ALTER TABLE public.crm_tasks ADD COLUMN IF NOT EXISTS assigned_by_name TEXT;

-- Update RLS for tasks to ensure assigned users can also see their tasks
DROP POLICY IF EXISTS "Users can manage their own tasks" ON public.crm_tasks;
CREATE POLICY "Users can manage their own tasks" ON public.crm_tasks
    FOR ALL TO authenticated 
    USING (auth.uid() = user_id OR auth.uid() = assigned_by) 
    WITH CHECK (auth.uid() = user_id OR auth.uid() = assigned_by);
