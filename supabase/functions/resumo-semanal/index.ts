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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch users with emails to send summaries
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .neq('email', null)
      .limit(50)

    if (usersError) throw usersError

    const results = []

    for (const user of users || []) {
      const { count: tasksCount } = await supabase
        .from('agenda_manejo')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'Pendente')

      const { data: maquinario } = await supabase
        .from('maquinario')
        .select('nome')
        .eq('user_id', user.id)

      const pendenciasText = tasksCount ? `${tasksCount} atividades agendadas.` : 'Tudo em dia!'
      const maquinarioText = maquinario?.length
        ? `${maquinario.length} equipamentos cadastrados.`
        : 'Nenhum maquinário.'

      const htmlContent = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1DB954;">Resumo Semanal AgroIA</h2>
          <p>Olá, <strong>${user.name || 'Produtor'}</strong>!</p>
          <p>Aqui está o seu resumo gerencial da semana:</p>
          <ul>
            <li><strong>Agenda de Manejo:</strong> ${pendenciasText}</li>
            <li><strong>Maquinário:</strong> ${maquinarioText}</li>
          </ul>
          <p>Acesse seu <a href="https://agroia.goskip.app/dashboard">Dashboard</a> para mais insights climáticos e de safra.</p>
          <p>Um abraço,<br/>Equipe AgroIA</p>
        </div>
      `

      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'AgroIA Resumos <onboarding@resend.dev>',
              to: user.email,
              subject: 'Seu Resumo Semanal AgroIA',
              html: htmlContent,
            }),
          })
          results.push({ email: user.email, success: true })
        } catch (e) {
          results.push({ email: user.email, success: false, error: e })
        }
      } else {
        console.log(`[MOCK EMAIL SEND] To: ${user.email} - Subject: Resumo Semanal`)
        results.push({ email: user.email, success: true, mocked: true })
      }
    }

    return new Response(JSON.stringify({ success: true, sent: results.length, details: results }), {
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
