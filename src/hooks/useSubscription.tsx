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
    if (userPlanName === 'Básico' || userPlanName === 'explorador') userPlanName = 'Explorador'
    if (userPlanName === 'Plantio Solo' || userPlanName === 'lavoura') userPlanName = 'Lavoura'
    if (
      userPlanName === 'Pecuário Solo' ||
      userPlanName === 'Pecuária Solo' ||
      userPlanName === 'rebanho'
    )
      userPlanName = 'Rebanho'
    if (userPlanName === 'Completo' || userPlanName === 'fazendeiro_completo')
      userPlanName = 'Fazendeiro Completo'
    if (userPlanName === 'Família Coop' || userPlanName === 'cooperativa')
      userPlanName = 'Cooperativa'

    const exploradorFeatures = [
      'dashboard',
      'comunidade',
      'consultor-ia-agro',
      'analise-satelite',
      'calendario-agricola',
      'precos-tempo-real',
      'previsao-ia',
    ]
    const lavouraFeatures = [
      ...exploradorFeatures,
      'diagnostico-pragas',
      'irrigacao',
      'roi',
      'resumo-semanal',
      'loja',
      'gestao',
      'gestao-financeira',
      'insumos',
      'maquinario',
    ]
    const rebanhoFeatures = [
      ...exploradorFeatures,
      'calculadora-carbono',
      'whatsapp-alertas',
      'maquinario',
      'pecuaria',
      'rastreabilidade',
      'loja',
      'gestao',
      'gestao-financeira',
    ]
    const completoFeatures = [
      ...new Set([...lavouraFeatures, ...rebanhoFeatures]),
      'gestao-insumos',
      'gestao-rh',
      'crm',
      'dashboard-consolidado',
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

  const getMinimumPlan = (feature: string) => {
    const exploradorFeatures = [
      'dashboard',
      'comunidade',
      'consultor-ia-agro',
      'analise-satelite',
      'calendario-agricola',
      'precos-tempo-real',
      'previsao-ia',
    ]
    const lavouraFeatures = [
      'diagnostico-pragas',
      'irrigacao',
      'roi',
      'resumo-semanal',
      'loja',
      'gestao',
      'gestao-financeira',
      'insumos',
      'maquinario',
    ]
    const rebanhoFeatures = [
      'calculadora-carbono',
      'whatsapp-alertas',
      'pecuaria',
      'rastreabilidade',
    ]
    const completoFeatures = [
      'gestao-insumos',
      'gestao-rh',
      'crm',
      'dashboard-consolidado',
      'faturamento',
      'meus-calculos',
      'checkout',
      'consultores',
      'analise-compartilhada',
    ]

    if (exploradorFeatures.includes(feature)) return 'Explorador'
    if (lavouraFeatures.includes(feature)) return 'Lavoura'
    if (rebanhoFeatures.includes(feature)) return 'Rebanho'
    if (completoFeatures.includes(feature)) return 'Fazendeiro Completo'
    return 'Explorador'
  }

  const normalizedPlanName = () => {
    let name =
      plan?.plan_name || user?.plan_type || user?.plan_active || user?.plano_ativo || 'Explorador'
    if (name === 'Básico' || name === 'explorador') return 'Explorador'
    if (name === 'Plantio Solo' || name === 'lavoura') return 'Lavoura'
    if (name === 'Pecuário Solo' || name === 'Pecuária Solo' || name === 'rebanho') return 'Rebanho'
    if (name === 'Completo' || name === 'fazendeiro_completo') return 'Fazendeiro Completo'
    if (name === 'Família Coop' || name === 'cooperativa') return 'Cooperativa'
    return name
  }

  return { plan, loading, hasFeature, getMinimumPlan, currentPlanName: normalizedPlanName() }
}
