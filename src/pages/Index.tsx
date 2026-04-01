import { Hero } from '@/components/sections/hero'
import { Modules } from '@/components/sections/modules'
import { Pricing } from '@/components/sections/pricing'
import { Testimonials } from '@/components/sections/testimonials'
import { LiveEvent } from '@/components/sections/live-event'
import { Footer } from '@/components/sections/footer'
import { Tractor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const Index = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80 border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Tractor className="w-6 h-6 text-secondary" />
            <span>AgroIA</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-white/80 font-medium">
            <a href="#modulos" className="hover:text-secondary transition-colors">
              Módulos
            </a>
            <a href="#planos" className="hover:text-secondary transition-colors">
              Planos
            </a>
            <a href="#depoimentos" className="hover:text-secondary transition-colors">
              Depoimentos
            </a>
            <Link to="/pecuaria" className="hover:text-secondary transition-colors">
              Pecuária
            </Link>
            <Link to="/comunidade" className="hover:text-secondary transition-colors">
              Comunidade
            </Link>
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            <Button
              asChild
              className="bg-secondary text-primary hover:bg-secondary/90 font-semibold h-9 px-4"
            >
              <Link to={user ? '/dashboard' : '/login'}>
                {user ? 'Área do Produtor' : 'Acessar Sistema'}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <div id="modulos">
          <Modules />
        </div>
        <div id="planos">
          <Pricing />
        </div>
        <div id="depoimentos">
          <Testimonials />
        </div>
        <LiveEvent />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Index
