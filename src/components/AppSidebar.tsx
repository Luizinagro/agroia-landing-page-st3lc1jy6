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
  Tractor,
  LineChart,
  ClipboardList,
  Calculator,
  ShoppingCart,
  LayoutDashboard,
  Package,
  UserCircle,
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

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, feature: 'dashboard' },
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
      <Sidebar>
        <SidebarHeader className="h-16 flex items-center justify-start px-4 border-b border-white/10 bg-[#111827]/40 backdrop-blur-[20px]">
          <div className="flex items-center gap-2 font-black text-2xl text-agro-green drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            <Tractor className="h-8 w-8" />
            <span>AgroIA</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="py-4">
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
                      'transition-all duration-400 ease-bounce hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]',
                      !allowed
                        ? 'opacity-50 grayscale cursor-not-allowed hover:bg-transparent'
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
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between overflow-hidden gap-2">
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium truncate" title={userName}>
                {userName}
              </span>
              <span className="text-xs text-muted-foreground truncate" title={userEmail}>
                {userEmail}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sair"
              className="shrink-0"
            >
              <LogOut className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={blockedOpen} onOpenChange={setBlockedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Funcionalidade bloqueada</DialogTitle>
            <DialogDescription>
              Faça upgrade do seu plano para acessar este recurso e potencializar sua produção.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockedOpen(false)}>
              Cancelar
            </Button>
            <Button
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
