import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

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

    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader) {
      throw new Error('Usuário não autenticado')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

    // Create user client to verify token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuário não autenticado')
    }

    const body = await req.json()
    const { regiao, pergunta } = body

    if (!regiao || !pergunta) {
      throw new Error('Região e pergunta são obrigatórios.')
    }

    // Mock data from APIs (CEPEA, CONAB, INPE)
    const mockRegionalData = {
      'Mato Grosso': { soja_preco: 125.5, clima: 'Quente e úmido', umidade_solo: '60%' },
      Paraná: { soja_preco: 132.0, clima: 'Ameno', umidade_solo: '70%' },
      'São Paulo': { soja_preco: 135.0, clima: 'Seco', umidade_solo: '50%' },
      Goiás: { soja_preco: 128.0, clima: 'Quente', umidade_solo: '55%' },
      'Minas Gerais': { soja_preco: 130.0, clima: 'Ameno', umidade_solo: '65%' },
      'Rio Grande do Sul': { soja_preco: 134.0, clima: 'Frio', umidade_solo: '75%' },
      Bahia: { soja_preco: 126.0, clima: 'Quente e seco', umidade_solo: '45%' },
      Tocantins: { soja_preco: 124.0, clima: 'Quente', umidade_solo: '50%' },
    }

    const regionalData =
      mockRegionalData[regiao as keyof typeof mockRegionalData] || mockRegionalData['São Paulo']

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    let geminiResponse = null

    if (apiKey) {
      const prompt = `Você é um especialista em agricultura de precisão e agronegócio brasileiro. Sua expertise cobre: culturas (soja, milho, café, cana), pecuária, previsão de preços, irrigação, fertilização, pragas e doenças. REGRA CRÍTICA DE VALORES REGIONAIS: Preços de insumos variam por região. Sempre considere a região do usuário. Adapte recomendações conforme clima regional. Considere logística e frete regional nos cálculos. FORMATO DE RESPOSTA: Sempre cite a região considerada. Mostre a variação de preço entre regiões quando relevante. Justifique por que o valor muda.

O usuário fez a seguinte pergunta: "${pergunta}"
A região do usuário é: ${regiao}
Aqui estão alguns dados regionais atuais (simulados) para contexto:
- Clima: ${regionalData.clima}
- Umidade do Solo: ${regionalData.umidade_solo}
- Preço Base Soja: R$ ${regionalData.soja_preco}

Responda ESTRITAMENTE em formato JSON, sem markdown ao redor, com a seguinte estrutura:
{
  "regiao_considerada": "${regiao}",
  "precos_regionais": ["Preço 1", "Preço 2"],
  "recomendacoes": "Recomendação detalhada e prática respondendo a pergunta do usuário considerando a região."
}`

      try {
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

        if (response.ok) {
          const data = await response.json()
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              geminiResponse = JSON.parse(jsonMatch[0])
            } else {
              geminiResponse = JSON.parse(
                text
                  .replace(/```json/g, '')
                  .replace(/```/g, '')
                  .trim(),
              )
            }
          }
        } else {
          console.error('Gemini API error:', response.status, response.statusText)
        }
      } catch (err) {
        console.error('Erro ao chamar Gemini:', err)
      }
    }

    if (!geminiResponse) {
      geminiResponse = {
        regiao_considerada: regiao,
        precos_regionais: [
          `Soja: R$ ${regionalData.soja_preco.toFixed(2)}`,
          `Milho: R$ ${(regionalData.soja_preco * 0.45).toFixed(2)}`,
        ],
        recomendacoes: `Considerando que você está em ${regiao} com clima ${regionalData.clima.toLowerCase()} e umidade de ${regionalData.umidade_solo}, recomendamos atenção ao planejamento de safra. Os preços variam em relação a outras regiões devido ao custo logístico local.`,
      }
    }

    // Save to database
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('consultas_ia')
      .insert({
        user_id: user.id,
        regiao,
        pergunta,
        resposta: geminiResponse,
        is_favorite: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao salvar consulta:', insertError)
    }

    return new Response(JSON.stringify({ success: true, data: inserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
