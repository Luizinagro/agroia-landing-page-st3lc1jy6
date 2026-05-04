-- Sincroniza plan_type com plan_active caso esteja nulo para evitar bloqueios indevidos na tela de planos
DO $DO$
BEGIN
  UPDATE public.users
  SET plan_type = plan_active
  WHERE plan_type IS NULL AND plan_active IS NOT NULL;
END $DO$;

-- Atualiza os planos dos usuários para remover a feature 'monitoramento'
UPDATE public.user_plans
SET plan_features = plan_features - 'monitoramento'
WHERE plan_features ? 'monitoramento';

-- Atualiza a tabela de planos padrão se ela existir
DO $DO$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'planos') THEN
    UPDATE public.planos
    SET features = features - 'monitoramento'
    WHERE features ? 'monitoramento';
  END IF;
END $DO$;
