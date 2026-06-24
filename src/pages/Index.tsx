import { useEffect, useState } from 'react'
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
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A1A0A]/95 backdrop-blur-md shadow-lg py-4 border-b border-[#1E3A1E]'
          : 'bg-transparent py-6',
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tight">
          <span className="text-white">AGRO</span>
          <span className="text-[#6DBF4A]">IA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#planos"
            className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Planos
          </a>
          <Link
            to="/login"
            className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Entrar
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="md:hidden text-sm font-semibold text-white">
            Entrar
          </Link>
          <Button
            asChild
            className="bg-[#4A8A1A] hover:bg-[#3A6B14] text-white font-bold rounded-full px-6 shadow-md transition-colors border-0"
          >
            <Link to="/cadastro">Cadastrar Agora</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0F0D] text-white selection:bg-[#6DBF4A]/30 flex flex-col font-sans overflow-x-hidden relative">
      <SEO
        title="AgroIA — Inteligência Artificial para o Agronegócio Brasileiro"
        description="Diagnóstico de pragas em 30 segundos, irrigação inteligente, preços em tempo real e muito mais. Teste grátis por 7 dias, sem cartão."
      />
      <HomeNavbar />
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
