import { Hero } from '@/components/sections/hero'
import { Modules } from '@/components/sections/modules'
import { Pricing } from '@/components/sections/pricing'
import { Testimonials } from '@/components/sections/testimonials'
import { LiveEvent } from '@/components/sections/live-event'
import { Footer } from '@/components/sections/footer'
import { Tractor, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
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
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Tractor className="w-6 h-6 text-secondary" aria-hidden="true" />
            <span>AgroIA</span>
          </div>

          <nav
            className="hidden md:flex gap-6 text-sm text-white/80 font-medium"
            aria-label="Navegação principal"
          >
            <a
              href="#modulos"
              className="hover:text-secondary transition-colors focus-visible:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
            >
              Módulos
            </a>
            <a
              href="#planos"
              className="hover:text-secondary transition-colors focus-visible:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
            >
              Planos
            </a>
            <a
              href="#depoimentos"
              className="hover:text-secondary transition-colors focus-visible:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
            >
              Depoimentos
            </a>
            <Link
              to="/pecuaria"
              className="hover:text-secondary transition-colors focus-visible:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
            >
              Pecuária
            </Link>
            <Link
              to="/comunidade"
              className="hover:text-secondary transition-colors focus-visible:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
            >
              Comunidade
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              className="bg-secondary text-primary hover:bg-secondary/90 hover:scale-105 transition-transform font-semibold h-9 px-4"
              aria-label={user ? 'Acessar Área do Produtor' : 'Acessar Sistema de Login'}
            >
              <Link to={user ? '/dashboard' : '/login'}>
                {user ? 'Área do Produtor' : 'Acessar Sistema'}
              </Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary text-white border-l-white/10">
                <SheetTitle className="text-white flex items-center gap-2 mb-6">
                  <Tractor className="w-5 h-5 text-secondary" />
                  Menu AgroIA
                </SheetTitle>
                <nav
                  className="flex flex-col gap-4 text-base font-medium"
                  aria-label="Navegação móvel"
                >
                  <a
                    href="#modulos"
                    className="hover:text-secondary transition-colors p-2 rounded-md hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    Módulos
                  </a>
                  <a
                    href="#planos"
                    className="hover:text-secondary transition-colors p-2 rounded-md hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    Planos
                  </a>
                  <a
                    href="#depoimentos"
                    className="hover:text-secondary transition-colors p-2 rounded-md hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    Depoimentos
                  </a>
                  <Link
                    to="/pecuaria"
                    className="hover:text-secondary transition-colors p-2 rounded-md hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    Pecuária
                  </Link>
                  <Link
                    to="/comunidade"
                    className="hover:text-secondary transition-colors p-2 rounded-md hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    Comunidade
                  </Link>
                  <div className="pt-4 border-t border-white/10 mt-2">
                    <Button
                      asChild
                      className="w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold hover:scale-105 transition-transform"
                      aria-label={user ? 'Acessar Área do Produtor' : 'Acessar Sistema'}
                    >
                      <Link to={user ? '/dashboard' : '/login'}>
                        {user ? 'Área do Produtor' : 'Acessar Sistema'}
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
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
