import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Trata a requisição OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Método não permitido. Use POST.');
    }

    const body = await req.json();
    const { cultura, data_plantio, clima_atual, umidade_solo, historico_safras } = body;

    if (!cultura || !data_plantio || !clima_atual || !umidade_solo || !historico_safras) {
      throw new Error('Parâmetros ausentes: cultura, data_plantio, clima_atual, umidade_solo e historico_safras são obrigatórios.');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    let forecastData = null;

    if (apiKey) {
      const prompt = `Atue como um agrônomo especialista. Baseado nos seguintes dados de plantio, gere uma previsão de safra realista.
      
      Cultura: ${cultura}
      Data de Plantio: ${data_plantio}
      Clima Atual: ${typeof clima_atual === 'object' ? JSON.stringify(clima_atual) : clima_atual}
      Umidade do Solo: ${typeof umidade_solo === 'object' ? JSON.stringify(umidade_solo) : umidade_solo}
      Histórico de Safras Anteriores: ${typeof historico_safras === 'object' ? JSON.stringify(historico_safras) : historico_safras}

      Responda ESTRITAMENTE em formato JSON com a seguinte estrutura, sem markdown ao redor:
      {
        "data_colheita_estimada": "YYYY-MM-DD",
        "produtividade_esperada": "Valor e unidade, ex: 65 ton/ha",
        "recomendacoes": ["recomendação 1", "recomendação 2"],
        "riscos_identificados": ["risco 1", "risco 2"]
      }`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Gemini: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
         try {
           // Limpa possíveis marcações markdown caso a API as retorne mesmo com response_mime_type
           text = text.replace(/```json/g, '').replace(/```/g, '').trim();
           forecastData = JSON.parse(text);
         } catch(e) {
           console.error("Falha ao fazer parse do JSON retornado pelo Gemini", e, text);
           throw new Error("Erro ao interpretar a resposta da IA. O formato retornado é inválido.");
         }
      }
    }

    // Fallback caso não haja chave de API configurada (mock realista)
    if (!forecastData) {
      forecastData = {
        data_colheita_estimada: "2024-08-15",
        produtividade_esperada: "68.2 ton/ha",
        recomendacoes: [
          "Monitorar umidade do solo semanalmente",
          "Preparar aplicação preventiva de fungicida devido à previsão de umidade relativa alta",
          "Planejar adubação de cobertura rica em Nitrogênio (N)",
          "(Aviso: Esta é uma previsão simulada. Configure a GEMINI_API_KEY no Supabase para análises reais baseadas em IA)"
        ],
        riscos_identificados: [
          "Possível déficit hídrico nas próximas semanas",
          "Risco médio de pragas devido ao histórico"
        ]
      };
    }

    return new Response(JSON.stringify({ data: forecastData, success: true }), {
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
