import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
  SidebarInset,
} from '@/components/ui/sidebar'
import {
  Home,
  Tractor,
  Users,
  Settings,
  LogOut,
  Package,
  CreditCard,
  Search,
  Calculator,
  Satellite,
  BrainCircuit,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isPublicPage = ['/', '/login', '/cadastro', '/forgot-password'].includes(location.pathname)

  if (isPublicPage || !user) {
    return <Outlet />
  }

  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  const menuItems = [
    { title: 'Dashboard Consolidado', icon: TrendingUp, path: '/dashboard-consolidado' },
    { title: 'Dashboard', icon: Home, path: '/dashboard' },
    { title: 'Análise de Satélite', icon: Satellite, path: '/analise-satelite' },
    { title: 'Previsão IA', icon: BrainCircuit, path: '/previsao-ia' },
    { title: 'Pecuária', icon: Tractor, path: '/pecuaria' },
    { title: 'Rastreabilidade', icon: Search, path: '/rastreabilidade' },
    { title: 'Calculadora ROI', icon: Calculator, path: '/roi' },
    { title: 'Loja', icon: Package, path: '/loja' },
    { title: 'Comunidade', icon: Users, path: '/comunidade' },
    ...(isAdmin ? [{ title: 'CRM', icon: BookOpen, path: '/crm' }] : []),
    { title: 'Faturamento', icon: CreditCard, path: '/faturamento' },
    { title: 'Planos', icon: CreditCard, path: '/selecionar-plano' },
    { title: 'Configurações', icon: Settings, path: '/perfil' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const firstName = (user?.name || user?.nome || 'Usuário').split(' ')[0]
  const plan = user?.plan_active || user?.plano_ativo || 'Básico'
  const initial = firstName[0].toUpperCase()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white">
        <Sidebar className="border-r border-primary/20 bg-zinc-950">
          <SidebarHeader className="p-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Logo />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-zinc-500">Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-zinc-900 hover:text-primary transition-colors"
                      >
                        {/* Adicionado o state={{ fromMenu: true }} para que a página saiba se o acesso foi intencional pelo menu */}
                        <Link
                          to={item.path}
                          state={{ fromMenu: true }}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-4 mt-auto border-t border-primary/20">
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 bg-black overflow-x-hidden min-w-0">
          <header className="flex h-16 items-center gap-4 border-b border-primary/20 px-6 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-40">
            <SidebarTrigger className="text-zinc-400 hover:text-primary" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-white">{firstName}</p>
                <p className="text-xs text-zinc-500 capitalize">{plan}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0a2e16] border border-[#1b5e20] flex items-center justify-center text-primary font-bold">
                {initial}
              </div>
            </div>
          </header>
          <main className="p-6 max-w-full">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
