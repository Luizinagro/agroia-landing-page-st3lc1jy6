import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, Menu, Search, UserCircle, Handshake, LayoutDashboard } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const location = useLocation()
  const isApp = !['/', '/login', '/cadastro', '/sicredi'].includes(location.pathname)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth() || { user: null }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isApp) {
    return (
      <header
        className={cn(
          'fixed top-0 w-full z-[1000] transition-all duration-300',
          scrolled
            ? 'bg-[#0D1F0D] border-b border-[#1E3A1E] shadow-sm'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between md:grid md:grid-cols-3">
          {/* Desktop Left Nav */}
          <nav className="hidden md:flex items-center gap-8 justify-start">
            <a
              href="#planos"
              className="text-sm font-medium text-[#F5F0E8] hover:text-[#A8B8A0] transition-colors"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-[#F5F0E8] hover:text-[#A8B8A0] transition-colors"
            >
              FAQ
            </a>
            <Link
              to="/sicredi"
              className="text-sm font-medium text-[#4A8A1A] hover:text-[#3A6B14] transition-colors flex items-center gap-1.5"
            >
              Parceria Sicredi <Handshake className="w-4 h-4" />
            </Link>
          </nav>

          {/* Center Logo */}
          <div className="flex items-center md:justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 transition-transform hover:scale-105"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            >
              <span className="text-2xl font-black text-[#F5F0E8] tracking-tighter">
                AGRO<span className="text-[#4A8A1A]">IA</span>
              </span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3 justify-end">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-[#4A8A1A] text-white hover:bg-[#3A6B14] font-medium px-[20px] py-[8px] h-auto rounded-[8px] transition-colors gap-2 border-0">
                  <LayoutDashboard className="w-4 h-4" />
                  Ir para o App
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-[#A8B8A0] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#0D1F0D] font-medium px-[20px] py-[8px] h-auto rounded-[8px] bg-transparent transition-colors"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="bg-[#4A8A1A] text-white hover:bg-[#3A6B14] font-medium px-[20px] py-[8px] h-auto rounded-[8px] transition-colors border-0">
                    Cadastrar-se
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#F5F0E8] hover:bg-white/5">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-[#0D1F0D] border-l border-[#1E3A1E] p-0 w-[280px] z-[1001] text-[#F5F0E8]"
              >
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <div className="p-4 border-b border-[#1E3A1E]">
                  <span className="text-xl font-black text-[#F5F0E8] tracking-tighter">
                    AGRO<span className="text-[#4A8A1A]">IA</span>
                  </span>
                </div>
                <div className="p-4 flex flex-col h-[calc(100vh-65px)] justify-between">
                  <nav className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <a
                        href="#planos"
                        className="text-base font-medium text-[#F5F0E8] hover:text-[#A8B8A0] transition-colors py-3 border-b border-[#1E3A1E]"
                      >
                        Planos
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="#faq"
                        className="text-base font-medium text-[#F5F0E8] hover:text-[#A8B8A0] transition-colors py-3 border-b border-[#1E3A1E]"
                      >
                        FAQ
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/sicredi"
                        className="text-base font-medium text-[#4A8A1A] hover:text-[#3A6B14] transition-colors py-3 border-b border-[#1E3A1E] flex items-center gap-2"
                      >
                        Parceria Sicredi <Handshake className="w-4 h-4" />
                      </Link>
                    </SheetClose>
                  </nav>

                  <div className="flex flex-col gap-3 pb-6">
                    {user ? (
                      <SheetClose asChild>
                        <Link to="/dashboard" className="w-full">
                          <Button className="w-full bg-[#4A8A1A] text-white hover:bg-[#3A6B14] font-medium px-[20px] py-[8px] h-auto rounded-[8px] transition-colors gap-2 border-0">
                            <LayoutDashboard className="w-4 h-4" />
                            Ir para o App
                          </Button>
                        </Link>
                      </SheetClose>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link to="/login" className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-[#A8B8A0] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#0D1F0D] font-medium px-[20px] py-[8px] h-auto rounded-[8px] bg-transparent transition-colors"
                            >
                              Entrar
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/cadastro" className="w-full">
                            <Button className="w-full bg-[#4A8A1A] text-white hover:bg-[#3A6B14] font-medium px-[20px] py-[8px] h-auto rounded-[8px] transition-colors border-0">
                              Cadastrar-se
                            </Button>
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )
  }

  // App Header (Logged in context)
  return (
    <header className="h-16 border-b border-[#1E3A1E] bg-[#0D1F0D] flex items-center justify-between px-4 md:px-6 shrink-0 z-[50]">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#F5F0E8] hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0D1F0D] border-r border-[#1E3A1E] p-0 z-[1001]">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <div className="p-6 flex items-center gap-2 border-b border-[#1E3A1E]">
              <span className="text-xl font-black text-[#F5F0E8] tracking-tighter">
                AGRO<span className="text-[#4A8A1A]">IA</span>
              </span>
            </div>
            <nav className="p-4 space-y-2">
              <SheetClose asChild>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-white/5 text-[#A8B8A0] hover:text-[#F5F0E8] transition-colors"
                >
                  Dashboard
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/pecuaria"
                  className="block px-3 py-2 rounded-md hover:bg-white/5 text-[#A8B8A0] hover:text-[#F5F0E8] transition-colors"
                >
                  Pecuária
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/crm"
                  className="block px-3 py-2 rounded-md hover:bg-white/5 text-[#A8B8A0] hover:text-[#F5F0E8] transition-colors"
                >
                  CRM
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-[#F5F0E8] tracking-tighter">
            AGRO<span className="text-[#4A8A1A]">IA</span>
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A8B8A0]" />
          <input
            type="text"
            placeholder="Buscar informações..."
            className="w-full bg-[#1E3A1E]/30 border border-[#1E3A1E] rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#4A8A1A] focus:bg-[#1E3A1E]/50 transition-all text-[#F5F0E8] placeholder:text-[#A8B8A0]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[#A8B8A0] hover:bg-white/5 hover:text-[#F5F0E8]"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4A8A1A] rounded-full"></span>
        </Button>
        <Link to="/selecionar-plano" className="hidden md:block">
          <Button
            variant="outline"
            size="sm"
            className="border-[#4A8A1A]/50 text-[#4A8A1A] hover:bg-[#4A8A1A]/10 h-8 text-xs font-semibold bg-transparent"
          >
            Planos
          </Button>
        </Link>
        <Link to="/perfil">
          <div className="w-8 h-8 rounded-full bg-[#4A8A1A]/20 flex items-center justify-center border border-[#4A8A1A]/50 cursor-pointer hover:bg-[#4A8A1A]/30 transition-colors">
            <UserCircle className="w-5 h-5 text-[#4A8A1A]" />
          </div>
        </Link>
      </div>
    </header>
  )
}
