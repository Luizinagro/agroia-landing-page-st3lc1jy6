import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="fixed top-0 z-[100] w-full bg-[#0A0E27] border-b border-[#00FF41]/10 transition-all duration-300 ease-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90 group">
              <span className="text-2xl font-black tracking-tight text-[#00FF41] drop-shadow-[0_0_15px_rgba(0,255,65,0.5)] group-hover:scale-105 transition-transform duration-300 ease-out">
                AgroIA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-bold text-[#9CA3AF] hover:text-[#00FF41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all duration-300 ease-out"
            >
              Funcionalidades
            </a>
            <a
              href="#planos"
              className="text-sm font-bold text-[#9CA3AF] hover:text-[#00FF41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all duration-300 ease-out"
            >
              Planos
            </a>
            <Link
              to="/login"
              className="text-sm font-bold text-[#9CA3AF] hover:text-[#00FF41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all duration-300 ease-out"
            >
              Login
            </Link>
            <Link to="/cadastro" className="btn-agro-primary">
              Começar Agora
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-[#9CA3AF] hover:text-[#00FF41] hover:bg-transparent"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0E27] shadow-lg animate-in slide-in-from-top-2 border-b border-[#00FF41]/10">
          <div className="flex flex-col space-y-2 px-4 pb-6 pt-4">
            <a
              href="#features"
              className="px-4 py-3 text-base font-bold text-[#9CA3AF] hover:bg-[#1A1F3A] hover:text-[#00FF41] rounded-lg transition-all duration-300 ease-out"
              onClick={toggleMenu}
            >
              Funcionalidades
            </a>
            <a
              href="#planos"
              className="px-4 py-3 text-base font-bold text-[#9CA3AF] hover:bg-[#1A1F3A] hover:text-[#00FF41] rounded-lg transition-all duration-300 ease-out"
              onClick={toggleMenu}
            >
              Planos
            </a>
            <Link
              to="/login"
              className="px-4 py-3 text-base font-bold text-[#9CA3AF] hover:bg-[#1A1F3A] hover:text-[#00FF41] rounded-lg transition-all duration-300 ease-out"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <div className="px-4 pt-4 pb-2">
              <Link to="/cadastro" className="btn-agro-primary w-full text-center block text-lg">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
