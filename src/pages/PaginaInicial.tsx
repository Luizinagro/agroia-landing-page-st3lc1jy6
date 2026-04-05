import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
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

        {/* 3D Robot Section */}
        <section className="container mx-auto px-4 py-8 md:py-16 relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-green-500/10 bg-zinc-950/80">
            {/* Holographic AGROIA Text Overlay on the Robot */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="text-[12vw] md:text-[10rem] font-black tracking-tighter text-white/5 mix-blend-overlay select-none drop-shadow-2xl">
                AGROIA
              </span>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-20">
              <div className="bg-black/60 backdrop-blur-md border border-green-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <span className="text-sm md:text-lg font-black tracking-widest text-green-400">
                  NÚCLEO DE IA
                </span>
              </div>
            </div>

            <SplineSceneBasic />
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        {showPricing && <Pricing />}
      </main>
      <Footer />
    </div>
  )
}
