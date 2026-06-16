DO $$
BEGIN
  -- Atualizar user_subscriptions
  UPDATE public.user_subscriptions
  SET plano = 'explorador'
  WHERE plano IN ('Básico', 'Explorador', 'explorador');

  UPDATE public.user_subscriptions
  SET plano = 'lavoura'
  WHERE plano IN ('Plantio Solo', 'Lavoura', 'lavoura');

  UPDATE public.user_subscriptions
  SET plano = 'rebanho'
  WHERE plano IN ('Pecuário Solo', 'Pecuária Solo', 'Rebanho', 'rebanho');

  UPDATE public.user_subscriptions
  SET plano = 'fazendeiro_completo'
  WHERE plano IN ('Completo', 'Fazendeiro Completo', 'fazendeiro_completo');

  UPDATE public.user_subscriptions
  SET plano = 'cooperativa'
  WHERE plano IN ('Família Coop', 'Cooperativa', 'cooperativa');

  -- Atualizar users.plan_active
  UPDATE public.users
  SET plan_active = 'Explorador'
  WHERE plan_active IN ('Básico', 'Explorador', 'explorador');

  UPDATE public.users
  SET plan_active = 'Lavoura'
  WHERE plan_active IN ('Plantio Solo', 'Lavoura', 'lavoura');

  UPDATE public.users
  SET plan_active = 'Rebanho'
  WHERE plan_active IN ('Pecuário Solo', 'Pecuária Solo', 'Rebanho', 'rebanho');

  UPDATE public.users
  SET plan_active = 'Fazendeiro Completo'
  WHERE plan_active IN ('Completo', 'Fazendeiro Completo', 'fazendeiro_completo');

  UPDATE public.users
  SET plan_active = 'Cooperativa'
  WHERE plan_active IN ('Família Coop', 'Cooperativa', 'cooperativa');

  -- Delete duplicates before updating plan_permissions just in case
  DELETE FROM public.plan_permissions WHERE plano IN ('explorador', 'lavoura', 'rebanho', 'fazendeiro_completo', 'cooperativa');

  -- Reinserir as permissões consistentes baseadas na especificação
  -- Explorador
  INSERT INTO public.plan_permissions (plano, modulo, permitido) VALUES
    ('explorador', 'dashboard', true),
    ('explorador', 'comunidade', true),
    ('explorador', 'consultor-ia-agro', true),
    ('explorador', 'analise-satelite', true),
    ('explorador', 'calendario-agricola', true),
    ('explorador', 'precos-tempo-real', true),
    ('explorador', 'previsao-ia', true)
  ON CONFLICT (plano, modulo) DO UPDATE SET permitido = true;

  -- Lavoura
  INSERT INTO public.plan_permissions (plano, modulo, permitido) VALUES
    ('lavoura', 'dashboard', true),
    ('lavoura', 'comunidade', true),
    ('lavoura', 'consultor-ia-agro', true),
    ('lavoura', 'analise-satelite', true),
    ('lavoura', 'calendario-agricola', true),
    ('lavoura', 'precos-tempo-real', true),
    ('lavoura', 'previsao-ia', true),
    ('lavoura', 'diagnostico-pragas', true),
    ('lavoura', 'irrigacao', true),
    ('lavoura', 'roi', true),
    ('lavoura', 'resumo-semanal', true),
    ('lavoura', 'loja', true),
    ('lavoura', 'gestao', true),
    ('lavoura', 'gestao-financeira', true),
    ('lavoura', 'insumos', true),
    ('lavoura', 'maquinario', true)
  ON CONFLICT (plano, modulo) DO UPDATE SET permitido = true;

  -- Rebanho
  INSERT INTO public.plan_permissions (plano, modulo, permitido) VALUES
    ('rebanho', 'dashboard', true),
    ('rebanho', 'comunidade', true),
    ('rebanho', 'consultor-ia-agro', true),
    ('rebanho', 'analise-satelite', true),
    ('rebanho', 'calendario-agricola', true),
    ('rebanho', 'precos-tempo-real', true),
    ('rebanho', 'previsao-ia', true),
    ('rebanho', 'calculadora-carbono', true),
    ('rebanho', 'whatsapp-alertas', true),
    ('rebanho', 'maquinario', true),
    ('rebanho', 'pecuaria', true),
    ('rebanho', 'rastreabilidade', true),
    ('rebanho', 'loja', true),
    ('rebanho', 'gestao', true),
    ('rebanho', 'gestao-financeira', true)
  ON CONFLICT (plano, modulo) DO UPDATE SET permitido = true;

  -- Fazendeiro Completo
  INSERT INTO public.plan_permissions (plano, modulo, permitido) VALUES
    ('fazendeiro_completo', 'dashboard', true),
    ('fazendeiro_completo', 'comunidade', true),
    ('fazendeiro_completo', 'consultor-ia-agro', true),
    ('fazendeiro_completo', 'analise-satelite', true),
    ('fazendeiro_completo', 'calendario-agricola', true),
    ('fazendeiro_completo', 'precos-tempo-real', true),
    ('fazendeiro_completo', 'previsao-ia', true),
    ('fazendeiro_completo', 'diagnostico-pragas', true),
    ('fazendeiro_completo', 'irrigacao', true),
    ('fazendeiro_completo', 'roi', true),
    ('fazendeiro_completo', 'resumo-semanal', true),
    ('fazendeiro_completo', 'loja', true),
    ('fazendeiro_completo', 'gestao', true),
    ('fazendeiro_completo', 'gestao-financeira', true),
    ('fazendeiro_completo', 'insumos', true),
    ('fazendeiro_completo', 'maquinario', true),
    ('fazendeiro_completo', 'calculadora-carbono', true),
    ('fazendeiro_completo', 'whatsapp-alertas', true),
    ('fazendeiro_completo', 'pecuaria', true),
    ('fazendeiro_completo', 'rastreabilidade', true),
    ('fazendeiro_completo', 'gestao-insumos', true),
    ('fazendeiro_completo', 'gestao-rh', true),
    ('fazendeiro_completo', 'crm', true),
    ('fazendeiro_completo', 'dashboard-consolidado', true),
    ('fazendeiro_completo', 'faturamento', true),
    ('fazendeiro_completo', 'meus-calculos', true),
    ('fazendeiro_completo', 'checkout', true),
    ('fazendeiro_completo', 'consultores', true),
    ('fazendeiro_completo', 'analise-compartilhada', true)
  ON CONFLICT (plano, modulo) DO UPDATE SET permitido = true;

  -- Cooperativa
  INSERT INTO public.plan_permissions (plano, modulo, permitido) VALUES
    ('cooperativa', 'dashboard', true),
    ('cooperativa', 'comunidade', true),
    ('cooperativa', 'consultor-ia-agro', true),
    ('cooperativa', 'analise-satelite', true),
    ('cooperativa', 'calendario-agricola', true),
    ('cooperativa', 'precos-tempo-real', true),
    ('cooperativa', 'previsao-ia', true),
    ('cooperativa', 'diagnostico-pragas', true),
    ('cooperativa', 'irrigacao', true),
    ('cooperativa', 'roi', true),
    ('cooperativa', 'resumo-semanal', true),
    ('cooperativa', 'loja', true),
    ('cooperativa', 'gestao', true),
    ('cooperativa', 'gestao-financeira', true),
    ('cooperativa', 'insumos', true),
    ('cooperativa', 'maquinario', true),
    ('cooperativa', 'calculadora-carbono', true),
    ('cooperativa', 'whatsapp-alertas', true),
    ('cooperativa', 'pecuaria', true),
    ('cooperativa', 'rastreabilidade', true),
    ('cooperativa', 'gestao-insumos', true),
    ('cooperativa', 'gestao-rh', true),
    ('cooperativa', 'crm', true),
    ('cooperativa', 'dashboard-consolidado', true),
    ('cooperativa', 'faturamento', true),
    ('cooperativa', 'meus-calculos', true),
    ('cooperativa', 'checkout', true),
    ('cooperativa', 'consultores', true),
    ('cooperativa', 'analise-compartilhada', true),
    ('cooperativa', 'multi_propriedade', true),
    ('cooperativa', 'relatorios', true),
    ('cooperativa', 'api', true)
  ON CONFLICT (plano, modulo) DO UPDATE SET permitido = true;

END $$;
