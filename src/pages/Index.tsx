import { Hero } from '@/components/sections/hero'
import { SocialProof } from '@/components/sections/social-proof'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Results } from '@/components/sections/results'
import { Modules } from '@/components/sections/modules'
import { Comparison } from '@/components/sections/comparison'
import { Testimonials } from '@/components/sections/testimonials'
import { Pricing } from '@/components/sections/pricing'
import { FAQ } from '@/components/sections/faq'
import { CTA } from '@/components/sections/cta'
import { Footer } from '@/components/sections/footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { SEO } from '@/components/SEO'

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0F0D] text-white selection:bg-[#6DBF4A]/30 flex flex-col font-sans overflow-x-hidden">
      <SEO
        title="AgroIA — Inteligência Artificial para o Agronegócio Brasileiro"
        description="Diagnóstico de pragas em 30 segundos, irrigação inteligente, preços em tempo real e muito mais. Teste grátis por 7 dias, sem cartão."
      />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Results />
        <Modules />
        <Testimonials />
        <Comparison />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}

export default Index
