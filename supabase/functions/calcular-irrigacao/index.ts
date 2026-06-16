import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

async function buscarDadosIrrigacao(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm` +
    `&daily=et0_fao_evapotranspiration,precipitation_sum,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7&past_days=3`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Open-Meteo indisponível');
  return await res.json();
}

// Calcula necessidade de irrigação baseado em balanço hídrico real
function calcularBalancoHidrico(dados: any, cultura: string) {
  const et0_hoje = dados.daily?.et0_fao_evapotranspiration?.[3] ?? 5; // dia atual (após 3 dias passados)
  const chuva_hoje = dados.daily?.precipitation_sum?.[3] ?? 0;
  const chuva_7d = (dados.daily?.precipitation_sum ?? []).reduce((a: number, b: number) => a + (b ?? 0), 0);
  const umidade_solo = dados.current?.soil_moisture_3_to_9cm ?? 0.25;

  // Coeficiente de cultivo (Kc) por cultura
  const kc: Record<string, number> = {
    'soja': 1.15, 'milho': 1.20, 'trigo': 1.10, 'cafe': 1.05,
    'cana-de-acucar': 1.25, 'algodao': 1.15, 'arroz': 1.20,
    'feijao': 1.05, 'tomate': 1.15, 'cebola': 1.05, 'padrao': 1.0
  };

  const kc_cultura = kc[cultura?.toLowerCase()] ?? kc['padrao'];
  const etc = et0_hoje * kc_cultura; // Evapotranspiração da cultura
  const deficit = Math.max(0, etc - chuva_hoje);
  const umidade_pct = umidade_solo * 100;

  // Status de necessidade
  let necessidade: string;
  let litros_m2: number;
  let urgencia: string;

  if (umidade_pct > 35 || chuva_7d > et0_hoje * 7 * kc_cultura) {
    necessidade = 'Não irrigar';
    litros_m2 = 0;
    urgencia = 'baixa';
  } else if (umidade_pct > 25) {
    necessidade = 'Irrigação leve';
    litros_m2 = Math.round(deficit * 1.5);
    urgencia = 'media';
  } else {
    necessidade = 'Irrigação necessária';
    litros_m2 = Math.round(deficit * 2.5);
    urgencia = 'alta';
  }

  return {
    et0_hoje: Number(et0_hoje.toFixed(2)),
    etc_cultura: Number(etc.toFixed(2)),
    chuva_hoje: Number(chuva_hoje.toFixed(1)),
    chuva_7d: Number(chuva_7d.toFixed(1)),
    umidade_solo_pct: Number(umidade_pct.toFixed(1)),
    deficit_hidrico: Number(deficit.toFixed(2)),
    necessidade,
    litros_m2,
    urgencia
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const { latitude, longitude, cultura, area_hectares, sistema_irrigacao } = body;
    if (!latitude || !longitude) throw new Error('Latitude e longitude são obrigatórios.');

    const geminiKey = Deno.env.get('GEMINI_API_KEY') || '';
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Busca dados reais de evapotranspiração e clima
    const dados = await buscarDadosIrrigacao(lat, lon);
    const balanco = calcularBalancoHidrico(dados, cultura || 'padrao');

    // Previsão 7 dias
    const previsao7d = (dados.daily?.et0_fao_evapotranspiration ?? []).slice(3).map((et0: number, i: number) => ({
      dia: i + 1,
      data: new Date(Date.now() + i * 86400000).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }),
      et0: Number(et0?.toFixed(2) ?? 0),
      chuva_prevista: Number((dados.daily?.precipitation_sum?.[i + 3] ?? 0).toFixed(1)),
      irrigar: (et0 ?? 0) > (dados.daily?.precipitation_sum?.[i + 3] ?? 0) + 2
    }));

    // Cálculo de volume total para a área
    const area_m2 = (area_hectares || 1) * 10000;
    const volume_total_litros = balanco.litros_m2 * area_m2;
    const volume_total_m3 = (volume_total_litros / 1000).toFixed(1);

    // Recomendação da IA
    let recomendacao_ia = '';
    if (geminiKey) {
      const prompt = `Você é um especialista em irrigação agrícola.
Dados reais do campo:
- Cultura: ${cultura || 'não informada'}
- ET₀ hoje: ${balanco.et0_hoje} mm/dia
- Evapotranspiração da cultura: ${balanco.etc_cultura} mm/dia
- Chuva hoje: ${balanco.chuva_hoje} mm | Chuva 7 dias: ${balanco.chuva_7d} mm
- Umidade do solo (3-9cm): ${balanco.umidade_solo_pct}%
- Déficit hídrico: ${balanco.deficit_hidrico} mm
- Sistema de irrigação: ${sistema_irrigacao || 'gotejamento'}
- Área: ${area_hectares || 1} ha

Decisão calculada: ${balanco.necessidade} (${balanco.litros_m2} L/m²)

Dê uma recomendação prática em 3-4 frases sobre: quando irrigar (horário ideal), quanto irrigar, e cuidados especiais para ${cultura || 'essa cultura'} nessa condição.`;

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          }
        );
        if (res.ok) {
          const d = await res.json();
          recomendacao_ia = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (e) { console.warn('Gemini error:', e); }
    }

    const temperatura = dados.current?.temperature_2m ?? 25;
    const umidade_ar = dados.current?.relative_humidity_2m ?? 65;
    const vento = dados.current?.wind_speed_10m ?? 10;

    return new Response(JSON.stringify({
      success: true,
      data: {
        decisao: {
          necessidade: balanco.necessidade,
          urgencia: balanco.urgencia,
          litros_por_m2: balanco.litros_m2,
          volume_total_m3: Number(volume_total_m3),
          melhor_horario: temperatura > 28 ? 'Antes das 9h ou após as 17h' : 'Qualquer horário nublado'
        },
        balanco_hidrico: balanco,
        condicoes_atuais: {
          temperatura: Number(temperatura.toFixed(1)),
          umidade_ar: Math.round(umidade_ar),
          vento_kmh: Number(vento.toFixed(1))
        },
        previsao_7_dias: previsao7d,
        recomendacao_ia,
        area_hectares: area_hectares || 1,
        cultura: cultura || 'não informada'
      },
      fonte: 'Open-Meteo (dados reais)',
      gerado_em: new Date().toISOString()
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
    });
  }
});
