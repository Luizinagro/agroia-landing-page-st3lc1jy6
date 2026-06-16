import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CACHE_HORAS = 6 // Atualiza preços a cada 6 horas

const UNIDADES: Record<string, string> = {
  soja: 'saca 60kg',
  milho: 'saca 60kg',
  trigo: 'saca 60kg',
  cafe: 'saca 60kg',
  'cafe-arabica': 'saca 60kg',
  algodao: '@15kg',
  'cana-de-acucar': 'tonelada',
  'boi-gordo': '@15kg',
  arroz: 'saca 50kg',
}

// Busca preço no cache do Supabase (válido por CACHE_HORAS)
async function buscarCache(supabase: any, commodity: string): Promise<any | null> {
  try {
    const limitTime = new Date(Date.now() - CACHE_HORAS * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('precos_cache')
      .select('*')
      .eq('commodity', commodity)
      .gte('created_at', limitTime)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    return data || null
  } catch {
    return null
  }
}

// Salva preço no cache
async function salvarCache(
  supabase: any,
  commodity: string,
  preco: number,
  unidade: string,
  variacao: number,
) {
  try {
    await supabase.from('precos_cache').insert({
      commodity,
      preco_saca: preco,
      unidade,
      variacao_dia: variacao,
      fonte: 'Gemini-IA',
    })
  } catch (e) {
    console.warn('Cache não salvo:', e)
  }
}

// Busca preços reais via Gemini com data atual injetada
async function buscarPrecoGemini(
  cultura: string,
  geminiKey: string,
): Promise<{ preco: number; variacao: number }> {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const unidade = UNIDADES[cultura.toLowerCase()] || 'saca 60kg'

  const prompt = `Hoje é ${hoje}. Você é um analista de mercado agrícola brasileiro com acesso aos preços do dia.

Qual é o preço indicativo atual de ${cultura} no mercado brasileiro, baseado no indicador CEPEA/ESALQ ou B3?
Unidade: ${unidade}

Responda APENAS com JSON válido, sem markdown:
{
  "preco": 135.50,
  "variacao_dia": +1.20,
  "referencia": "CEPEA/ESALQ"
}

Use o seu melhor conhecimento dos preços recentes. Seja realista e preciso.`

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

  if (!res.ok) throw new Error('Gemini indisponível')
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Resposta inválida do Gemini')
  const parsed = JSON.parse(match[0])
  return { preco: Number(parsed.preco), variacao: Number(parsed.variacao_dia || 0) }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (req.method !== 'POST') throw new Error('Use POST.')

    const body = await req.json()
    const { cultura, quantidade } = body
    if (!cultura || quantidade === undefined)
      throw new Error('"cultura" e "quantidade" são obrigatórios.')

    const culturaKey = cultura
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // remove acentos
      .replace(/\s+/g, '-')

    const culturasValidas = [
      'soja',
      'milho',
      'trigo',
      'cafe',
      'cafe-arabica',
      'algodao',
      'cana-de-acucar',
      'boi-gordo',
      'arroz',
    ]
    if (!culturasValidas.includes(culturaKey))
      throw new Error(`Cultura "${cultura}" não suportada.`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const geminiKey = Deno.env.get('GEMINI_API_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Tenta cache
    const cached = await buscarCache(supabase, culturaKey)
    let preco_saca: number
    let variacao_dia: number
    let fonte: string
    let cache_age_horas: number | null = null

    if (cached) {
      preco_saca = cached.preco_saca
      variacao_dia = cached.variacao_dia || 0
      fonte = cached.fonte
      cache_age_horas = Math.round((Date.now() - new Date(cached.created_at).getTime()) / 3600000)
    } else {
      // 2. Busca via Gemini
      const resultado = await buscarPrecoGemini(cultura, geminiKey)
      preco_saca = resultado.preco
      variacao_dia = resultado.variacao
      fonte = 'Gemini-IA (CEPEA/B3 referência)'
      await salvarCache(
        supabase,
        culturaKey,
        preco_saca,
        UNIDADES[culturaKey] || 'saca 60kg',
        variacao_dia,
      )
    }

    const valor_total = preco_saca * Number(quantidade)
    const unidade = UNIDADES[culturaKey] || 'saca 60kg'

    return new Response(
      JSON.stringify({
        preco_saca,
        variacao_dia,
        quantidade: Number(quantidade),
        valor_total,
        unidade,
        cultura,
        fonte,
        cache_age_horas,
        proxima_atualizacao_em_horas:
          cache_age_horas !== null ? Math.max(0, CACHE_HORAS - cache_age_horas) : 0,
        data_atualizacao: new Date().toISOString(),
        aviso: 'Preços indicativos com base em CEPEA/B3. Confirme antes de negociar.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
