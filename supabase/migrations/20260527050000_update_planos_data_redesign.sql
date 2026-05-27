DO $$
BEGIN
  -- Update existing users with new plan names safely
  UPDATE public.users SET plan_active = 'Explorador' WHERE plan_active = 'Básico';
  UPDATE public.users SET plan_active = 'Lavoura' WHERE plan_active = 'Plantio Solo';
  UPDATE public.users SET plan_active = 'Rebanho' WHERE plan_active = 'Pecuário Solo' OR plan_active = 'Pecuária Solo';
  UPDATE public.users SET plan_active = 'Fazendeiro Completo' WHERE plan_active = 'Completo';
  UPDATE public.users SET plan_active = 'Cooperativa' WHERE plan_active = 'Família Coop';

  -- Update user_plans table safely
  UPDATE public.user_plans SET plan_name = 'Explorador' WHERE plan_name = 'Básico';
  UPDATE public.user_plans SET plan_name = 'Lavoura' WHERE plan_name = 'Plantio Solo';
  UPDATE public.user_plans SET plan_name = 'Rebanho' WHERE plan_name = 'Pecuário Solo' OR plan_name = 'Pecuária Solo';
  UPDATE public.user_plans SET plan_name = 'Fazendeiro Completo' WHERE plan_name = 'Completo';
  UPDATE public.user_plans SET plan_name = 'Cooperativa' WHERE plan_name = 'Família Coop';

  -- Replace existing plans in the public.planos table
  DELETE FROM public.planos;
  
  INSERT INTO public.planos (id, nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES
  (gen_random_uuid(), 'Explorador', 'Grátis', ' (7 dias)', 'Ideal para quem quer descobrir...', '["Dashboard básico", "Cadastro 1 propriedade", "Clima", "Comunidade (Leitura)"]'::jsonb, 'Começar Grátis — sem cartão', false, 1),
  (gen_random_uuid(), 'Lavoura', 'R$ 149', '/mês', 'Para o produtor focado na lavoura', '["Tudo do Explorador", "Satélite (NDVI + umidade)", "Consultor IA (15/mês)", "Pragas (10/mês)", "Previsão commodities", "Calendário", "Irrigação", "ROI"]'::jsonb, 'Assinar Lavoura', false, 2),
  (gen_random_uuid(), 'Rebanho', 'R$ 199', '/mês', 'Para quem cria com inteligência', '["Tudo do Explorador", "Gestão rebanho", "Rastreamento", "Alertas Cio", "Nutrição", "Consultor IA (15/mês)", "Doenças por foto (10/mês)"]'::jsonb, 'Assinar Rebanho', false, 3),
  (gen_random_uuid(), 'Fazendeiro Completo', 'R$ 349', '/mês', 'Visão total e ferramentas avançadas', '["TUDO ILIMITADO", "Carbono 🌱", "CRM", "Dashboard Consolidado", "Consultoria mensal"]'::jsonb, '🚀 Quero o Completo', true, 4),
  (gen_random_uuid(), 'Cooperativa', 'R$ 799', '/mês', 'Para famílias, grupos e cooperativas', '["Tudo do Completo", "5 usuários", "10 propriedades", "API customizada", "Backup real-time"]'::jsonb, 'Falar com Consultor', false, 5);
END $$;
