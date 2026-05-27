import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
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
  Share2,
  Lock,
  Bug,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { user, logout } = useAuth() as any
  const location = useLocation()
  const navigate = useNavigate()
  const { hasFeature, loading: planLoading } = useSubscription()

  const isPublicPage = ['/', '/login', '/cadastro', '/forgot-password'].includes(location.pathname)

  if (isPublicPage || !user) {
    return <Outlet />
  }

  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  const menuGroups = [
    {
      label: 'Visão Geral',
      items: [
        { title: 'Dashboard', icon: Home, path: '/dashboard', feature: 'dashboard' },
        {
          title: 'Dashboard Consolidado',
          icon: TrendingUp,
          path: '/dashboard-consolidado',
          feature: 'dashboard',
        },
      ],
    },
    {
      label: 'Inteligência e Análises',
      items: [
        {
          title: 'Análise de Satélite',
          icon: Satellite,
          path: '/analise-satelite',
          feature: 'analise-satelite',
        },
        {
          title: 'Consultor IA Agro',
          icon: BrainCircuit,
          path: '/consultor-ia-agro',
          feature: 'consultor-ia-agro',
        },
        { title: 'Previsão IA', icon: BrainCircuit, path: '/previsao-ia', feature: 'previsao-ia' },
        {
          title: 'Diagnóstico de Pragas',
          icon: Bug,
          path: '/diagnostico-pragas',
          feature: 'diagnostico-pragas',
        },
        {
          title: 'Calendário Agrícola',
          icon: Calendar,
          path: '/calendario-agricola',
          feature: null,
        },
        { title: 'Calculadora ROI', icon: Calculator, path: '/roi', feature: 'roi' },
      ],
    },
    {
      label: 'Gestão e Operação',
      items: [
        { title: 'Pecuária', icon: Tractor, path: '/pecuaria', feature: 'pecuaria' },
        {
          title: 'Rastreabilidade',
          icon: Search,
          path: '/rastreabilidade',
          feature: 'rastreabilidade',
        },
        {
          title: 'Análises Compartilhadas',
          icon: Share2,
          path: '/analises-compartilhadas',
          feature: 'analise-compartilhada',
        },
        ...(isAdmin ? [{ title: 'CRM', icon: BookOpen, path: '/crm', feature: 'crm' }] : []),
        { title: 'Faturamento', icon: CreditCard, path: '/faturamento', feature: 'faturamento' },
      ],
    },
    {
      label: 'Ecossistema',
      items: [
        { title: 'Loja', icon: Package, path: '/loja', feature: 'loja' },
        { title: 'Comunidade', icon: Users, path: '/comunidade', feature: 'comunidade' },
      ],
    },
    {
      label: 'Minha Conta',
      items: [
        { title: 'Planos', icon: CreditCard, path: '/selecionar-plano', feature: null },
        { title: 'Configurações', icon: Settings, path: '/perfil', feature: null },
      ],
    },
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
              <span className="text-2xl font-bold tracking-tight text-white">
                AGRO<span className="text-primary">IA</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {menuGroups.map((group, idx) => (
              <SidebarGroup key={idx}>
                <SidebarGroupLabel className="text-zinc-500 font-semibold uppercase tracking-wider text-xs px-4 mt-4 mb-2">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1 px-2">
                    {group.items.map((item) => {
                      const hasAccess = item.feature ? hasFeature(item.feature) : true
                      const isActive = location.pathname === item.path

                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={`flex items-center justify-between rounded-md px-3 py-2 transition-all ${
                              isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                            }`}
                          >
                            <Link
                              to={item.path}
                              state={{ fromMenu: true }}
                              className="flex items-center gap-3 w-full"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <item.icon
                                  className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-zinc-400'}`}
                                />
                                <span>{item.title}</span>
                              </div>
                              {!planLoading && !hasAccess && (
                                <Lock className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <div className="p-4 mt-auto border-t border-primary/20 bg-zinc-950">
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 bg-zinc-950 overflow-x-hidden min-w-0">
          <header className="flex h-16 items-center gap-4 border-b border-primary/20 px-6 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="text-zinc-400 hover:text-primary transition-colors" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-white">{firstName}</p>
                <p className="text-xs text-zinc-400 capitalize">{plan}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0a2e16] border border-[#1b5e20] flex items-center justify-center text-primary font-bold shadow-sm">
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
