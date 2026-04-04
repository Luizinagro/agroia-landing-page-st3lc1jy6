import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Tractor,
  CreditCard,
  User,
  Calculator,
  Leaf,
  Settings,
  ListTodo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Gestão de Tarefas', href: '/tarefas', icon: ListTodo },
  { name: 'Pecuária', href: '/pecuaria', icon: Tractor },
  { name: 'Rastreabilidade ESG', href: '/rastreabilidade', icon: Leaf },
  { name: 'Calculadora ROI', href: '/roi', icon: Calculator },
  { name: 'Meus Cálculos', href: '/meus-calculos', icon: Calculator },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Perfil', href: '/perfil', icon: User },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export default function Layout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#000000] text-slate-200 font-sans selection:bg-green-500/30">
        <Sidebar className="border-r border-slate-800/50 bg-[#0a0a0a]/95 backdrop-blur-xl">
          <SidebarHeader className="p-6 border-b border-slate-800/50 flex items-center">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {navigation.map((item) => {
                    const isActive =
                      location.pathname === item.href ||
                      (item.href !== '/' && location.pathname.startsWith(item.href))
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            'transition-all duration-200 hover:bg-green-500/10 hover:text-green-400 h-10',
                            isActive
                              ? 'bg-green-500/10 text-green-500 font-medium'
                              : 'text-slate-400',
                          )}
                        >
                          <Link
                            to={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg"
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
          <header className="h-16 flex items-center px-6 border-b border-slate-800/50 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10 md:hidden">
            <SidebarTrigger className="text-slate-400 hover:text-white" />
            <div className="ml-4 scale-75 origin-left">
              <Logo />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-[#000000] to-[#000000]">
            <div className="h-full p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  )
}
