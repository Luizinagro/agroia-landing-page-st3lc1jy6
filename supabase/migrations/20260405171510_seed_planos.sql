DO $$
BEGIN
  INSERT INTO public.planos (id, nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES
  (gen_random_uuid(), 'Básico', 'Grátis', null, 'Ideal para pequenos produtores iniciando na digitalização.', '["Gestão básica de rebanho e lavoura", "Acesso à comunidade", "Alertas manuais de clima"]'::jsonb, 'Começar Grátis', false, 1),
  (gen_random_uuid(), 'Plantio Solo', 'R$ 97', '/mês', 'Foco total no monitoramento e gestão da sua lavoura.', '["Previsão de safra com IA", "Alertas climáticos automáticos", "Gestão de insumos e maquinário"]'::jsonb, 'Assinar Plantio', false, 2),
  (gen_random_uuid(), 'Pecuário Solo', 'R$ 97', '/mês', 'Gestão completa do seu rebanho e produção animal.', '["Gestão avançada de rebanho", "Controle de engorda e nutrição", "Alertas veterinários"]'::jsonb, 'Assinar Pecuária', false, 3),
  (gen_random_uuid(), 'Completo', 'R$ 197', '/mês', 'A solução definitiva com Inteligência Artificial e automação.', '["Todas as funções Solo (Plantio e Pecuária)", "Previsão IA de mercado", "Rastreabilidade completa", "Suporte prioritário via WhatsApp"]'::jsonb, 'Assinar Completo', true, 4),
  (gen_random_uuid(), 'Família Coop', 'Sob Consulta', null, 'Para cooperativas e grandes propriedades com múltiplos usuários.', '["Contas ilimitadas", "Dashboards personalizados", "Integração via API e ERP", "Gerente de conta dedicado"]'::jsonb, 'Falar com Vendas', false, 5)
  ON CONFLICT (nome) DO UPDATE SET
    preco = EXCLUDED.preco,
    periodo = EXCLUDED.periodo,
    descricao = EXCLUDED.descricao,
    features = EXCLUDED.features,
    botao = EXCLUDED.botao,
    destaque = EXCLUDED.destaque,
    ordem = EXCLUDED.ordem;
END $$;
