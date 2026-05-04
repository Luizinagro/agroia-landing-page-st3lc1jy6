DO $$
DECLARE
  v_user_id uuid;
  v_count int;
BEGIN
  -- Tentar pegar o primeiro usuário disponível para popular histórico e testar a galeria
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM public.satellite_analyses WHERE user_id = v_user_id;
    IF v_count = 0 THEN
      -- Insere um histórico passado para habilitar imediatamente a funcionalidade de "Slider Temporal"
      INSERT INTO public.satellite_analyses (
        user_id, latitude, longitude, ndvi_value, soil_moisture, temperature, image_url, analysis_date, created_at
      ) VALUES 
      (v_user_id, -15.7938, -47.8827, 0.45, 55, 30, 'https://img.usecurling.com/p/800/600?q=satellite%20farm%20field&color=red&dpr=2&seed=101', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
      (v_user_id, -15.7938, -47.8827, 0.52, 60, 28, 'https://img.usecurling.com/p/800/600?q=satellite%20farm%20field&color=yellow&dpr=2&seed=102', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
      (v_user_id, -15.7938, -47.8827, 0.68, 70, 25, 'https://img.usecurling.com/p/800/600?q=satellite%20farm%20field&color=green&dpr=2&seed=103', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');
    END IF;
  END IF;
END $$;
