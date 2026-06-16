import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

    const { data: animais, error: animaisError } = await supabase
      .from('animais')
      .select('*, users:user_id(email, name)')
      .gte('proximo_cio_estimado', todayStr)
      .lte('proximo_cio_estimado', threeDaysStr);

    if (animaisError) throw animaisError;

    const results = [];

    for (const animal of animais || []) {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10);

      const { data: existingAlerts } = await supabase
        .from('alertas_cio')
        .select('id')
        .eq('animal_id', animal.id)
        .gte('created_at', tenDaysAgo.toISOString())
        .limit(1);

      if (!existingAlerts || existingAlerts.length === 0) {
        const dataProximo = new Date(animal.proximo_cio_estimado).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const mensagem = `Atenção: O animal ${animal.nome} (${animal.tipo}) está próximo de entrar em cio. Previsão estimada para ${dataProximo}.`;
        
        const { error: insertError } = await supabase
          .from('alertas_cio')
          .insert({
            user_id: animal.user_id,
            animal_id: animal.id,
            mensagem,
          });

        if (insertError) {
          console.error('Error inserting alert:', insertError);
          continue;
        }

        const userEmail = animal.users?.email;
        const userName = animal.users?.name || 'Produtor';

        if (resendApiKey && userEmail) {
          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'AgroIA Alertas <onboarding@resend.dev>',
                to: userEmail,
                subject: `Alerta: ${animal.nome} entrando em cio`,
                html: `<div style="font-family: sans-serif; color: #333;">
                  <h2>Alerta de Cio - AgroIA</h2>
                  <p>Olá ${userName},</p>
                  <p>Este é um aviso automático do seu sistema AgroIA.</p>
                  <p><strong>${mensagem}</strong></p>
                  <p>Acesse seu painel para visualizar mais detalhes e recomendações da IA.</p>
                </div>`
              })
            });
            results.push({ animal: animal.nome, email_sent: true });
          } catch (e) {
            console.error('Error sending email:', e);
            results.push({ animal: animal.nome, email_sent: false, error: e });
          }
        } else {
          console.log(`[MOCK EMAIL] To: ${userEmail}, Subject: Alerta: ${animal.nome} entrando em cio\nBody: ${mensagem}`);
          results.push({ animal: animal.nome, email_sent: false, reason: 'No Resend API Key or missing email' });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, checked: animais?.length || 0, alerts_created: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
