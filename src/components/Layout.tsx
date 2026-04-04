import { Outlet, Link, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Logo, LogoText } from '@/components/ui/logo'
import { Toaster } from '@/components/ui/toaster'
import { LayoutDashboard, User, Tractor, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  const location = useLocation()
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname)

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-black text-foreground flex flex-col font-sans">
        <main className="flex-1">
          <Outlet />
        </main>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/20 bg-black/50 hidden md:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-2 border-b border-primary/10">
          <Logo />
          <LogoText className="text-xl" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              location.pathname.includes('dashboard')
                ? 'bg-primary/20 text-primary font-medium'
                : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            to="/pecuaria"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              location.pathname.includes('pecuaria')
                ? 'bg-primary/20 text-primary font-medium'
                : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground',
            )}
          >
            <Tractor className="w-5 h-5" /> Pecuária
          </Link>
          <Link
            to="/crm"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              location.pathname.includes('crm')
                ? 'bg-primary/20 text-primary font-medium'
                : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground',
            )}
          >
            <User className="w-5 h-5" /> CRM
          </Link>
        </nav>
        <div className="p-4 border-t border-primary/10">
          <Link
            to="/configuracoes"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" /> Configurações
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-black via-black to-primary/5">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}
