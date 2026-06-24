import { useState } from 'react'
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
  LayoutDashboard,
  BarChart2,
  Settings,
  LogOut,
  ShoppingBag,
  CreditCard,
  Search,
  Calculator,
  Globe,
  MessageCircle,
  TrendingUp,
  Share2,
  Lock,
  Scan,
  Calendar,
  Leaf,
  Droplet,
  Briefcase,
  Handshake,
  Users,
  Truck,
  Layers,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Layout() {
  const { user, logout } = useAuth() as any
  const location = useLocation()
  const navigate = useNavigate()
  const { hasFeature, loading: planLoading, getMinimumPlan, currentPlanName } = useSubscription()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [lockedItem, setLockedItem] = useState<any>(null)

  const isPublicPage = ['/', '/login', '/cadastro', '/forgot-password'].includes(location.pathname)

  if (isPublicPage || !user) {
    return <Outlet />
  }

  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  const handleLockedClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    setLockedItem(item)
    setUpgradeModalOpen(true)
  }

  const menuGroups = [
    {
      label: 'Visão Geral',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', feature: 'dashboard' },
        {
          title: 'Dashboard Consolidado',
          icon: BarChart2,
          path: '/dashboard-consolidado',
          feature: 'dashboard-consolidado',
        },
      ],
    },
    {
      label: 'Inteligência e Análises',
      items: [
        {
          title: 'Análise de Satélite',
          icon: Globe,
          path: '/analise-satelite',
          feature: 'analise-satelite',
        },
        {
          title: 'Consultor IA Agro',
          icon: MessageCircle,
          path: '/consultor-ia-agro',
          feature: 'consultor-ia-agro',
        },
        { title: 'Previsão IA', icon: TrendingUp, path: '/previsao-ia', feature: 'previsao-ia' },
        {
          title: 'Diagnóstico de Pragas',
          icon: Scan,
          path: '/diagnostico-pragas',
          feature: 'diagnostico-pragas',
        },
        {
          title: 'Calendário Agrícola',
          icon: Calendar,
          path: '/calendario-agricola',
          feature: 'calendario-agricola',
        },
        {
          title: 'Calculadora Carbono',
          icon: Leaf,
          path: '/calculadora-carbono',
          feature: 'calculadora-carbono',
        },
        { title: 'Calculadora ROI', icon: Calculator, path: '/roi', feature: 'roi' },
      ],
    },
    {
      label: 'Financeiro',
      items: [
        {
          title: 'Gestão Financeira',
          icon: CreditCard,
          path: '/financeiro',
          feature: 'gestao-financeira',
        },
      ],
    },
    {
      label: 'Gestão e Operação',
      items: [
        { title: 'Pecuária', icon: Truck, path: '/pecuaria', feature: 'pecuaria' },
        { title: 'Reprodução', icon: Heart, path: '/reproducao', feature: 'pecuaria' },
        { title: 'Irrigação Inteligente', icon: Droplet, path: '/irrigacao', feature: 'irrigacao' },
        { title: 'Insumos e Estoque', icon: Leaf, path: '/insumos', feature: 'gestao-insumos' },
        { title: 'RH Rural', icon: Briefcase, path: '/rh', feature: 'gestao-rh' },
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
        ...(isAdmin ? [{ title: 'CRM', icon: Briefcase, path: '/crm', feature: 'crm' }] : []),
        { title: 'Maquinário', icon: Truck, path: '/maquinario', feature: 'maquinario' },
        { title: 'Faturamento', icon: CreditCard, path: '/faturamento', feature: 'faturamento' },
      ],
    },
    {
      label: 'Ecossistema',
      items: [
        { title: 'Loja', icon: ShoppingBag, path: '/loja', feature: 'loja' },
        { title: 'Comunidade', icon: Users, path: '/comunidade', feature: 'comunidade' },
        { title: 'Parceria Sicredi', icon: Handshake, path: '/sicredi', feature: null },
      ],
    },
    {
      label: 'Minha Conta',
      items: [
        { title: 'Planos', icon: Layers, path: '/selecionar-plano', feature: null },
        { title: 'Configurações', icon: Settings, path: '/perfil', feature: null },
      ],
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const firstName = (user?.name || user?.nome || 'Usuário').split(' ')[0]
  const initial = firstName[0].toUpperCase()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#070F07] text-[#F5F0E8]">
        <Sidebar className="border-r border-[#1E3A1E] bg-[#0A1A0A]">
          <SidebarHeader className="p-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#F5F0E8]">
                AGRO<span className="text-[#6DBF4A]">IA</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {menuGroups.map((group, idx) => (
              <SidebarGroup key={idx}>
                <SidebarGroupLabel className="text-[#A8B8A0] font-semibold uppercase tracking-wider text-xs px-4 mt-4 mb-2">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1 px-2">
                    {group.items.map((item) => {
                      const hasAccess = item.feature ? hasFeature(item.feature) : true
                      const isActive = location.pathname === item.path

                      return (
                        <SidebarMenuItem key={item.path}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={`flex items-center justify-between rounded-md px-3 py-2 transition-all ${
                                  !hasAccess ? 'opacity-50 hover:opacity-100 cursor-pointer' : ''
                                } ${
                                  isActive && hasAccess
                                    ? 'bg-[#1A3A0A] text-[#6DBF4A] border-l-[3px] border-[#6DBF4A] rounded-l-none'
                                    : 'text-[#6A8A5A] hover:bg-[#0D1F0D] hover:text-[#F5F0E8]'
                                }`}
                              >
                                <a
                                  href={hasAccess ? item.path : '#'}
                                  onClick={(e) => {
                                    if (!hasAccess) {
                                      handleLockedClick(e, item)
                                    } else {
                                      e.preventDefault()
                                      navigate(item.path, { state: { fromMenu: true } })
                                    }
                                  }}
                                  className="flex items-center gap-3 w-full"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <item.icon
                                      className={`w-[18px] h-[18px] ${isActive && hasAccess ? 'text-[#6DBF4A]' : 'text-[#6A8A5A]'}`}
                                    />
                                    <span>{item.title}</span>
                                  </div>
                                  {!planLoading && !hasAccess && (
                                    <Lock className="w-[14px] h-[14px] text-[#4A5A4A] flex-shrink-0" />
                                  )}
                                </a>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {!hasAccess && item.feature && (
                              <TooltipContent
                                side="right"
                                className="bg-[#0D1F0D] border-[#1E3A1E] text-[#F5F0E8]"
                              >
                                <p>Disponível no plano {getMinimumPlan(item.feature)}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <div className="p-4 mt-auto border-t border-[#1E3A1E] bg-[#0A1A0A]">
            <Button
              variant="ghost"
              className="w-full justify-start text-[#6A8A5A] hover:text-[#C62828] hover:bg-[#C62828]/10 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-[18px] h-[18px] mr-3" />
              Sair
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 bg-[#070F07] overflow-x-hidden min-w-0">
          <header className="flex h-16 items-center gap-4 border-b border-[#1E3A1E] px-6 bg-[#0A1A0A]/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="text-[#6A8A5A] hover:text-[#6DBF4A] transition-colors" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-[#F5F0E8]">{firstName}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold bg-[#1A3A0A] text-[#6DBF4A] border border-[#2E5A1A] px-2 py-0.5 rounded-full mt-0.5 inline-block">
                  {currentPlanName}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1A3A0A] border border-[#2E5A1A] flex items-center justify-center text-[#6DBF4A] font-bold shadow-sm">
                {initial}
              </div>
            </div>
          </header>
          <main className="p-6 max-w-full">
            <Outlet />
          </main>

          {upgradeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-200">
              <div className="bg-[#0D1F0D] border border-[#2E5A1A] rounded-[16px] p-[40px] max-w-[420px] w-full text-center flex flex-col items-center shadow-2xl">
                <Lock className="w-[48px] h-[48px] text-[#6DBF4A] mb-4" />
                <h2 className="text-[#F5F0E8] text-xl font-bold mb-2">
                  Este módulo não está incluído no seu plano atual
                </h2>
                <p className="text-[#A8B8A0] mb-6 text-sm">
                  Você está no plano: <strong className="text-[#F5F0E8]">{currentPlanName}</strong>
                  <br />
                  Este recurso está disponível a partir do plano:{' '}
                  <strong className="text-[#F5F0E8]">
                    {lockedItem?.feature ? getMinimumPlan(lockedItem.feature) : 'Superior'}
                  </strong>
                </p>
                <Button
                  onClick={() => {
                    setUpgradeModalOpen(false)
                    navigate('/selecionar-plano')
                  }}
                  className="w-full bg-[#6DBF4A] hover:bg-[#5CA83A] text-[#0A1A0A] font-bold mb-3 h-12"
                >
                  Ver Planos e Fazer Upgrade →
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setUpgradeModalOpen(false)}
                  className="w-full text-[#A8B8A0] hover:text-[#F5F0E8] hover:bg-[#1A3A0A]"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
