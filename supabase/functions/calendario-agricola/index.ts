import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function buscarClimaRegiao(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=16`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const tempMedia = (
      ((data.daily?.temperature_2m_max?.[0] ?? 28) + (data.daily?.temperature_2m_min?.[0] ?? 18)) /
      2
    ).toFixed(1)
    const chuva16d = (data.daily?.precipitation_sum ?? [])
      .reduce((a: number, b: number) => a + (b ?? 0), 0)
      .toFixed(1)
    return { tempMedia, chuva16d }
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const { cultura, estado, latitude, longitude } = body
    if (!cultura) throw new Error('"cultura" é obrigatório.')

    const geminiKey = Deno.env.get('GEMINI_API_KEY') || ''
    if (!geminiKey) throw new Error('Chave Gemini não configurada.')

    const clima =
      latitude && longitude
        ? await buscarClimaRegiao(parseFloat(latitude), parseFloat(longitude))
        : null

    const hoje = new Date()
    const mesAtual = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const diaAno = Math.floor(
      (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / 86400000,
    )

    const prompt = `Você é um agrônomo especialista em calendário agrícola brasileiro.
Hoje é ${hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
${estado ? `Estado/Região: ${estado}` : ''}
Cultura: ${cultura}
${clima ? `Temperatura média atual: ${clima.tempMedia}°C | Chuva previsão 16 dias: ${clima.chuva16d}mm` : ''}

Gere um calendário agrícola completo e específico para ${cultura} no ${estado || 'Brasil'}.

Responda APENAS com JSON válido (sem markdown):
{
  "cultura": "${cultura}",
  "regiao": "${estado || 'Brasil'}",
  "status_atual": {
    "fase": "Nome da fase atual (ex: Pré-plantio, Plantio, Desenvolvimento vegetativo, Floração, Colheita)",
    "descricao": "O que o produtor deve estar fazendo AGORA",
    "urgencia": "alta|media|baixa",
    "dias_para_proxima_fase": 15
  },
  "calendario_anual": [
    {
      "mes": "Janeiro",
      "fase": "Nome da fase",
      "atividades": ["atividade 1", "atividade 2"],
      "alertas": ["alerta importante"],
      "insumos_principais": ["insumo 1"],
      "cor": "verde|amarelo|laranja|vermelho|azul"
    }
  ],
  "janela_plantio": {
    "inicio_ideal": "mês/dia",
    "fim_ideal": "mês/dia",
    "aberta_agora": true,
    "dias_restantes": 30,
    "recomendacao": "Texto sobre timing de plantio"
  },
  "variedades_recomendadas": [
    { "nome": "Variedade X", "ciclo_dias": 120, "caracteristica": "Alta produtividade" }
  ],
  "proximas_atividades": [
    { "atividade": "Nome da atividade", "prazo": "Em X dias / Semana X", "prioridade": "alta|media|baixa" }
  ],
  "produtividade_media_regiao": "X sacas/ha ou toneladas/ha",
  "custo_estimado_ha": "R$ X.XXX a R$ X.XXX",
  "receita_estimada_ha": "R$ X.XXX a R$ X.XXX"
}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json', temperature: 0.2 },
        }),
      },
    )

    if (!res.ok) throw new Error('Gemini indisponível')
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Resposta inválida')
    const calendario = JSON.parse(match[0])

    return new Response(
      JSON.stringify({
        success: true,
        data: calendario,
        clima_atual: clima,
        gerado_em: new Date().toISOString(),
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
