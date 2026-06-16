import { supabase } from '@/lib/supabase/client'

export const rhService = {
  async call(action: string, payload: any = {}) {
    const { data, error } = await supabase.functions.invoke('gestao-rh', {
      body: { action, ...payload },
    })

    if (error) {
      throw error
    }

    if (data && !data.success) {
      throw new Error(data.error || 'Erro na requisição')
    }

    return data?.data
  },
}
