import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { SplineSceneBasic } from '@/components/sections/spline-scene-basic'

export default function PaginaInicial() {
  const { user, loading: authLoading } = useAuth() as any
  const { plan, loading: planLoading } = useSubscription()

  const userPlanName = plan?.plan_name || user?.plan_active || user?.plano_ativo || 'Básico'
  const showPricing = !authLoading && (!user || (!planLoading && userPlanName === 'Básico'))

  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main className="flex flex-col w-full bg-black">
        <Hero />
        <section className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              AgroIA Inovação
            </h2>
            <p className="text-xl md:text-2xl text-green-400">
              O Futuro do Campo em Análise de Dados
            </p>
          </div>
          <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-green-500/10">
            <SplineSceneBasic />
          </div>
        </section>
        {showPricing && <Pricing />}
      </main>
      <Footer />
    </div>
  )
}
