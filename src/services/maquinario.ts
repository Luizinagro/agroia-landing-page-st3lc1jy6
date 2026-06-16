import { supabase } from '@/lib/supabase/client'

export const invokeMaquinario = async (payload: any) => {
  const { data, error } = await supabase.functions.invoke('gestao-maquinario', {
    body: payload,
  })
  if (error || !data?.success) {
    throw new Error(
      data?.error || error?.message || 'Serviço temporariamente indisponível. Tente novamente.',
    )
  }
  return data.data
}
