import { supabase } from '@/lib/supabase/client'

export const getForecast = async (commodity: string, forceNew: boolean = false) => {
  if (!forceNew) {
    const { data: existing } = await supabase
      .from('ai_forecasts')
      .select('*')
      .eq('commodity', commodity)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      const hoursSince =
        (new Date().getTime() - new Date(existing.created_at).getTime()) / (1000 * 60 * 60)
      if (hoursSince < 24) {
        return { data: existing, error: null }
      }
    }
  }

  const { data, error } = await supabase.functions.invoke('gemini-forecast', {
    body: { commodity },
  })

  if (error) return { data: null, error }
  return { data: data?.data, error: null }
}

export const getAlerts = async () => {
  return await supabase.from('price_alerts').select('*').order('created_at', { ascending: false })
}

export const createAlert = async (
  userId: string,
  commodity: string,
  targetPrice: number,
  condition: string,
) => {
  return await supabase
    .from('price_alerts')
    .insert({
      user_id: userId,
      commodity,
      target_price: targetPrice,
      condition,
    })
    .select()
    .single()
}

export const deleteAlert = async (id: string) => {
  return await supabase.from('price_alerts').delete().eq('id', id)
}

export const toggleAlert = async (id: string, is_active: boolean) => {
  return await supabase.from('price_alerts').update({ is_active }).eq('id', id)
}
