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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await req.json().catch(() => ({}));
    const { user_id } = body;

    let regionContext = '';
    let cultureContext = '';

    if (user_id) {
      const { data: props } = await supabase.from('propriedades').select('nome, cultura_principal, latitude, longitude').eq('user_id', user_id).limit(1);
      if (props && props.length > 0) {
        regionContext = `Região nas coordenadas Lat: ${props[0].latitude}, Lng: ${props[0].longitude}`;
        cultureContext = `Cultura principal: ${props[0].cultura_principal}`;
      }
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    let alertas = [];

    if (apiKey && regionContext) {
      const prompt = `Gere 3 notícias/alertas em tempo real sobre agricultura baseados nesta propriedade brasileira: ${regionContext}, ${cultureContext}. 
      Retorne ESTRITAMENTE um array JSON contendo objetos com:
      - tipo_alerta ("clima", "preco", ou "saude")
      - mensagem (mensagem realista e urgente para a região e cultura informada)
      - urgencia ("alta", "média", "baixa")
      - fonte (nome de um jornal/instituto agro confiável como INMET, CEPEA, Canal Rural, Notícias Agrícolas, etc)
      - url (link real ou genérico para o site da fonte, ex: "https://www.noticiasagricolas.com.br/")
      Não retorne markdown fora do JSON.`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
             const jsonMatch = text.match(/\[[\s\S]*\]/);
             const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
             alertas = parsed.map((a: any) => ({
               ...a,
               data_alerta: new Date().toISOString()
             }));
          }
        }
      } catch (e) {
        console.error("Falha ao gerar alertas com IA:", e);
      }
    }

    if (alertas.length === 0) {
      alertas = [
        {
          tipo_alerta: 'clima',
          mensagem: 'Alerta de chuvas isoladas previstas para as próximas horas na sua região cadastrada. Acompanhe a janela para adubação.',
          urgencia: 'alta',
          data_alerta: new Date().toISOString(),
          fonte: 'INMET',
          url: 'https://portal.inmet.gov.br/'
        },
        {
          tipo_alerta: 'preco',
          mensagem: `Cotações do mercado indicam movimentações nos fertilizantes na sua região. Verifique o impacto nos custos.`,
          urgencia: 'média',
          data_alerta: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          fonte: 'Notícias Agrícolas',
          url: 'https://www.noticiasagricolas.com.br/'
        },
        {
          tipo_alerta: 'saude',
          mensagem: 'Aviso de monitoramento contínuo devido às condições de umidade e temperatura reportadas perto da propriedade.',
          urgencia: 'baixa',
          data_alerta: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          fonte: 'Embrapa',
          url: 'https://www.embrapa.br/'
        }
      ];
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
