-- Update crm_tasks RLS to allow admins to manage all tasks
DROP POLICY IF EXISTS "Users can manage their own tasks" ON public.crm_tasks;
CREATE POLICY "Users can manage their own tasks" ON public.crm_tasks
    FOR ALL TO authenticated USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.user_type = 'admin')
    ) WITH CHECK (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.user_type = 'admin')
    );

-- Update the plans table to match the new permissions
DO $$
BEGIN
  INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES 
  (
    'Básico', 
    'Grátis', 
    ' por 7 dias', 
    'Produtores que querem conhecer a plataforma',
    '["✅ Criar conta e acessar plataforma", "✅ Visualizar dashboard básico", "✅ Adicionar 1 propriedade", "✅ Ver histórico de 7 dias", "✅ Acessar comunidade (leitura)", "❌ Não pode postar na comunidade", "❌ Não pode usar IA Avançada", "❌ Não pode acessar calculadora ROI", "❌ Não pode usar marketplace", "❌ Não pode gerar relatórios avançados", "ℹ️ Limite de Dados: 1 propriedade, 7 dias de histórico", "ℹ️ Suporte: Email apenas (resposta em até 48h)"]'::jsonb,
    'Começar Grátis',
    false,
    1
  ) ON CONFLICT (nome) DO UPDATE SET 
    preco = EXCLUDED.preco, periodo = EXCLUDED.periodo, descricao = EXCLUDED.descricao, features = EXCLUDED.features, botao = EXCLUDED.botao, destaque = EXCLUDED.destaque, ordem = EXCLUDED.ordem;

  INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES 
  (
    'Plantio Solo', 
    'R$ 149', 
    '/mês', 
    'Produtores focados em lavoura',
    '["✅ Tudo do Básico +", "✅ Gestão completa de plantio", "✅ Criar múltiplas safras", "✅ Acompanhar ciclo de plantio", "✅ Receber alertas de clima", "✅ Calcular insumos necessários", "✅ Gerar relatórios mensais", "✅ Acessar histórico de 1 ano", "✅ Postar na comunidade", "❌ Não pode gerenciar rebanho", "❌ Não pode usar IA Avançada", "❌ Não pode acessar calculadora ROI", "❌ Não pode usar marketplace", "❌ Não pode integrar com APIs externas", "ℹ️ Limite de Dados: 3 propriedades, 1 ano de histórico", "ℹ️ Suporte: Email prioritário, Chat básico"]'::jsonb,
    'Assinar',
    false,
    2
  ) ON CONFLICT (nome) DO UPDATE SET 
    preco = EXCLUDED.preco, periodo = EXCLUDED.periodo, descricao = EXCLUDED.descricao, features = EXCLUDED.features, botao = EXCLUDED.botao, destaque = EXCLUDED.destaque, ordem = EXCLUDED.ordem;

  INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES 
  (
    'Pecuária Solo', 
    'R$ 199', 
    '/mês', 
    'Produtores focados em rebanho',
    '["✅ Tudo do Básico +", "✅ Gestão completa do rebanho", "✅ Rastrear animais individualmente", "✅ Alertas de cio (detecção de calor)", "✅ Histórico reprodutivo", "✅ Controle de vacinação", "✅ Cálculo de nutrição e ração", "✅ Gerar relatórios de desempenho", "✅ Acessar histórico de 1 ano", "✅ Postar na comunidade", "❌ Não pode gerenciar plantio", "❌ Não pode usar IA Avançada", "❌ Não pode acessar calculadora ROI", "❌ Não pode usar marketplace", "❌ Não pode integrar com APIs externas", "ℹ️ Limite de Dados: 3 propriedades, 1 ano de histórico", "ℹ️ Suporte: Email prioritário, Chat básico"]'::jsonb,
    'Assinar',
    false,
    3
  ) ON CONFLICT (nome) DO UPDATE SET 
    preco = EXCLUDED.preco, periodo = EXCLUDED.periodo, descricao = EXCLUDED.descricao, features = EXCLUDED.features, botao = EXCLUDED.botao, destaque = EXCLUDED.destaque, ordem = EXCLUDED.ordem;

  INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES 
  (
    'Completo', 
    'R$ 349', 
    '/mês', 
    'Produtores que querem visão total da operação',
    '["✅ Tudo dos planos Solo +", "✅ IA Avançada (previsões e recomendações)", "✅ Dashboard integrado", "✅ Calculadora ROI completa", "✅ Análise de rentabilidade", "✅ Rastreabilidade e ESG", "✅ Certificação de sustentabilidade", "✅ Marketplace de insumos", "✅ Integração com APIs de preço", "✅ Gerar relatórios avançados", "✅ Acessar histórico ilimitado", "✅ Participar de grupos privados", "✅ Agendar consultoria (1x/mês)", "❌ Não pode gerenciar múltiplos usuários", "❌ Não pode acessar API customizada", "ℹ️ Limite de Dados: 5 propriedades, histórico ilimitado, 50GB", "ℹ️ Suporte: Chat 24/7, VIP, webinars"]'::jsonb,
    'Escolher plano',
    true,
    4
  ) ON CONFLICT (nome) DO UPDATE SET 
    preco = EXCLUDED.preco, periodo = EXCLUDED.periodo, descricao = EXCLUDED.descricao, features = EXCLUDED.features, botao = EXCLUDED.botao, destaque = EXCLUDED.destaque, ordem = EXCLUDED.ordem;

  INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem)
  VALUES 
  (
    'Família Coop', 
    'R$ 799', 
    '/mês', 
    'Famílias, grupos e operações maiores',
    '["✅ Tudo do plano Completo +", "✅ Gerenciar até 5 usuários com permissões", "✅ Visualizar relatórios consolidados", "✅ Análise comparativa entre propriedades", "✅ Consultoria dedicada mensal", "✅ Integração com sistemas de terceiros", "✅ Acesso à API customizada", "✅ Backup automático em tempo real", "✅ Armazenamento ilimitado", "✅ Acesso antecipado a novas funcionalidades", "✅ Treinamento personalizado para equipe", "ℹ️ Limite de Dados: 10 propriedades, histórico ilimitado, API", "ℹ️ Suporte: Email VIP, Telefone dedicado (30min)"]'::jsonb,
    'Assinar',
    false,
    5
  ) ON CONFLICT (nome) DO UPDATE SET 
    preco = EXCLUDED.preco, periodo = EXCLUDED.periodo, descricao = EXCLUDED.descricao, features = EXCLUDED.features, botao = EXCLUDED.botao, destaque = EXCLUDED.destaque, ordem = EXCLUDED.ordem;
END $$;
