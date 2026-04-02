import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { Logo } from '@/components/ui/logo'

const Index = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col font-sans selection:bg-agro-green/30">
      <SEO
        title="AgroIA | O Futuro do Campo"
        description="Transforme sua Safra com IA Hiperlocal. Previsão 92% precisa e rastreabilidade."
      />

      {/* Futuristic Header */}
      <header className="navbar-glass">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Link to="/">
              <Logo className="w-10 h-10 text-agro-green drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-400 ease-bounce" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#planos"
              className="hidden md:block text-sm font-bold text-white/80 hover:text-[#00FF41] transition-colors"
            >
              Planos
            </a>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="btn-agro-primary px-8 py-2.5 text-sm md:text-base tracking-wide"
            >
              {user ? 'ÁREA DO PRODUTOR' : 'LOGIN'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
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
