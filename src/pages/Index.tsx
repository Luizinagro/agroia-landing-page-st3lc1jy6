import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Tractor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'

const Index = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <SEO
        title="Início"
        description="Transforme sua Safra com IA Hiperlocal. Previsão 92% precisa e rastreabilidade ESG."
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80 border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Tractor className="w-8 h-8 text-secondary" aria-hidden="true" />
            <span className="font-serif text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary">
              AgroIA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-secondary text-primary hover:bg-secondary/90 hover:scale-105 transition-transform font-bold h-10 px-6"
              aria-label={user ? 'Acessar Área do Produtor' : 'Acessar Sistema de Login'}
            >
              <Link to={user ? '/dashboard' : '/login'}>{user ? 'Área do Produtor' : 'LOGIN'}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <div id="planos">
          <Pricing />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Index
