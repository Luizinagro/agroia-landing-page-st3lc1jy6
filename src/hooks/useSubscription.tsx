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
    let userPlanName =
      plan?.plan_name || user?.plan_type || user?.plan_active || user?.plano_ativo || 'Explorador'

    // Normalize old plans
    if (userPlanName === 'Básico') userPlanName = 'Explorador'
    if (userPlanName === 'Plantio Solo') userPlanName = 'Lavoura'
    if (userPlanName === 'Pecuário Solo' || userPlanName === 'Pecuária Solo')
      userPlanName = 'Rebanho'
    if (userPlanName === 'Completo') userPlanName = 'Fazendeiro Completo'
    if (userPlanName === 'Família Coop') userPlanName = 'Cooperativa'

    const exploradorFeatures = ['dashboard', 'comunidade']
    const lavouraFeatures = [
      'dashboard',
      'comunidade',
      'analise-satelite',
      'consultor-ia-agro',
      'diagnostico-pragas',
      'calendario-agricola',
      'irrigacao',
      'roi',
      'previsao-ia',
      'loja',
      'gestao',
    ]
    const rebanhoFeatures = [
      'dashboard',
      'comunidade',
      'pecuaria',
      'rastreabilidade',
      'consultor-ia-agro',
      'diagnostico-pragas',
      'previsao-ia',
      'loja',
      'gestao',
    ]
    const completoFeatures = [
      ...lavouraFeatures,
      ...rebanhoFeatures,
      'dashboard-consolidado',
      'calculadora-carbono',
      'crm',
      'faturamento',
      'meus-calculos',
      'checkout',
      'consultores',
      'analise-compartilhada',
    ]
    const familiaFeatures = [...completoFeatures, 'multi_propriedade', 'relatorios', 'api']

    if (userPlanName === 'Explorador') return exploradorFeatures.includes(feature)
    if (userPlanName === 'Lavoura') return lavouraFeatures.includes(feature)
    if (userPlanName === 'Rebanho') return rebanhoFeatures.includes(feature)
    if (userPlanName === 'Fazendeiro Completo') return completoFeatures.includes(feature)
    if (userPlanName === 'Cooperativa') return familiaFeatures.includes(feature)

    return false
  }

  return { plan, loading, hasFeature }
}
