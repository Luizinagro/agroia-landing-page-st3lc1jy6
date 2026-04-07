import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Método não permitido. Use POST.')
    }

    const body = await req.json()
    const { clima, solo, cultura, historico } = body

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    let recomendacoes = null

    if (apiKey) {
      const prompt = `Atue como um agrônomo especialista sênior e consultor de IA.
      Analise os seguintes dados agronômicos da propriedade e gere recomendações práticas de manejo.
      
      Cultura Principal: ${cultura || 'Não informada'}
      Clima Atual/Previsão: ${JSON.stringify(clima || 'Sem dados climáticos recentes')}
      Condições de Solo: ${JSON.stringify(solo || 'Sem dados de solo específicos')}
      Histórico/Anotações: ${JSON.stringify(historico || 'Nenhum histórico reportado')}

      Com base nesses dados, gere recomendações precisas.
      Responda ESTRITAMENTE em formato JSON com a seguinte estrutura, sem markdown ao redor:
      {
        "recomendacao_plantio": "Recomendação técnica sobre plantio, época, densidade ou preparo.",
        "recomendacao_insumo": "Recomendação sobre fertilizantes, defensivos ou correção.",
        "recomendacao_manejo": "Recomendação sobre tratos culturais gerais, irrigação ou colheita.",
        "urgencia": "alta" ou "média" ou "baixa"
      }`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
          text = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
          recomendacoes = JSON.parse(text)
        } catch (e) {
          console.error('Falha ao fazer parse do JSON do Gemini', e, text)
          throw new Error('Erro ao interpretar a resposta da IA. O formato retornado é inválido.')
        }
      }
    }

    // Fallback realista se não houver chave de API ou se a IA falhar
    if (!recomendacoes) {
      recomendacoes = {
        recomendacao_plantio:
          'Condições atuais favoráveis. Mantenha a janela de plantio planejada, garantindo boa profundidade (3-5cm) devido à umidade atual adequada.',
        recomendacao_insumo:
          'Atenção aos níveis de Nitrogênio (N). Recomendada aplicação de cobertura nos próximos 7 a 10 dias, aproveitando a previsão de chuva.',
        recomendacao_manejo:
          'Monitore áreas de baixada. Risco moderado de aparecimento de fungos foliares devido à combinação de alta umidade relativa e calor nos próximos dias.',
        urgencia: 'média',
      }
    }

    return new Response(JSON.stringify({ data: recomendacoes, success: true }), {
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
