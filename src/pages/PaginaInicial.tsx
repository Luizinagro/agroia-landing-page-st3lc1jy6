import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { Logo } from '@/components/ui/logo'
import { NeonLink } from '@/components/ui/neon-button'

const PaginaInicial = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col font-sans selection:bg-agro-green/30">
      <SEO
        title="AgroIA | O Futuro do Campo"
        description="Transforme sua Safra com IA Hiperlocal. Previsão 92% precisa e rastreabilidade."
      />

      {/* iOS Premium Header */}
      <header className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container max-w-7xl mx-auto flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl">
                <Logo className="w-6 h-6 text-black transition-transform duration-300 ease-out" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">AgroIA</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#planos"
              className="hidden md:block text-sm font-bold text-[#A0A0A0] hover:text-white transition-colors"
            >
              Planos
            </a>
            <NeonLink
              to={user ? '/dashboard' : '/login'}
              variant="solid"
              className="bg-white text-black hover:bg-zinc-200 px-6 py-2.5 text-sm font-black transition-colors duration-300"
            >
              {user ? 'Dashboard' : 'Entrar'}
            </NeonLink>
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

export default PaginaInicial
