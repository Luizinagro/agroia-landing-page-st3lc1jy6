import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (!geminiKey) throw new Error('Chave Gemini não configurada.')

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()
    if (userError || !user) throw new Error('Não autenticado')

    const adminCheck = createClient(supabaseUrl, supabaseServiceKey)
    const { data: dentroDoLimite } = await adminCheck.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_function: 'diagnostico-praga',
      p_max_requests: 10,
      p_window_minutes: 10,
    })
    if (dentroDoLimite === false)
      throw new Error('Limite de diagnósticos atingido. Tente novamente em alguns minutos.')

    const body = await req.json()
    const { imagem_base64, mime_type, cultura, descricao, latitude, longitude } = body

    if (!imagem_base64) throw new Error('imagem_base64 é obrigatório.')

    // Monta prompt especializado para diagnóstico agrícola
    const hoje = new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const prompt = `Você é um fitopatologista e entomologista especialista em agricultura tropical brasileira.
Data de hoje: ${hoje}
${cultura ? `Cultura: ${cultura}` : ''}
${descricao ? `Descrição do produtor: "${descricao}"` : ''}
${latitude && longitude ? `Localização: Lat ${parseFloat(latitude).toFixed(4)}, Lon ${parseFloat(longitude).toFixed(4)}` : ''}

Analise a imagem da lavoura e faça um diagnóstico completo.

Responda APENAS com JSON válido (sem markdown):
{
  "diagnostico": {
    "identificado": "Nome da praga, doença ou problema (ex: Ferrugem Asiática da Soja)",
    "nome_cientifico": "Phakopsora pachyrhizi",
    "tipo": "doença fúngica | praga inseto | deficiência nutricional | problema climático | sem problema",
    "confianca": 87,
    "descricao": "Descrição clara do que foi identificado na imagem"
  },
  "severidade": {
    "nivel": "baixa | media | alta | critica",
    "percentual_afetado": "10-20%",
    "urgencia": "Pode aguardar | Tratar em 3-5 dias | Tratar HOJE | EMERGÊNCIA"
  },
  "tratamento": {
    "produto_recomendado": "Nome comercial do defensivo (ex: Tilt 250 EC)",
    "principio_ativo": "Propiconazol",
    "dose": "0,5 L/ha",
    "modo_aplicacao": "Pulverização foliar com volume de 150-200 L/ha",
    "momento_aplicacao": "Manhã cedo ou fim de tarde, evitar sol forte",
    "numero_aplicacoes": 2,
    "intervalo_dias": 14,
    "custo_estimado_ha": "R$ 45-80/ha"
  },
  "prevencao": {
    "acoes": ["ação preventiva 1", "ação preventiva 2", "ação preventiva 3"],
    "monitoramento": "Como monitorar o problema nas próximas semanas"
  },
  "alerta_agrônomo": true,
  "observacoes": "Informações adicionais relevantes para o produtor",
  "fontes": ["Embrapa", "AGROFIT/MAPA"]
}

Se a imagem não mostrar problemas visíveis, retorne tipo "sem problema" e oriente sobre prevenção.
Se a imagem não for de uma planta/lavoura, retorne um erro explicativo no campo "diagnostico.identificado".`

    // Chama Gemini Vision
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mime_type || 'image/jpeg',
                    data: imagem_base64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.2,
          },
        }),
      },
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      throw new Error(`Gemini Vision falhou: ${errText}`)
    }

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Resposta inválida do Gemini Vision')

    const diagnostico = JSON.parse(match[0])
    const analiseDate = new Date().toISOString()

    // Salva no banco para histórico
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    try {
      await supabase.from('diagnosticos_pragas').insert({
        user_id: user.id,
        cultura: cultura || 'não informada',
        praga_identificada: diagnostico.diagnostico?.identificado,
        severidade: diagnostico.severidade?.nivel,
        confianca: diagnostico.diagnostico?.confianca,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        analise_completa: diagnostico,
        created_at: analiseDate,
      })
    } catch (dbErr) {
      console.warn('Tabela diagnosticos_pragas não existe ainda:', dbErr)
      // Tenta criar na tabela genérica de análises
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: diagnostico,
        analise_date: analiseDate,
        message: `✅ Diagnóstico concluído: ${diagnostico.diagnostico?.identificado || 'análise realizada'}`,
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
