import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Busca clima REAL via Open-Meteo para a região do usuário
async function buscarClimaReal(lat: number, lon: number) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_moisture_3_to_9cm` +
      `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&forecast_days=1&past_days=3`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return {
      temperatura: Number((data.current?.temperature_2m ?? 25).toFixed(1)),
      umidade_ar: Math.round(data.current?.relative_humidity_2m ?? 65),
      umidade_solo: Number(((data.current?.soil_moisture_3_to_9cm ?? 0.25) * 100).toFixed(1)),
      precipitacao_hoje: Number((data.current?.precipitation ?? 0).toFixed(1)),
      chuva_3dias: Number(
        (data.daily?.precipitation_sum ?? [0, 0, 0])
          .reduce((a: number, b: number) => a + (b ?? 0), 0)
          .toFixed(1),
      ),
      vento: Number((data.current?.wind_speed_10m ?? 10).toFixed(1)),
      temp_max: data.daily?.temperature_2m_max?.[0] ?? 30,
      temp_min: data.daily?.temperature_2m_min?.[0] ?? 18,
    }
  } catch {
    return null
  }
}

// Busca preço atual da cultura no cache do Supabase
async function buscarPrecoAtual(supabase: any, cultura: string): Promise<string> {
  try {
    const culturaKey = cultura
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
    const limite = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('precos_cache')
      .select('preco_saca, unidade, variacao_dia')
      .eq('commodity', culturaKey)
      .gte('created_at', limite)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data)
      return `R$ ${data.preco_saca.toFixed(2)}/${data.unidade} (${data.variacao_dia >= 0 ? '+' : ''}${data.variacao_dia?.toFixed(2)} hoje)`
  } catch {}
  return 'não disponível no momento'
}

// Busca propriedade do usuário para obter coordenadas reais
async function buscarPropriedade(supabase: any, userId: string) {
  try {
    const { data } = await supabase
      .from('propriedades')
      .select('nome, cultura_principal, latitude, longitude, area_hectares, estado')
      .eq('user_id', userId)
      .limit(1)
      .single()
    return data
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (req.method !== 'POST') throw new Error('Use POST.')

    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader) throw new Error('Não autenticado')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const geminiKey = Deno.env.get('GEMINI_API_KEY') || ''

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()
    if (userError || !user) throw new Error('Não autenticado')

    const body = await req.json()
    const { regiao, pergunta } = body
    if (!pergunta) throw new Error('Pergunta é obrigatória.')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Busca dados REAIS em paralelo
    const propriedade = await buscarPropriedade(supabase, user.id)
    const cultura = propriedade?.cultura_principal || body.cultura || 'soja'

    let climaReal = null
    if (propriedade?.latitude && propriedade?.longitude) {
      climaReal = await buscarClimaReal(
        parseFloat(propriedade.latitude),
        parseFloat(propriedade.longitude),
      )
    }

    const precoAtual = await buscarPrecoAtual(supabase, cultura)

    // Monta contexto com dados reais
    const hoje = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const regiaoFinal = propriedade?.estado || regiao || 'Brasil'

    const contextoCima = climaReal
      ? `🌡️ Temperatura: ${climaReal.temperatura}°C (máx ${climaReal.temp_max}°C / mín ${climaReal.temp_min}°C)
💧 Umidade do ar: ${climaReal.umidade_ar}%
🌱 Umidade do solo (3-9cm): ${climaReal.umidade_solo}%
🌧️ Chuva hoje: ${climaReal.precipitacao_hoje}mm | Últimos 3 dias: ${climaReal.chuva_3dias}mm
💨 Vento: ${climaReal.vento} km/h`
      : '⚠️ Dados climáticos não disponíveis para esta localização.'

    const prompt = `Você é o Consultor AgroIA — um agrônomo sênior experiente, empático e direto. Fala de forma clara com o produtor rural brasileiro.

📅 Data de hoje: ${hoje}
📍 Região: ${regiaoFinal}
🌾 Cultura principal: ${cultura}
${propriedade?.area_hectares ? `📐 Área: ${propriedade.area_hectares} hectares` : ''}
${propriedade?.nome ? `🏡 Propriedade: ${propriedade.nome}` : ''}

CONDIÇÕES CLIMÁTICAS REAIS AGORA (Open-Meteo):
${contextoCima}

PREÇO DE MERCADO ATUAL:
💰 ${cultura}: ${precoAtual}

PERGUNTA DO PRODUTOR:
"${pergunta}"

REGRAS DE RESPOSTA:
1. Se for PROBLEMA no campo (praga, doença, amarelamento, bicho): dê diagnóstico técnico + 3 soluções práticas + quando chamar engenheiro agrônomo
2. Se for sobre MERCADO (vender, preço, safra): use o preço real acima e dê recomendação de comercialização
3. Se for sobre CLIMA/IRRIGAÇÃO: use os dados climáticos reais acima
4. Seja direto, use linguagem simples, resposta em 150-250 palavras
5. Termine sempre com uma ação concreta para o produtor fazer HOJE`

    if (!geminiKey) throw new Error('Chave Gemini não configurada.')

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      },
    )

    if (!geminiRes.ok) throw new Error('Gemini indisponível')
    const geminiData = await geminiRes.json()
    const resposta = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return new Response(
      JSON.stringify({
        success: true,
        resposta,
        contexto_utilizado: {
          regiao: regiaoFinal,
          cultura,
          clima_real: climaReal !== null,
          preco_atual: precoAtual,
          propriedade: propriedade?.nome || null,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
