import { supabase } from '@/lib/supabase/client'

export type WhatsAppEventType = 'PRICE_ALERT' | 'AI_RECOMMENDATION' | 'ORDER_UPDATE' | 'NDVI_ALERT'

export interface WhatsAppPayload {
  event_type: WhatsAppEventType
  user_id?: string
  data: any
}

export const sendWhatsAppNotification = async (payload: WhatsAppPayload) => {
  const { data, error } = await supabase.functions.invoke('whatsapp-notifications', {
    body: payload,
  })
  return { data, error }
}
