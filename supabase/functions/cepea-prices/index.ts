import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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
    // Mock CEPEA API response for agricultural commodities
    // Em um cenário real, isso faria um fetch na API oficial do CEPEA.
    // Preços em BRL por tonelada.
    const prices = {
      'Soja': 2166.00,
      'Milho': 1000.00,
      'Trigo': 1400.00,
      'Boi Gordo (Arroba)': 235.50,
      'Bezerro (Cabeça)': 1980.00,
    };

    return new Response(JSON.stringify({ prices }), {
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
