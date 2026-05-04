import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Método não permitido. Use POST.');
    }

    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) {
      throw new Error('Usuário não autenticado');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const body = await req.json();
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      throw new Error('Latitude e Longitude são obrigatórios.');
    }

    let ndvi_value = 0.65;
    let soil_moisture = 72;
    let temperature = 28;
    let image_url = 'https://img.usecurling.com/p/400/300?q=satellite%20farm%20field&color=green&dpr=2';
    let analysis_date = new Date().toISOString();
    let isMock = false;

    try {
      // Simula chamada para API Sentinel Hub ou Google Earth Engine
      // Em uma integração real, faríamos um fetch aqui e processaríamos a imagem
      ndvi_value = Number((0.3 + Math.random() * 0.6).toFixed(2));
      soil_moisture = Math.floor(40 + Math.random() * 40);
      temperature = Math.floor(20 + Math.random() * 15);
      
      const color = ndvi_value > 0.6 ? 'green' : (ndvi_value > 0.4 ? 'yellow' : 'red');
      image_url = `https://img.usecurling.com/p/800/600?q=satellite%20farm%20field&color=${color}&dpr=2`;
    } catch (e) {
      isMock = true;
      console.warn("API de satélite indisponível, usando fallback");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: inserted, error: dbError } = await supabaseAdmin
      .from('satellite_analyses')
      .insert({
        user_id: user.id,
        latitude,
        longitude,
        ndvi_value,
        soil_moisture,
        temperature,
        image_url,
        analysis_date
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
    }

    return new Response(JSON.stringify({
      success: true,
      data: inserted || {
        ndvi_value,
        soil_moisture,
        temperature,
        image_url,
        analysis_date
      },
      message: isMock ? "Dados de demonstração - API indisponível" : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
