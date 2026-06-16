import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

async function buscarClimaPropriedade(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto&past_days=7&forecast_days=3`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const chuva7d = (data.daily?.precipitation_sum?.slice(0, 7) ?? []).reduce((a: number, b: number) => a + (b ?? 0), 0).toFixed(1);
    const tempMedia = (((data.daily?.temperature_2m_max?.[0] ?? 28) + (data.daily?.temperature_2m_min?.[0] ?? 18)) / 2).toFixed(1);
    return { chuva7d, tempMedia };
  } catch { return null; }
}

async function buscarPrecosCultura(supabase: any, cultura: string) {
  try {
    const culturaKey = cultura.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
    const { data } = await supabase.from('precos_cache').select('preco_saca, variacao_dia, unidade').eq('commodity', culturaKey).order('created_at', { ascending: false }).limit(1).single();
    return data;
  } catch { return null; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const resendKey = Deno.env.get('RESEND_API_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: users } = await supabase.from('users').select('id, name, email').not('email', 'is', null).limit(100);
    const results = [];

    for (const user of users || []) {
      try {
        // Busca dados do usuário
        const [
          { count: tarefasPendentes },
          { data: propriedades },
          { data: ultimaAnalise },
          { data: maquinario }
        ] = await Promise.all([
          supabase.from('agenda_manejo').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'Pendente'),
          supabase.from('propriedades').select('nome, cultura_principal, area_hectares, latitude, longitude').eq('user_id', user.id).limit(3),
          supabase.from('satellite_analyses').select('ndvi_value, soil_moisture, temperature, analysis_date').eq('user_id', user.id).order('analysis_date', { ascending: false }).limit(1),
          supabase.from('maquinario').select('nome').eq('user_id', user.id)
        ]);

        const prop = propriedades?.[0];
        const analise = ultimaAnalise?.[0];

        // Busca dados reais em paralelo
        const [climaData, precoData] = await Promise.all([
          prop?.latitude ? buscarClimaPropriedade(parseFloat(prop.latitude), parseFloat(prop.longitude)) : null,
          prop?.cultura_principal ? buscarPrecosCultura(supabase, prop.cultura_principal) : null
        ]);

        // Define status do NDVI
        const ndviStatus = analise?.ndvi_value
          ? analise.ndvi_value > 0.65 ? '🟢 Saudável' : analise.ndvi_value > 0.45 ? '🟡 Atenção' : '🔴 Crítico'
          : '⚪ Sem análise recente';

        const variacaoPreco = precoData?.variacao_dia
          ? `${precoData.variacao_dia >= 0 ? '▲' : '▼'} R$ ${Math.abs(precoData.variacao_dia).toFixed(2)}`
          : '';

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resumo Semanal AgroIA</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#2d6a4f,#40916c);padding:32px;text-align:center;">
    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">🌾 AgroIA</h1>
    <p style="color:#b7e4c7;margin:8px 0 0;font-size:16px;">Resumo Semanal da sua Propriedade</p>
  </td></tr>

  <!-- Saudação -->
  <tr><td style="padding:28px 32px 16px;">
    <p style="font-size:18px;color:#1b4332;margin:0;">Olá, <strong>${user.name || 'Produtor'}</strong>! 👋</p>
    <p style="color:#555;margin:8px 0 0;font-size:15px;">Aqui está o resumo completo da semana para ${prop?.nome || 'sua propriedade'}.</p>
  </td></tr>

  <!-- Cards de métricas -->
  <tr><td style="padding:8px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <!-- Satélite / NDVI -->
        <td width="48%" style="background:#f0fdf4;border-radius:10px;padding:18px;vertical-align:top;">
          <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">🛰️ Saúde da Lavoura</p>
          <p style="margin:6px 0 2px;font-size:22px;font-weight:700;color:#1b4332;">${analise?.ndvi_value?.toFixed(2) ?? '—'}</p>
          <p style="margin:0;font-size:14px;color:#374151;">NDVI — ${ndviStatus}</p>
          ${analise?.soil_moisture ? `<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">💧 Umidade solo: ${analise.soil_moisture}%</p>` : ''}
        </td>
        <td width="4%"></td>
        <!-- Clima -->
        <td width="48%" style="background:#eff6ff;border-radius:10px;padding:18px;vertical-align:top;">
          <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">🌦️ Clima da Semana</p>
          <p style="margin:6px 0 2px;font-size:22px;font-weight:700;color:#1e3a5f;">${climaData?.chuva7d ?? '—'} mm</p>
          <p style="margin:0;font-size:14px;color:#374151;">Chuva acumulada (7 dias)</p>
          ${climaData?.tempMedia ? `<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">🌡️ Temp. média: ${climaData.tempMedia}°C</p>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:12px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <!-- Preço de mercado -->
        <td width="48%" style="background:#fffbeb;border-radius:10px;padding:18px;vertical-align:top;">
          <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">💰 Mercado</p>
          <p style="margin:6px 0 2px;font-size:22px;font-weight:700;color:#92400e;">${precoData ? `R$ ${precoData.preco_saca.toFixed(2)}` : '—'}</p>
          <p style="margin:0;font-size:14px;color:#374151;">${prop?.cultura_principal || 'Cultura'} / ${precoData?.unidade || 'saca'}</p>
          ${variacaoPreco ? `<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${variacaoPreco} hoje</p>` : ''}
        </td>
        <td width="4%"></td>
        <!-- Tarefas -->
        <td width="48%" style="background:#fdf4ff;border-radius:10px;padding:18px;vertical-align:top;">
          <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">📋 Agenda</p>
          <p style="margin:6px 0 2px;font-size:22px;font-weight:700;color:#5b21b6;">${tarefasPendentes ?? 0}</p>
          <p style="margin:0;font-size:14px;color:#374151;">Tarefas pendentes</p>
          ${maquinario?.length ? `<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">🚜 ${maquinario.length} equipamentos</p>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>

  ${propriedades && propriedades.length > 0 ? `
  <!-- Propriedades -->
  <tr><td style="padding:12px 32px;">
    <div style="background:#f9fafb;border-radius:10px;padding:18px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1b4332;">🏡 Suas Propriedades</p>
      ${propriedades.map(p => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;">
        <span style="font-size:14px;color:#374151;"><strong>${p.nome}</strong> — ${p.cultura_principal || 'Cultura não informada'}</span>
        <span style="font-size:13px;color:#6b7280;">${p.area_hectares ? `${p.area_hectares} ha` : ''}</span>
      </div>`).join('')}
    </div>
  </td></tr>` : ''}

  <!-- CTA -->
  <tr><td style="padding:20px 32px 32px;text-align:center;">
    <a href="https://agroia.goskip.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#2d6a4f,#40916c);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
      Ver Dashboard Completo →
    </a>
    <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
      Precisa de ajuda? Use o <strong>Consultor IA Agro</strong> para tirar dúvidas sobre sua lavoura.
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="margin:0;font-size:12px;color:#9ca3af;">
      © 2026 AgroIA — Inteligência Artificial para o Agronegócio Brasileiro<br>
      <a href="https://agroia.goskip.app" style="color:#40916c;">agroia.goskip.app</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

        // Envia email se Resend estiver configurado
        if (resendKey && user.email) {
          const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'AgroIA <noreply@agroia.com.br>',
              to: user.email,
              subject: `🌾 Seu Resumo Semanal AgroIA — ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`,
              html
            })
          });
          results.push({ email: user.email, success: emailRes.ok, status: emailRes.status });
        } else {
          results.push({ email: user.email, success: false, motivo: resendKey ? 'email inválido' : 'RESEND_API_KEY não configurada' });
        }
      } catch (userErr) {
        results.push({ email: user.email, success: false, error: String(userErr) });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      total_users: users?.length ?? 0,
      emails_enviados: results.filter(r => r.success).length,
      results
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
