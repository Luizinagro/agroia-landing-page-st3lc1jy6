import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, Menu, Search, UserCircle, Handshake } from 'lucide-react'
import { Logo, LogoText } from '@/components/ui/logo'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function Header() {
  const location = useLocation()
  const isApp = !['/', '/login', '/cadastro', '/sicredi'].includes(location.pathname)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isApp) {
    return (
      <header
        className={cn(
          'sticky top-0 w-full z-[1000] transition-all duration-300 flex items-center',
          scrolled
            ? 'h-[56px] md:h-[64px] bg-[#0A0F0D] shadow-[0_2px_20px_rgba(0,200,83,0.1)]'
            : 'h-[56px] md:h-[64px] bg-transparent',
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            <span className="text-2xl font-black text-white tracking-tighter">
              AGRO<span className="text-[#00C853]">IA</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#solucoes"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Soluções
            </a>
            <a
              href="#planos"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <Link
              to="/sicredi"
              className="text-sm font-medium text-[#00C853] hover:text-[#009959] transition-colors flex items-center gap-1.5 bg-[#00C853]/10 px-4 py-2 rounded-full"
            >
              Parceria Sicredi <Handshake className="w-4 h-4" />
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="outline"
                className="border border-white text-white hover:bg-white hover:text-black font-medium px-[20px] py-[8px] h-auto rounded-[8px] bg-transparent transition-colors"
              >
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="bg-[#00C853] text-black hover:bg-[#00E676] font-bold px-[20px] py-[8px] h-auto rounded-[8px] transition-colors">
                Cadastrar-se
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-[#0A0F0D] border-l border-[#00C853]/20 p-0 w-[280px] z-[1001] text-white"
              >
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <div className="p-4 border-b border-[#00C853]/10">
                  <span className="text-xl font-black text-white tracking-tighter">
                    AGRO<span className="text-[#00C853]">IA</span>
                  </span>
                </div>
                <div className="p-4 flex flex-col h-[calc(100vh-65px)] justify-between">
                  <nav className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <a
                        href="#solucoes"
                        className="text-base font-medium text-white hover:text-[#00C853] transition-colors py-3 border-b border-white/5"
                      >
                        Soluções
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="#planos"
                        className="text-base font-medium text-white hover:text-[#00C853] transition-colors py-3 border-b border-white/5"
                      >
                        Planos
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="#faq"
                        className="text-base font-medium text-white hover:text-[#00C853] transition-colors py-3 border-b border-white/5"
                      >
                        FAQ
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/sicredi"
                        className="text-base font-medium text-[#00C853] hover:text-[#009959] transition-colors py-3 border-b border-white/5 flex items-center gap-2"
                      >
                        Parceria Sicredi <Handshake className="w-4 h-4" />
                      </Link>
                    </SheetClose>
                  </nav>

                  <div className="flex flex-col gap-3 pb-6">
                    <SheetClose asChild>
                      <Link to="/login" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border border-white text-white hover:bg-white hover:text-black font-medium px-[20px] py-[8px] h-auto rounded-[8px] bg-transparent transition-colors"
                        >
                          Entrar
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/cadastro" className="w-full">
                        <Button className="w-full bg-[#00C853] text-black hover:bg-[#00E676] font-bold px-[20px] py-[8px] h-auto rounded-[8px] transition-colors">
                          Cadastrar-se
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="h-16 border-b border-primary/20 bg-black/40 backdrop-blur flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black border-r border-primary/20 p-0">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <div className="p-6 flex items-center gap-2 border-b border-primary/10">
              <Logo />
            </div>
            <nav className="p-4 space-y-2">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/pecuaria"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              >
                Pecuária
              </Link>
              <Link
                to="/crm"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              >
                CRM
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar informações..."
            className="w-full bg-black/40 border border-primary/20 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        <Link to="/selecionar-plano" className="hidden md:block">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/50 text-primary hover:bg-primary/10 h-8 text-xs font-semibold"
          >
            Planos
          </Button>
        </Link>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 cursor-pointer hover:bg-primary/30 transition-colors">
          <UserCircle className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  )
}
