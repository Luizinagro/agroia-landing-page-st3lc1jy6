import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { SplineSceneBasic } from '@/components/sections/spline-scene-basic'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'

export default function PaginaInicial() {
  const { user, loading: authLoading } = useAuth() as any
  const { plan, loading: planLoading } = useSubscription()

  const userPlanName = plan?.plan_name || user?.plan_active || user?.plano_ativo || 'Básico'
  const showPricing = !authLoading && (!user || (!planLoading && userPlanName === 'Básico'))

  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main>
        <ScrollExpandMedia
          mediaType="video"
          // Vídeo de agricultura de alta qualidade para a expansão imersiva
          mediaSrc="https://www.youtube.com/watch?v=o0vE9Q20aU4"
          // Imagem de fundo focada no agronegócio
          bgImageSrc="https://images.unsplash.com/photo-1592982537447-6f2a6a0a5913?q=80&w=1920&auto=format&fit=crop"
          title="AgroIA Inovação"
          date="O Futuro do Campo"
          scrollToExpand="Role para explorar a tecnologia"
          textBlend={false}
        >
          <div className="w-full bg-black/95">
            <Hero />
            <section className="container mx-auto px-4 py-16 md:py-24 relative z-10">
              <SplineSceneBasic />
            </section>
            {showPricing && <Pricing />}
          </div>
        </ScrollExpandMedia>
      </main>
      <Footer />
    </div>
  )
}
