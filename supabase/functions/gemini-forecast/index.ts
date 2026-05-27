import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Busca preço atual do cache do Supabase
async function buscarPrecoCache(supabase: any, commodityKey: string): Promise<number | null> {
  try {
    const limite = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('precos_cache')
      .select('preco_saca')
      .eq('commodity', commodityKey)
      .gte('created_at', limite)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    return data?.preco_saca ?? null
  } catch {
    return null
  }
}

const COMMODITY_KEYS: Record<string, string> = {
  Soja: 'soja',
  Milho: 'milho',
  Trigo: 'trigo',
  Café: 'cafe-arabica',
  'Cana-de-açúcar': 'cana-de-acucar',
  Algodão: 'algodao',
  'Boi Gordo': 'boi-gordo',
}

const PRECOS_FALLBACK: Record<string, number> = {
  Soja: 135.5,
  Milho: 62.0,
  Trigo: 84.0,
  Café: 1450.0,
  'Cana-de-açúcar': 145.5,
  Algodão: 105.0,
  'Boi Gordo': 285.5,
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { commodity, current_price_saca } = await req.json()
    if (!commodity) throw new Error('Commodity é obrigatório')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Tenta pegar preço do cache, depois do request, depois fallback
    const commodityKey = COMMODITY_KEYS[commodity] || commodity.toLowerCase()
    const precoCached = await buscarPrecoCache(supabase, commodityKey)
    const currentPrice = current_price_saca || precoCached || PRECOS_FALLBACK[commodity] || 100

    const hoje = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    let trend_data: any[] = []
    let recommendation = ''
    let previsao_30d = 0
    let previsao_60d = 0
    let fonte_preco = precoCached ? 'cache (atualizado recentemente)' : 'fallback'

    if (apiKey) {
      const prompt = `Hoje é ${hoje}. Você é um analista de mercado agrícola especializado em commodities brasileiras.

Gere uma previsão de preços para "${commodity}" para os próximos 60 dias.
Preço atual de mercado: R$ ${currentPrice} (${commodity === 'Boi Gordo' ? '@15kg' : 'saca'})
Fonte do preço atual: ${fonte_preco}

Considere:
- Sazonalidade típica da commodity no Brasil
- Tendências recentes de mercado
- Câmbio USD/BRL atual
- Demanda China e mercado internacional

Responda APENAS com JSON válido (sem markdown):
{
  "trend_data": [{"date": "YYYY-MM-DD", "price": 135.50, "cenario": "base"}],
  "previsao_30d": 132.50,
  "previsao_60d": 135.80,
  "variacao_30d_pct": +1.5,
  "variacao_60d_pct": +3.2,
  "recommendation": "Recomendação estratégica de comercialização baseada na previsão.",
  "fatores_alta": ["fator 1", "fator 2"],
  "fatores_baixa": ["fator 1", "fator 2"]
}

Gere exatos 60 itens no trend_data com datas sequenciais a partir de amanhã.`

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { response_mime_type: 'application/json', temperature: 0.2 },
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          const match = text.match(/\{[\s\S]*\}/)
          if (match) {
            const parsed = JSON.parse(match[0])
            trend_data = parsed.trend_data || []
            recommendation = parsed.recommendation || ''
            previsao_30d = parsed.previsao_30d || 0
            previsao_60d = parsed.previsao_60d || 0
          }
        }
      } catch (e) {
        console.error('Gemini error:', e)
      }
    }

    return new Response(
      JSON.stringify({
        commodity,
        current_price: currentPrice,
        trend_data,
        previsao_30d,
        previsao_60d,
        recommendation,
        fonte_preco_atual: fonte_preco,
        data_geracao: new Date().toISOString(),
        aviso: 'Previsão gerada por IA. Não constitui recomendação financeira.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
