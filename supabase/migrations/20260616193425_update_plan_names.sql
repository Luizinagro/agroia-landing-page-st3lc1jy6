DO $$
BEGIN
  -- Update user plans names safely in users table
  UPDATE public.users SET plan_active = 'Explorador' WHERE plan_active = 'Básico';
  UPDATE public.users SET plan_active = 'Lavoura' WHERE plan_active = 'Plantio Solo';
  UPDATE public.users SET plan_active = 'Rebanho' WHERE plan_active = 'Pecuário Solo';
  UPDATE public.users SET plan_active = 'Fazendeiro Completo' WHERE plan_active = 'Completo';
  UPDATE public.users SET plan_active = 'Cooperativa' WHERE plan_active = 'Família Coop';
  
  -- Update user plans names safely in user_plans table
  UPDATE public.user_plans SET plan_name = 'Explorador' WHERE plan_name = 'Básico';
  UPDATE public.user_plans SET plan_name = 'Lavoura' WHERE plan_name = 'Plantio Solo';
  UPDATE public.user_plans SET plan_name = 'Rebanho' WHERE plan_name = 'Pecuário Solo';
  UPDATE public.user_plans SET plan_name = 'Fazendeiro Completo' WHERE plan_name = 'Completo';
  UPDATE public.user_plans SET plan_name = 'Cooperativa' WHERE plan_name = 'Família Coop';

  -- Clean up old plan entries
  DELETE FROM public.planos WHERE nome IN ('Básico', 'Plantio Solo', 'Pecuário Solo', 'Completo', 'Família Coop');
  
  -- Insert or update new plans
  INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem) VALUES
  ('Explorador', 'Grátis', '', 'Para quem está começando', '["dashboard", "comunidade"]'::jsonb, 'Começar Grátis', false, 1),
  ('Lavoura', 'R$ 149', '/mês', 'Foco em agricultura', '["dashboard", "comunidade", "roi", "loja", "previsao-ia"]'::jsonb, 'Assinar Lavoura', false, 2),
  ('Rebanho', 'R$ 199', '/mês', 'Foco em pecuária', '["dashboard", "comunidade", "pecuaria", "rastreabilidade", "loja"]'::jsonb, 'Assinar Rebanho', false, 3),
  ('Fazendeiro Completo', 'R$ 349', '/mês', 'Solução 360', '["dashboard", "comunidade", "roi", "loja", "pecuaria", "rastreabilidade", "previsao-ia", "analise-satelite", "crm", "faturamento", "meus-calculos", "checkout"]'::jsonb, 'Quero o Fazendeiro Completo', true, 4),
  ('Cooperativa', 'R$ 799', '/mês', 'Para multi propriedades', '["dashboard", "comunidade", "roi", "loja", "pecuaria", "rastreabilidade", "multi_propriedade", "previsao-ia", "analise-satelite", "crm", "faturamento", "meus-calculos", "checkout"]'::jsonb, 'Falar com Consultor', false, 5)
  ON CONFLICT (nome) DO UPDATE SET 
    preco = EXCLUDED.preco, 
    periodo = EXCLUDED.periodo, 
    features = EXCLUDED.features, 
    botao = EXCLUDED.botao, 
    destaque = EXCLUDED.destaque;
END $$;
