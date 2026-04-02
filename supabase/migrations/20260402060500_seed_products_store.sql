DO $
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.products LIMIT 1) THEN
    INSERT INTO public.products (id, name, description, price, category, stock, image_url)
    VALUES
      ('11111111-1111-1111-1111-111111111111'::uuid, 'Semente de Soja Premium X1', 'Semente de alta produtividade tratada com inoculante e fungicida. Saca de 40kg.', 350.00, 'sementes', 100, 'https://img.usecurling.com/p/400/300?q=soy%20seeds&color=green'),
      ('22222222-2222-2222-2222-222222222222'::uuid, 'Fertilizante NPK 10-10-10', 'Fertilizante mineral misto de uso geral, ideal para pré-plantio e cobertura. Saco de 50kg.', 120.00, 'fertilizante', 500, 'https://img.usecurling.com/p/400/300?q=fertilizer&color=green'),
      ('33333333-3333-3333-3333-333333333333'::uuid, 'Herbicida Sistêmico Total', 'Defensivo agrícola de amplo espectro para controle de plantas daninhas. Galão 5L.', 450.00, 'defensivos', 50, 'https://img.usecurling.com/p/400/300?q=agrochemicals&color=yellow'),
      ('44444444-4444-4444-4444-444444444444'::uuid, 'Ração Bovinos Engorda 18%', 'Ração balanceada com 18% de proteína para bovinos em fase de terminação. Saco de 40kg.', 85.00, 'ração', 200, 'https://img.usecurling.com/p/400/300?q=cattle%20feed&color=yellow'),
      ('55555555-5555-5555-5555-555555555555'::uuid, 'Semente de Milho Híbrido AgroIA', 'Milho híbrido com alta resistência a pragas e excelente rendimento. Saca de 20kg.', 280.00, 'sementes', 150, 'https://img.usecurling.com/p/400/300?q=corn%20seeds&color=yellow'),
      ('66666666-6666-6666-6666-666666666666'::uuid, 'Fungicida Protetor', 'Defensivo para controle preventivo de doenças fúngicas nas principais culturas.', 320.00, 'defensivos', 80, 'https://img.usecurling.com/p/400/300?q=chemicals&color=green')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $;
