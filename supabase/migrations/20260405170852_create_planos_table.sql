CREATE TABLE IF NOT EXISTS public.planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  preco TEXT NOT NULL,
  periodo TEXT,
  descricao TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  botao TEXT NOT NULL,
  destaque BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read planos" ON public.planos;
CREATE POLICY "Anyone can read planos" ON public.planos FOR SELECT USING (true);

INSERT INTO public.planos (nome, preco, periodo, descricao, features, botao, destaque, ordem) VALUES
  ('Básico', 'Grátis', NULL, 'Ideal para pequenos produtores iniciando na digitalização.', '["Gestão básica de rebanho e lavoura", "Acesso à comunidade", "Alertas manuais de clima"]'::jsonb, 'Começar Grátis', false, 1),
  ('Plantio Solo', 'R$ 79', '/mês', 'Foco total no monitoramento e gestão da sua lavoura.', '["Previsão de safra com IA", "Alertas climáticos automáticos", "Gestão de insumos e maquinário"]'::jsonb, 'Assinar Plantio', false, 2),
  ('Pecuário Solo', 'R$ 79', '/mês', 'Gestão completa do seu rebanho e produção animal.', '["Gestão avançada de rebanho", "Controle de engorda e nutrição", "Alertas veterinários"]'::jsonb, 'Assinar Pecuária', false, 3),
  ('Completo', 'R$ 149', '/mês', 'A solução definitiva com Inteligência Artificial e automação.', '["Todas as funções Solo (Plantio e Pecuária)", "Previsão IA de mercado", "Rastreabilidade completa", "Suporte prioritário via WhatsApp"]'::jsonb, 'Assinar Completo', true, 4),
  ('Família Coop', 'Sob Consulta', NULL, 'Para cooperativas e grandes propriedades com múltiplos usuários.', '["Contas ilimitadas", "Dashboards personalizados", "Integração via API e ERP", "Gerente de conta dedicado"]'::jsonb, 'Falar com Vendas', false, 5)
ON CONFLICT (nome) DO UPDATE SET 
  preco = EXCLUDED.preco, 
  periodo = EXCLUDED.periodo, 
  descricao = EXCLUDED.descricao, 
  features = EXCLUDED.features, 
  botao = EXCLUDED.botao, 
  destaque = EXCLUDED.destaque,
  ordem = EXCLUDED.ordem;
