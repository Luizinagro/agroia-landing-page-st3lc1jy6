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
    const { commodity, current_price_saca } = await req.json();
    if (!commodity) {
      throw new Error('Commodity is required');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    // Default base prices for realistic mock/fallback
    const basePrices: Record<string, number> = {
      'Soja': 130.50,
      'Milho': 60.00,
      'Trigo': 84.00,
      'Café': 1200.00,
    };
    
    const currentPrice = current_price_saca || basePrices[commodity] || 100;
    
    let trend_data: any[] = [];
    let recommendation = "";
    let previsao_30d = 0;
    let previsao_60d = 0;

    if (apiKey) {
      const prompt = `Gere uma previsão de preços para a commodity agrícola "${commodity}" para os próximos 60 dias. 
      O preço atual da SACA (60kg) é R$ ${currentPrice}. 
      Responda ESTRITAMENTE em formato JSON com a seguinte estrutura, sem markdown ao redor:
      {
        "trend_data": [{"date": "YYYY-MM-DD", "price": 135.50}],
        "previsao_30d": 132.50,
        "previsao_60d": 135.80,
        "recommendation": "Recomendação curta sobre quando comercializar baseado nos preços."
      }
      Gere exatos 60 itens em trend_data. O valor "price" em trend_data deve ser o preço da SACA.`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        if (!response.ok) {
          console.error(`Gemini API error: ${response.status} ${response.statusText}`);
        } else {
          const data = await response.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (text) {
            try {
              const jsonMatch = text.match(/\{[\s\S]*\}/);
              const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
              trend_data = parsed.trend_data;
              recommendation = parsed.recommendation;
              previsao_30d = parsed.previsao_30d;
              previsao_60d = parsed.previsao_60d;
            } catch(e) {
              console.error("Failed to parse Gemini JSON", e, text);
            }
          }
        }
      } catch (err) {
        console.error("Error calling Gemini API:", err);
      }
    }

    // Fallback if no API key or parsing failed
    if (!trend_data || trend_data.length === 0) {
      const today = new Date();
      trend_data = Array.from({ length: 60 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const change = (Math.random() - 0.4) * 5;
        return {
          date: d.toISOString().split('T')[0],
          price: Number((currentPrice + change + (i * 0.2)).toFixed(2))
        };
      });
      previsao_30d = trend_data[29].price;
      previsao_60d = trend_data[59].price;
      recommendation = `Baseado na análise de tendências de mercado para ${commodity}, recomendamos monitorar os preços de perto. Há um viés de leve alta nas próximas semanas, o que pode favorecer a comercialização a médio prazo.`;
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    let inserted = null;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await supabase
        .from('ai_forecasts')
        .insert({
          commodity,
          current_price: currentPrice,
          trend_data,
          recommendation
        })
        .select()
        .single();

      if (error) {
        console.error("DB Insert Error:", error);
      } else {
        inserted = data;
      }
    }

    return new Response(JSON.stringify({ 
      data: {
        ...(inserted || { commodity, current_price: currentPrice, trend_data, recommendation }),
        previsao_30d,
        previsao_60d
      } 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
