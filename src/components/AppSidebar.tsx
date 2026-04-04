import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import {
  LogOut,
  LineChart,
  ClipboardList,
  Calculator,
  ShoppingCart,
  LayoutDashboard,
  Package,
  UserCircle,
  Tractor,
  Users as UsersIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

export function AppSidebar() {
  const { user, signOut } = useAuth() as any
  const { hasFeature } = useSubscription()
  const navigate = useNavigate()
  const location = useLocation()
  const [blockedOpen, setBlockedOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const isAdmin = user?.tipo_usuario === 'admin' || user?.user_type === 'admin'

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, feature: 'dashboard' },
    ...(isAdmin
      ? [{ title: 'CRM Vendas', path: '/crm', icon: UsersIcon, feature: 'dashboard' }]
      : []),
    { title: 'Pecuária', path: '/pecuaria', icon: Tractor, feature: 'pecuaria' },
    { title: 'Previsão IA', path: '/previsao-ia', icon: LineChart, feature: 'previsao-ia' },
    {
      title: 'Rastreabilidade',
      path: '/rastreabilidade',
      icon: ClipboardList,
      feature: 'rastreabilidade',
    },
    { title: 'Calculadora de ROI', path: '/roi', icon: Calculator, feature: 'roi' },
    { title: 'Loja de Insumos', path: '/loja', icon: ShoppingCart, feature: 'loja' },
    { title: 'Estoque de Insumos', path: '/insumos', icon: Package, feature: 'loja' },
    { title: 'Perfil', path: '/perfil', icon: UserCircle, feature: 'dashboard' },
  ]

  const handleNavigation = (e: React.MouseEvent, path: string, feature: string) => {
    if (!hasFeature(feature)) {
      e.preventDefault()
      setBlockedOpen(true)
    }
  }

  const userName = user?.user_metadata?.name || user?.name || 'Produtor'
  const userEmail = user?.email || ''

  return (
    <>
      <Sidebar className="border-r border-primary/20 bg-[#050505]">
        <SidebarHeader className="h-16 flex items-center justify-start px-4 border-b border-primary/20 bg-transparent">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Logo className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.6)]" />
            <span>AgroIA</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="py-4 bg-transparent">
          <SidebarMenu>
            {menuItems.map((item) => {
              const allowed = hasFeature(item.feature)
              const isActive = location.pathname.startsWith(item.path)

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive && allowed}
                    className={cn(
                      'transition-all duration-300 ease-out hover:text-primary hover:bg-primary/10 rounded-xl mx-2',
                      isActive
                        ? 'bg-primary/10 text-primary font-bold shadow-[inset_0_0_10px_rgba(29,185,84,0.1)] border border-primary/20'
                        : 'text-[#A0A0A0]',
                      !allowed
                        ? 'opacity-50 grayscale cursor-not-allowed hover:bg-transparent hover:text-muted-foreground'
                        : '',
                    )}
                    onClick={(e) => handleNavigation(e, item.path, item.feature)}
                  >
                    <Link to={allowed ? item.path : '#'}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-primary/20 p-4 bg-transparent">
          <div className="flex items-center justify-between overflow-hidden gap-2 glass-card rounded-xl p-2 px-3">
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-white truncate" title={userName}>
                {userName}
              </span>
              <span className="text-xs text-primary truncate" title={userEmail}>
                {userEmail}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sair"
              className="shrink-0 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={blockedOpen} onOpenChange={setBlockedOpen}>
        <DialogContent className="glass-panel border-primary/20 text-white sm:max-w-[425px] rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              Funcionalidade bloqueada
            </DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              Faça upgrade do seu plano para acessar este recurso e potencializar sua produção.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-primary/20 text-white hover:bg-primary/10 rounded-full"
              onClick={() => setBlockedOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_15px_rgba(29,185,84,0.4)]"
              onClick={() => {
                setBlockedOpen(false)
                navigate('/planos')
              }}
            >
              Fazer Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
