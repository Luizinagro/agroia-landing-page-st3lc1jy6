DO $
BEGIN
  -- Insert seed products to ensure the Store has items available out-of-the-box
  INSERT INTO public.products (id, name, description, price, category, image_url, stock)
  VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'Sementes de Soja Premium', 'Sementes de alta produtividade e resistência à seca. Ideal para a safra de verão.', 250.00, 'sementes', 'https://img.usecurling.com/p/400/300?q=soybeans', 100),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Fertilizante NPK 10-10-10', 'Fertilizante mineral misto balanceado para diversas culturas. Garante nutrição completa.', 180.00, 'fertilizante', 'https://img.usecurling.com/p/400/300?q=fertilizer', 50),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'Ração para Bovinos Corte', 'Ração de engorda com alto teor proteico para terminação rápida de bovinos.', 120.00, 'ração', 'https://img.usecurling.com/p/400/300?q=cattle%20feed', 200),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'Defensivo Agrícola Total', 'Controle eficaz de pragas e doenças na sua lavoura. Amplo espectro de ação.', 350.00, 'defensivos', 'https://img.usecurling.com/p/400/300?q=pesticide', 30),
    ('55555555-5555-5555-5555-555555555555'::uuid, 'Sementes de Milho Híbrido', 'Milho de ciclo precoce com alto potencial produtivo. Excelente sanidade.', 190.00, 'sementes', 'https://img.usecurling.com/p/400/300?q=corn', 150),
    ('66666666-6666-6666-6666-666666666666'::uuid, 'Ração Lactação Vacas Leiteiras', 'Formulada especialmente para suprir a demanda energética na fase de lactação.', 145.00, 'ração', 'https://img.usecurling.com/p/400/300?q=dairy%20cows', 120)
  ON CONFLICT (id) DO NOTHING;

  -- Ensure the carrinho table has proper RLS policies
  -- Dropping first to make it idempotent
  DROP POLICY IF EXISTS "carrinho_select" ON public.carrinho;
  CREATE POLICY "carrinho_select" ON public.carrinho FOR SELECT TO authenticated USING (user_id = auth.uid());

  DROP POLICY IF EXISTS "carrinho_insert" ON public.carrinho;
  CREATE POLICY "carrinho_insert" ON public.carrinho FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

  DROP POLICY IF EXISTS "carrinho_update" ON public.carrinho;
  CREATE POLICY "carrinho_update" ON public.carrinho FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

  DROP POLICY IF EXISTS "carrinho_delete" ON public.carrinho;
  CREATE POLICY "carrinho_delete" ON public.carrinho FOR DELETE TO authenticated USING (user_id = auth.uid());

END $;
