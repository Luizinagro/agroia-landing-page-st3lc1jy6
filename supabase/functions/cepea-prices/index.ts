import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CACHE_HORAS = 4

async function buscarCachePrecos(supabase: any): Promise<any | null> {
  try {
    const limite = new Date(Date.now() - CACHE_HORAS * 60 * 60 * 1000).toISOString()
    const commodities = ['boi-gordo', 'bezerro', 'soja', 'milho', 'cafe-arabica', 'algodao']
    const { data } = await supabase
      .from('precos_cache')
      .select('*')
      .in('commodity', commodities)
      .gte('created_at', limite)
      .order('created_at', { ascending: false })

    if (!data || data.length < 4) return null

    // Agrupa por commodity, pega o mais recente de cada
    const map: Record<string, any> = {}
    for (const row of data) {
      if (!map[row.commodity]) map[row.commodity] = row
    }
    return Object.keys(map).length >= 4 ? map : null
  } catch {
    return null
  }
}

async function salvarCacheMultiplo(supabase: any, precos: any[]) {
  try {
    await supabase.from('precos_cache').insert(precos)
  } catch (e) {
    console.warn('Cache não salvo:', e)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const geminiKey = Deno.env.get('GEMINI_API_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const rateLimitKey =
      req.headers.get('Authorization') || req.headers.get('x-forwarded-for') || 'anon'
    const { data: dentroDoLimite } = await supabase.rpc('check_rate_limit', {
      p_user_id: rateLimitKey,
      p_function: 'cepea-prices',
      p_max_requests: 30,
      p_window_minutes: 10,
    })
    if (dentroDoLimite === false)
      throw new Error('Limite de consultas atingido. Tente novamente em alguns minutos.')

    // 1. Tenta cache
    const cached = await buscarCachePrecos(supabase)
    if (cached) {
      return new Response(
        JSON.stringify({
          prices: formatarPrecos(cached),
          fonte: 'cache',
          cache_age_min: Math.round(
            (Date.now() - new Date(Object.values(cached)[0].created_at as string).getTime()) /
              60000,
          ),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      )
    }

    // 2. Busca via Gemini com data real
    const hoje = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const prompt = `Hoje é ${hoje}. Você é um analista sênior de mercado agropecuário brasileiro.

Forneça os preços indicativos atuais para o mercado brasileiro baseados nos indicadores CEPEA/ESALQ e B3.

Responda APENAS com JSON válido (sem markdown):
{
  "Boi Gordo": { "atual": 285.50, "media_30d": 280.00, "unidade": "@15kg", "variacao": +1.20 },
  "Bezerro": { "atual": 2100.00, "media_30d": 2050.00, "unidade": "cabeça", "variacao": +25.00 },
  "Soja": { "atual": 135.50, "media_30d": 132.00, "unidade": "saca 60kg", "variacao": -0.80 },
  "Milho": { "atual": 62.00, "media_30d": 60.50, "unidade": "saca 60kg", "variacao": +0.50 },
  "Café Arábica": { "atual": 1450.00, "media_30d": 1400.00, "unidade": "saca 60kg", "variacao": +15.00 },
  "Algodão": { "atual": 105.00, "media_30d": 103.00, "unidade": "@15kg", "variacao": +0.30 }
}

Use seus dados mais recentes. Seja realista e consistente com o mercado brasileiro atual.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json', temperature: 0.1 },
        }),
      },
    )

    let prices: Record<string, any> = {}

    if (res.ok) {
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        prices = parsed

        // Salva no cache
        const cacheRows = [
          {
            commodity: 'boi-gordo',
            preco_saca: parsed['Boi Gordo']?.atual,
            unidade: '@15kg',
            variacao_dia: parsed['Boi Gordo']?.variacao || 0,
            fonte: 'Gemini-IA',
          },
          {
            commodity: 'bezerro',
            preco_saca: parsed['Bezerro']?.atual,
            unidade: 'cabeça',
            variacao_dia: parsed['Bezerro']?.variacao || 0,
            fonte: 'Gemini-IA',
          },
          {
            commodity: 'soja',
            preco_saca: parsed['Soja']?.atual,
            unidade: 'saca 60kg',
            variacao_dia: parsed['Soja']?.variacao || 0,
            fonte: 'Gemini-IA',
          },
          {
            commodity: 'milho',
            preco_saca: parsed['Milho']?.atual,
            unidade: 'saca 60kg',
            variacao_dia: parsed['Milho']?.variacao || 0,
            fonte: 'Gemini-IA',
          },
          {
            commodity: 'cafe-arabica',
            preco_saca: parsed['Café Arábica']?.atual,
            unidade: 'saca 60kg',
            variacao_dia: parsed['Café Arábica']?.variacao || 0,
            fonte: 'Gemini-IA',
          },
          {
            commodity: 'algodao',
            preco_saca: parsed['Algodão']?.atual,
            unidade: '@15kg',
            variacao_dia: parsed['Algodão']?.variacao || 0,
            fonte: 'Gemini-IA',
          },
        ].filter((r) => r.preco_saca)

        await salvarCacheMultiplo(supabase, cacheRows)
      }
    }

    return new Response(
      JSON.stringify({
        prices,
        fonte: 'Gemini-IA (CEPEA/B3 referência)',
        data_atualizacao: new Date().toISOString(),
        aviso: 'Preços indicativos. Confirme no CEPEA antes de negociar.',
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

function formatarPrecos(cached: Record<string, any>) {
  const map: Record<string, string> = {
    'boi-gordo': 'Boi Gordo',
    bezerro: 'Bezerro',
    soja: 'Soja',
    milho: 'Milho',
    'cafe-arabica': 'Café Arábica',
    algodao: 'Algodão',
  }
  const result: Record<string, any> = {}
  for (const [key, label] of Object.entries(map)) {
    if (cached[key]) {
      result[label] = {
        atual: cached[key].preco_saca,
        media_30d: cached[key].preco_saca,
        unidade: cached[key].unidade,
        variacao: cached[key].variacao_dia || 0,
      }
    }
  }
  return result
}
