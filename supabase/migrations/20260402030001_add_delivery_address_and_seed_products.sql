DO $
BEGIN
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
END $;

INSERT INTO public.products (id, name, description, price, category, image_url, stock)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Ração Premium para Gado', 'Saco de 50kg de ração concentrada com alto teor de proteína para engorda rápida e saudável do rebanho bovino.', 185.90, 'ração', 'https://img.usecurling.com/p/400/300?q=cattle%20feed', 150),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Fertilizante NPK 10-10-10', 'Fertilizante mineral misto, ideal para adubação de manutenção. Saco de 50kg.', 210.50, 'fertilizante', 'https://img.usecurling.com/p/400/300?q=fertilizer%20bags', 80),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Sementes de Soja RR', 'Sementes de soja transgênica com alta resistência a herbicidas e excelente potencial produtivo. Saca de 40kg.', 320.00, 'sementes', 'https://img.usecurling.com/p/400/300?q=soybean%20seeds', 200),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Sementes de Milho Híbrido', 'Milho de ciclo precoce, alta tolerância a pragas e doenças. Saca de 20kg.', 280.00, 'sementes', 'https://img.usecurling.com/p/400/300?q=corn%20seeds', 120),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'Herbicida Glifosato 480', 'Herbicida sistêmico não seletivo, de ação pós-emergente. Galão de 20 litros.', 450.00, 'defensivos', 'https://img.usecurling.com/p/400/300?q=herbicide%20gallon', 50),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'Sal Mineral Enriquecido', 'Suplemento mineral pronto para uso, indicado para bovinos de corte. Saco de 30kg.', 95.00, 'ração', 'https://img.usecurling.com/p/400/300?q=mineral%20salt', 300)
ON CONFLICT (id) DO NOTHING;
