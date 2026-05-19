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
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    // Valores de fallback realistas baseados na cotação média do CEPEA
    let prices = {
      'Boi Gordo (Arroba)': { atual: 235.5, media: 232.0 },
      'Bezerro (Cabeça)': { atual: 1980.0, media: 1950.0 },
    }

    if (apiKey) {
      const prompt = `Atue como um analista de mercado pecuário brasileiro. Forneça os preços reais aproximados de hoje e a média mensal baseados no indicador CEPEA/ESALQ para as seguintes commodities.
      Responda ESTRITAMENTE em formato JSON, sem markdown ao redor, com a seguinte estrutura de chaves e valores numéricos em Reais (BRL):
      {
        "Boi Gordo (Arroba)": { "atual": 235.50, "media": 232.00 },
        "Bezerro (Cabeça)": { "atual": 1980.00, "media": 1950.00 }
      }`

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { response_mime_type: 'application/json', temperature: 0.1 },
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              if (parsed['Boi Gordo (Arroba)'] && parsed['Boi Gordo (Arroba)'].atual) {
                prices = parsed
              }
            }
          }
        } else {
          console.error('Gemini API error:', response.status, response.statusText)
        }
      } catch (err) {
        console.error('Erro ao chamar Gemini:', err)
      }
    }

    return new Response(JSON.stringify({ prices }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
