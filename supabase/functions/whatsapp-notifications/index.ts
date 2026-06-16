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
    const whatsappToken = Deno.env.get('WHATSAPP_TOKEN') || 'mock_token';
    const whatsappPhoneNumberId = Deno.env.get('WHATSAPP_PHONE_ID') || 'mock_phone_id';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await req.json();
    const { event_type, user_id, data } = body;

    // Helper to send WhatsApp message
    const sendWhatsAppMessage = async (phone: string, message: string) => {
      if (!phone) return null;
      
      const cleanPhone = phone.replace(/\D/g, '');
      
      if (whatsappToken === 'mock_token' || whatsappPhoneNumberId === 'mock_phone_id') {
        console.log(`[MOCK WHATSAPP to ${cleanPhone}]:\n${message}`);
        return { success: true, mocked: true, phone: cleanPhone, message };
      }

      const response = await fetch(`https://graph.facebook.com/v17.0/${whatsappPhoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: { body: message },
        }),
      });

      return await response.json();
    };

    let results = [];

    if (event_type === 'ORDER_UPDATE') {
      const { data: user } = await supabase.from('users').select('phone, name').eq('id', user_id).single();
      if (user?.phone) {
        const message = `📦 *Atualização de Pedido!*\n\nOlá ${user.name || 'Produtor'},\nO status do seu pedido #${data.order_id?.substring(0,6) || data.order_id} foi atualizado para: *${data.status}*.\n\nAcompanhe no seu painel: https://agroia-landing-page-a72f6.goskip.app/dashboard`;
        const res = await sendWhatsAppMessage(user.phone, message);
        results.push(res);
      } else {
        results.push({ success: false, error: 'User has no phone number' });
      }
    } else if (event_type === 'PRICE_ALERT') {
      const { data: user } = await supabase.from('users').select('phone, name').eq('id', user_id).single();
      if (user?.phone) {
        const message = `🚨 *Alerta de Preço Atingido!*\n\nOlá ${user.name || 'Produtor'},\nA commodity *${data.commodity}* atingiu sua meta de R$ ${data.target_price}.\nPreço atual: R$ ${data.current_price}.\n\nAcesse o sistema para mais detalhes: https://agroia-landing-page-a72f6.goskip.app/previsao-ia`;
        const res = await sendWhatsAppMessage(user.phone, message);
        results.push(res);
      } else {
        results.push({ success: false, error: 'User has no phone number' });
      }
    } else if (event_type === 'NDVI_ALERT') {
      const { data: user } = await supabase.from('users').select('phone, name').eq('id', user_id).single();
      if (user?.phone) {
        const message = `🚨 *Alerta AgroIA: Queda de NDVI!*\n\nOlá ${user.name || 'Produtor'},\nO índice NDVI da sua área (Lat: ${data.latitude}, Lng: ${data.longitude}) caiu para *${data.ndvi}*.\n\nRecomendamos uma vistoria na área.\nAcesse: https://agroia.goskip.app/analise-satelite`;
        const res = await sendWhatsAppMessage(user.phone, message);
        results.push(res);
      } else {
        results.push({ success: false, error: 'User has no phone number' });
      }
    } else if (event_type === 'AI_RECOMMENDATION') {
      if (user_id) {
         const { data: user } = await supabase.from('users').select('phone, name').eq('id', user_id).single();
         if (user?.phone) {
           const message = `🤖 *Nova Recomendação da IA AgroIA*\n\nAnálise para *${data.commodity}*:\n${data.recommendation}\n\nConfira os gráficos completos: https://agroia-landing-page-a72f6.goskip.app/previsao-ia`;
           const res = await sendWhatsAppMessage(user.phone, message);
           results.push(res);
         } else {
           results.push({ success: false, error: 'User has no phone number' });
         }
      } else {
         const { data: users } = await supabase.from('users').select('phone, name').not('phone', 'is', null).limit(50);
         if (users) {
           for (const user of users) {
             const message = `🤖 *Nova Recomendação da IA AgroIA*\n\nAnálise para *${data.commodity}*:\n${data.recommendation}\n\nConfira os gráficos completos: https://agroia-landing-page-a72f6.goskip.app/previsao-ia`;
             const res = await sendWhatsAppMessage(user.phone, message);
             results.push(res);
           }
         }
      }
    } else {
      throw new Error('Invalid event_type');
    }

    return new Response(JSON.stringify({ success: true, results }), {
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
