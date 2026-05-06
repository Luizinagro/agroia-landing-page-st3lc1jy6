import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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
    const alertas = [
      {
        tipo_alerta: 'clima',
        mensagem: 'Alerta de rajadas de vento fortes previstas para as próximas 4 horas nas coordenadas da propriedade. Suspender pulverização.',
        urgencia: 'alta',
        data_alerta: new Date().toISOString(),
        fonte: 'INMET',
        url: 'https://portal.inmet.gov.br/'
      },
      {
        tipo_alerta: 'preco',
        mensagem: 'Cotação do adubo nitrogenado (Ureia) apresentou leve queda de 1.5% nas últimas 24h. Momento favorável para cotação.',
        urgencia: 'média',
        data_alerta: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        fonte: 'Notícias Agrícolas',
        url: 'https://www.noticiasagricolas.com.br/'
      },
      {
        tipo_alerta: 'saude',
        mensagem: 'Foco de praga (Lagarta-do-cartucho) reportado em regiões vizinhas. Intensificar o monitoramento da lavoura.',
        urgencia: 'baixa',
        data_alerta: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        fonte: 'Embrapa',
        url: 'https://www.embrapa.br/'
      }
    ];

    const randomFactor = Math.random();
    if (randomFactor > 0.7) {
      alertas.unshift({
        tipo_alerta: 'saude',
        mensagem: 'Queda súbita no consumo de água detectada no Lote 2. Verificar bebedouros ou possível estresse térmico.',
        urgencia: 'alta',
        data_alerta: new Date().toISOString(),
        fonte: 'Sensor IoT Fazenda',
        url: '#'
      });
    } else if (randomFactor < 0.3) {
      alertas.push({
        tipo_alerta: 'clima',
        mensagem: 'Previsão indica janela de 3 dias sem chuvas significativas. Excelente momento para colheita.',
        urgencia: 'baixa',
        data_alerta: new Date().toISOString(),
        fonte: 'Climatempo',
        url: 'https://www.climatempo.com.br/'
      });
    }

    return new Response(JSON.stringify({ data: alertas, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
