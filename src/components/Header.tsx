import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-[100] w-full transition-all duration-300 border-b',
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-zinc-800'
          : 'bg-transparent border-transparent',
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <Logo className="w-8 h-8 text-primary" />
            <span className="text-xl font-black tracking-tight text-white">AgroIA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#planos"
              className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Planos
            </a>
            <Link
              to="/login"
              className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6"
            >
              <Link to="/cadastro">Começar Agora</Link>
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:bg-white/10"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black border-b border-zinc-800 p-4 flex flex-col gap-4 animate-fade-in-down">
          <a
            href="#features"
            className="text-white font-bold px-4 py-2 hover:bg-zinc-900 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Funcionalidades
          </a>
          <a
            href="#planos"
            className="text-white font-bold px-4 py-2 hover:bg-zinc-900 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Planos
          </a>
          <Link
            to="/login"
            className="text-white font-bold px-4 py-2 hover:bg-zinc-900 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-full"
          >
            <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>
              Começar Agora
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}
