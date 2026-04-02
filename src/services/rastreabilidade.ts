import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type RastreabilidadeInsert = Database['public']['Tables']['rastreabilidade']['Insert']
type RastreabilidadeUpdate = Database['public']['Tables']['rastreabilidade']['Update']

export async function getRastreabilidades() {
  const { data, error } = await supabase
    .from('rastreabilidade')
    .select('*')
    .order('data', { ascending: false })

  if (error) throw error
  return data
}

export async function addRastreabilidade(rastreabilidade: Omit<RastreabilidadeInsert, 'user_id'>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('rastreabilidade')
    .insert({ ...rastreabilidade, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRastreabilidade(id: string, updates: RastreabilidadeUpdate) {
  const { data, error } = await supabase
    .from('rastreabilidade')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRastreabilidade(id: string) {
  const { error } = await supabase.from('rastreabilidade').delete().eq('id', id)

  if (error) throw error
}
