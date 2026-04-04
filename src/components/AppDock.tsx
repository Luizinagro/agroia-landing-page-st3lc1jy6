import { useNavigate, useLocation } from 'react-router-dom'
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
import { Dock } from '@/components/ui/dock-two'
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

export function AppDock() {
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
    { title: 'Loja', path: '/loja', icon: ShoppingCart, feature: 'loja' },
    { title: 'Estoque', path: '/insumos', icon: Package, feature: 'loja' },
    { title: 'Perfil', path: '/perfil', icon: UserCircle, feature: 'dashboard' },
  ]

  const handleNavigation = (path: string, feature: string) => {
    if (!hasFeature(feature)) {
      setBlockedOpen(true)
    } else {
      navigate(path)
    }
  }

  const dockItems = [
    ...menuItems.map((item) => ({
      icon: item.icon,
      label: item.title,
      onClick: () => handleNavigation(item.path, item.feature),
      isActive: location.pathname.startsWith(item.path),
      disabled: !hasFeature(item.feature),
    })),
    {
      icon: LogOut,
      label: 'Sair',
      onClick: handleLogout,
      className: 'text-red-500 hover:text-red-400 hover:bg-red-500/10',
    },
  ]

  return (
    <>
      <Dock items={dockItems} />

      <Dialog open={blockedOpen} onOpenChange={setBlockedOpen}>
        <DialogContent className="glass-panel border-primary/20 text-white sm:max-w-[425px] rounded-[16px] bg-[#050505]/95 backdrop-blur-xl">
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
