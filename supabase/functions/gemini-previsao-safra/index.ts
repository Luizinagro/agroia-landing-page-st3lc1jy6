import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Trata a requisição OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Método não permitido. Use POST.')
    }

    const body = await req.json()
    const { clima, solo, historico } = body

    if (!clima || !solo || !historico) {
      throw new Error('Parâmetros ausentes: clima, solo e historico são obrigatórios.')
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    let forecastData = null

    if (apiKey) {
      const prompt = `Atue como um agrônomo especialista. Baseado nos seguintes dados de plantio, gere uma previsão de safra realista.
      
      Dados de Clima: ${typeof clima === 'object' ? JSON.stringify(clima) : clima}
      Dados de Solo: ${typeof solo === 'object' ? JSON.stringify(solo) : solo}
      Histórico de Plantio: ${typeof historico === 'object' ? JSON.stringify(historico) : historico}

      Responda ESTRITAMENTE em formato JSON com a seguinte estrutura, sem markdown ao redor:
      {
        "produtividade_estimada_ton_ha": 65.5,
        "risco_pragas": "Alto | Médio | Baixo",
        "analise_climatica": "Breve análise do impacto do clima",
        "qualidade_solo": "Breve análise das condições do solo",
        "recomendacoes": ["recomendação acionável 1", "recomendação acionável 2", "recomendação acionável 3"]
      }`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'application/json' },
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Erro na API do Gemini: ${response.statusText} (${response.status})`)
      }

      const data = await response.json()
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (text) {
        try {
          // Limpa possíveis marcações markdown caso a API as retorne mesmo com response_mime_type
          text = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
          forecastData = JSON.parse(text)
        } catch (e) {
          console.error('Falha ao fazer parse do JSON retornado pelo Gemini', e, text)
          throw new Error('Erro ao interpretar a resposta da IA. O formato retornado é inválido.')
        }
      }
    }

    // Fallback caso não haja chave de API configurada (mock realista)
    if (!forecastData) {
      forecastData = {
        produtividade_estimada_ton_ha: 68.2,
        risco_pragas: 'Médio',
        analise_climatica:
          'Condições majoritariamente favoráveis, com alerta para possível déficit hídrico nas próximas semanas.',
        qualidade_solo:
          'Níveis adequados de macronutrientes, porém requer atenção à correção de acidez baseada no histórico.',
        recomendacoes: [
          'Monitorar umidade do solo semanalmente',
          'Preparar aplicação preventiva de fungicida devido à previsão de umidade relativa alta',
          'Planejar adubação de cobertura rica em Nitrogênio (N)',
          '(Aviso: Esta é uma previsão simulada. Configure a GEMINI_API_KEY no Supabase para análises reais baseadas em IA)',
        ],
      }
    }

    return new Response(JSON.stringify({ data: forecastData, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
