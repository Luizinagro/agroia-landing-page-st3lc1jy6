import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function useSubscription() {
  const { user, loading: authLoading } = useAuth() as any
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlan() {
      if (authLoading) return

      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        const cleanUserId = String(user.id).trim()

        const { data, error } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', cleanUserId)
          .maybeSingle()

        if (error) {
          console.error('[useSubscription] Erro na consulta do Supabase:', error)
        }

        setPlan(data)
      } catch (err) {
        console.error('Error fetching plan:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [user?.id, authLoading])

  const hasFeature = (feature: string) => {
    const userPlanName =
      plan?.plan_name || user?.plan_type || user?.plan_active || user?.plano_ativo || 'Básico'

    const basicoFeatures = ['dashboard', 'comunidade']
    const plantioSoloFeatures = ['dashboard', 'comunidade', 'roi', 'previsao-ia', 'loja']
    const pecuarioSoloFeatures = ['dashboard', 'comunidade', 'pecuaria', 'rastreabilidade', 'loja']
    const completoFeatures = [
      ...plantioSoloFeatures,
      ...pecuarioSoloFeatures,
      'faturamento',
      'meus-calculos',
      'crm',
      'checkout',
      'analise-satelite',
      'consultor-ia-agro',
      'consultores',
      'analise-compartilhada',
    ]
    const familiaFeatures = [...completoFeatures, 'multi_propriedade', 'relatorios']

    if (userPlanName === 'Básico') {
      return basicoFeatures.includes(feature)
    }
    if (userPlanName === 'Plantio Solo') {
      return plantioSoloFeatures.includes(feature)
    }
    if (userPlanName === 'Pecuário Solo') {
      return pecuarioSoloFeatures.includes(feature)
    }
    if (userPlanName === 'Completo') {
      return completoFeatures.includes(feature)
    }
    if (userPlanName === 'Família Coop') {
      return familiaFeatures.includes(feature)
    }

    return false
  }

  return { plan, loading, hasFeature }
}
