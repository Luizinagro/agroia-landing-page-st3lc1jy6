import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export const rhService = {
  async call(action: string, payload: any = {}) {
    const { data, error } = await supabase.functions.invoke('gestao-rh', {
      body: { action, ...payload },
    })

    if (error) {
      if (error.message?.toLowerCase().includes('limite')) {
        toast({
          title: 'Aviso de Limite',
          description: error.message,
          className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        })
        return null
      }
      throw error
    }

    if (data && !data.success) {
      if (data?.error?.toLowerCase().includes('limite')) {
        toast({
          title: 'Aviso de Limite',
          description: data.error,
          className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        })
        return null
      }
      throw new Error(data.error || 'Erro na requisição')
    }

    return data?.data
  },
}
