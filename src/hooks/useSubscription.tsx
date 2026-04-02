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
        console.log('[useSubscription] Buscando permissões para o user_id logado:', cleanUserId)

        const { data, error } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', cleanUserId)
          .maybeSingle()

        if (error) {
          console.error('[useSubscription] Erro na consulta do Supabase:', error)
        }

        console.log('[useSubscription] Dados encontrados na tabela user_plans:', data)
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
    // Use plan from DB, or fallback to user context metadata
    const userPlanName = user?.plan_active || user?.plano_ativo || 'Básico'
    const planObj = plan || { plan_name: userPlanName, plan_features: [] }

    const features =
      typeof planObj.plan_features === 'string'
        ? JSON.parse(planObj.plan_features)
        : planObj.plan_features

    // Check JSON features if exists and is array
    if (features && Array.isArray(features)) {
      if (features.includes(feature)) return true
    }

    // Fallback based on plan name
    const planName = planObj.plan_name || 'Básico'
    if (planName === 'Completo' || planName === 'Família Coop') return true

    if (
      planName === 'Plantio Solo' &&
      (feature === 'roi' || feature === 'loja' || feature === 'dashboard')
    )
      return true
    if (
      planName === 'Pecuário Solo' &&
      (feature === 'rastreabilidade' ||
        feature === 'loja' ||
        feature === 'dashboard' ||
        feature === 'pecuaria')
    )
      return true
    if (planName === 'Básico' && feature === 'dashboard') return true

    return false
  }

  return { plan, loading, hasFeature }
}
