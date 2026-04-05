import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'

export default function PaginaInicial() {
  const { user, loading: authLoading } = useAuth() as any
  const { plan, loading: planLoading } = useSubscription()

  const userPlanName = plan?.plan_name || user?.plan_active || user?.plano_ativo || 'Básico'
  const showPricing = !authLoading && (!user || (!planLoading && userPlanName === 'Básico'))

  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main>
        <Hero />
        {showPricing && <Pricing />}
      </main>
      <Footer />
    </div>
  )
}
