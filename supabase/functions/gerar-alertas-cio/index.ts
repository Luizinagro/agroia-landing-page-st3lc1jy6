import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) throw new Error('Não autenticado');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error('Não autenticado');

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const rateLimitKey = user.id;
    const { data: dentroDoLimite } = await admin.rpc('check_rate_limit', {
      p_user_id: rateLimitKey, p_function: 'gerar-alertas-cio', p_max_requests: 15, p_window_minutes: 10
    });
    if (dentroDoLimite === false) throw new Error('Limite de alertas atingido. Tente novamente em alguns minutos.');

    // Busca animais do usuário com cio previsto nos próximos 7 dias
    const limite = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { data: animais, error: animaisError } = await admin
      .from('animais')
      .select('id, nome, tipo, proximo_cio_estimado, confianca_previsao, recomendacoes_ia')
      .eq('user_id', user.id)
      .not('proximo_cio_estimado', 'is', null)
      .lte('proximo_cio_estimado', limite);

    if (animaisError) throw new Error(`Erro ao buscar animais: ${animaisError.message}`);

    const alertasGerados = [];
    for (const animal of animais || []) {
      const mensagem = `${animal.nome || 'Animal'} (${animal.tipo || 'sem tipo'}) com cio previsto para ${animal.proximo_cio_estimado}.`;
      const { data: inserted, error: insertError } = await admin
        .from('alertas_cio')
        .insert({
          user_id: user.id,
          animal_id: animal.id,
          mensagem,
          data_alerta: animal.proximo_cio_estimado,
          status: 'pendente'
        })
        .select()
        .single();
      if (!insertError) alertasGerados.push(inserted);
    }

    return new Response(JSON.stringify({
      success: true,
      data: alertasGerados,
      total: alertasGerados.length
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
