import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function buscarCotacaoCarbon(): Promise<number> {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
    if (!res.ok) return 93.6
    const data = await res.json()
    const usdBrl = parseFloat(data['USDBRL']?.bid || '5.20')
    return Number((18 * usdBrl).toFixed(2))
  } catch {
    return 93.6
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const body = await req.json()
    const { area_hectares, cultura, praticas_sustentaveis, anos_pratica, bioma, estado } = body
    if (!area_hectares) throw new Error('"area_hectares" é obrigatório.')

    const geminiKey = Deno.env.get('GEMINI_API_KEY') || ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    const adminCheck = createClient(supabaseUrl, supabaseServiceKey)
    const rateLimitKey = authHeader || req.headers.get('x-forwarded-for') || 'anon'
    const { data: dentroDoLimite } = await adminCheck.rpc('check_rate_limit', {
      p_user_id: rateLimitKey,
      p_function: 'calculadora-carbono',
      p_max_requests: 10,
      p_window_minutes: 10,
    })
    if (dentroDoLimite === false)
      throw new Error('Limite de cálculos atingido. Tente novamente em alguns minutos.')

    const cotacaoBRL = await buscarCotacaoCarbon()
    const hoje = new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const prompt = `Você é um especialista em mercado de carbono agrícola e regenerativo no Brasil.
Data: ${hoje}
Cotação atual do crédito de carbono: R$ ${cotacaoBRL}/tCO₂ (mercado voluntário VCS, base USD 18/tCO₂)

Calcule o potencial de geração e venda de créditos de carbono:

PROPRIEDADE:
- Área: ${area_hectares} hectares
- Cultura: ${cultura || 'não informada'}
- Bioma: ${bioma || 'Cerrado'}
- Estado: ${estado || 'não informado'}
- Práticas sustentáveis: ${(praticas_sustentaveis || []).join(', ') || 'nenhuma ainda'}
- Anos praticando: ${anos_pratica || 0} anos

Responda APENAS com JSON válido (sem markdown):
{
  "potencial_sequestro": {
    "toneladas_co2_ano": 145.5,
    "toneladas_co2_5anos": 727.5,
    "metodologia": "Verra VM0042 - Agriculture Improved Land Management"
  },
  "receita_carbono": {
    "receita_anual_brl": 13610.00,
    "receita_5anos_brl": 68055.00,
    "cotacao_usada_brl": ${cotacaoBRL},
    "receita_por_hectare_ano": 136.10
  },
  "praticas_recomendadas": [
    {
      "pratica": "Plantio Direto",
      "impacto_co2_ton_ha_ano": 0.5,
      "custo_implantacao": "R$ 200-500/ha",
      "payback_anos": 2,
      "descricao": "Elimina revolvimento do solo, aumentando matéria orgânica"
    }
  ],
  "certificacoes_viaveis": [
    {
      "nome": "Verra VCS",
      "descricao": "Principal certificação internacional de carbono voluntário",
      "custo_certificacao": "R$ 15.000-50.000",
      "prazo_meses": 18,
      "mercado": "Internacional"
    }
  ],
  "passos_para_comecar": [
    "Contratar consultoria de MRV (Monitoramento, Reporte e Verificação)",
    "Realizar diagnóstico de linha de base da propriedade",
    "Implementar e documentar práticas sustentáveis por 1 ano",
    "Submeter projeto para verificação e certificação"
  ],
  "score_sustentabilidade": 72,
  "nivel_prontidao": "Em desenvolvimento",
  "resumo": "Texto com oportunidade e próximo passo mais importante"
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
    const geminiData = await res.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Resposta inválida')
    const resultado = JSON.parse(match[0])

    // Salva histórico se autenticado
    if (authHeader) {
      try {
        const userClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        })
        const {
          data: { user },
        } = await userClient.auth.getUser()
        if (user) {
          const admin = createClient(supabaseUrl, supabaseServiceKey)
          await admin.from('calculos_carbono').insert({
            user_id: user.id,
            area_hectares: Number(area_hectares),
            cultura: cultura || null,
            bioma: bioma || null,
            praticas: praticas_sustentaveis || [],
            toneladas_co2_ano: resultado.potencial_sequestro?.toneladas_co2_ano,
            receita_anual: resultado.receita_carbono?.receita_anual_brl,
            score_sustentabilidade: resultado.score_sustentabilidade,
            resultado_completo: resultado,
          })
        }
      } catch (e) {
        console.warn('Histórico não salvo:', e)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: resultado,
        cotacao_carbono_brl: cotacaoBRL,
        gerado_em: new Date().toISOString(),
        aviso:
          'Estimativa baseada em médias de mercado voluntário. Consulte especialista certificado para valores exatos.',
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
