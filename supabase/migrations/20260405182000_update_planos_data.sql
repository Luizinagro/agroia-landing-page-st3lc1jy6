DO $$
BEGIN
  DELETE FROM public.planos;
  
  INSERT INTO public.planos (id, nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES
  (gen_random_uuid(), 'Básico', 'Grátis', ' por 7 dias', 'Produtores que querem conhecer a plataforma', '["Acesso completo por 7 dias", "Dashboard básico com visão geral", "Até 1 propriedade", "Histórico de 7 dias", "Suporte por email", "Comunidade de usuários"]'::jsonb, 'Começar Grátis', false, 1),
  (gen_random_uuid(), 'Plantio Solo', 'R$ 149', '/mês', 'Produtores focados em lavoura', '["Tudo do plano Básico +", "Gestão completa de plantio", "Acompanhamento de safras", "Previsão de colheita", "Alertas de clima e umidade", "Cálculo de insumos", "Histórico de 1 ano", "Até 3 propriedades", "Relatórios mensais", "Suporte prioritário"]'::jsonb, 'Assinar', false, 2),
  (gen_random_uuid(), 'Pecuária Solo', 'R$ 199', '/mês', 'Produtores focados em rebanho', '["Tudo do plano Básico +", "Gestão completa do rebanho", "Rastreamento individual", "Alertas de cio", "Histórico reprodutivo", "Controle de saúde", "Cálculo de nutrição", "Histórico de 1 ano", "Até 3 propriedades", "Relatórios de desempenho", "Suporte prioritário"]'::jsonb, 'Assinar', false, 3),
  (gen_random_uuid(), 'Completo', 'R$ 349', '/mês', 'Produtores que querem visão total da operação', '["Tudo dos planos Solo +", "IA Avançada para previsões", "Dashboard integrado", "Calculadora ROI completa", "Análise de rentabilidade", "Rastreabilidade e ESG", "Marketplace integrado", "Até 5 propriedades", "Histórico ilimitado", "Integração CEPEA", "Suporte 24/7"]'::jsonb, 'Escolher plano', true, 4),
  (gen_random_uuid(), 'Família Coop', 'R$ 799', '/mês', 'Famílias, grupos e operações maiores', '["Tudo do plano Completo +", "Até 10 propriedades", "Múltiplos usuários (até 5)", "Gestão compartilhada", "Relatórios consolidados", "Consultoria dedicada", "Integração com terceiros", "API customizada", "Backup avançado", "Suporte VIP", "Treinamento para equipe"]'::jsonb, 'Assinar', false, 5);
END $$;
