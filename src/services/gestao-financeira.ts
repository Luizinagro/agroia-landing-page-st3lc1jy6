import { supabase } from '@/lib/supabase/client'

export const financeiroApi = {
  async invoke(action: string, payload: any = {}) {
    const { data, error } = await supabase.functions.invoke('gestao-financeira', {
      body: { action, ...payload },
    })

    if (error) throw error
    if (!data?.success) throw new Error(data?.error || 'Erro na requisição financeira')

    return data.data
  },
}
