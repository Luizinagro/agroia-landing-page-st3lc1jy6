import { MapSection } from '@/components/dashboard/map-section'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { WeatherForecast } from '@/components/dashboard/weather-forecast'
import { FeatureCards } from '@/components/dashboard/feature-cards'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'
import { useRef, useEffect, useState } from 'react'
import {
  Search,
  Mail,
  Bell,
  TrendingUp,
  Users,
  CheckCircle2,
  MoreHorizontal,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { useSubscription } from '@/hooks/useSubscription'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const Dashboard = () => {
  const { logout, user } = useAuth()
  const dashboardRef = useRef<HTMLDivElement>(null)
  useGsapAnimations(dashboardRef)
  const navigate = useNavigate()
  const location = useLocation()
  const { plan: userPlan } = useSubscription()
  const [blockedOpen, setBlockedOpen] = useState(false)

  useEffect(() => {
    if (location.state?.blockedFeature) {
      setBlockedOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const trialDate = userPlan?.expires_at || user?.trial_expires_at || user?.data_trial_expira
  const isTrialExpired = trialDate ? new Date() > new Date(trialDate) : false

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-[#f4f7fb] dark:bg-[#0a0a0a] p-4 md:p-8 font-sans text-foreground"
    >
      <SEO
        title="Dashboard"
        description="Painel central de controle. Visão geral da propriedade, métricas de inteligência artificial e monitoramento de ativos."
      />

      {/* Header inside Dashboard matching the Design System */}
      <header className="bg-white dark:bg-[#18181b] rounded-[2.5rem] px-6 py-4 flex items-center justify-between shadow-sm border border-black/5 dark:border-white/5 mb-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 font-bold text-xl text-foreground">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-white dark:text-black font-serif text-xl font-bold">S</span>
            </div>
            <span className="tracking-tight">Salesforce</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <a
              href="#"
              className="text-[#2563eb] dark:text-blue-400 border-b-2 border-[#2563eb] dark:border-blue-400 pb-1"
            >
              Resumo
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Fundadores
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Finanças
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contatos
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Crescimento
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Projetos
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-50 dark:bg-[#27272a] rounded-full px-4 py-2 border border-transparent focus-within:border-primary/20 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm w-48 text-foreground"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100 dark:hover:bg-[#27272a]"
          >
            <Mail className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative hover:bg-slate-100 dark:hover:bg-[#27272a]"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
          </Button>
          <Avatar className="w-10 h-10 shadow-sm border-2 border-white dark:border-[#18181b] cursor-pointer hover:scale-105 transition-transform">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {isTrialExpired && (
          <div className="bg-red-50 dark:bg-red-950/50 border-l-4 border-red-500 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 shrink-0" />
              <p className="text-red-800 dark:text-red-200 font-medium text-base">
                Seu trial expirou. Escolha um plano pago para continuar tendo acesso.
              </p>
            </div>
            <Button asChild className="whitespace-nowrap w-full sm:w-auto rounded-full">
              <Link to="/selecionar-plano">Upgrade Agora</Link>
            </Button>
          </div>
        )}

        {/* Informações do Cliente */}
        <section className="gsap-grow">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
              Informações do Cliente
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Visão geral e métricas principais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric Card 1 */}
            <div className="bg-white dark:bg-[#18181b] rounded-full py-5 px-6 flex items-center justify-between border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center bg-slate-50 dark:bg-[#27272a]">
                  <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">$1,980,130</p>
                  <p className="text-sm text-muted-foreground font-medium">Valores Ganhos</p>
                </div>
              </div>
              <span className="bg-[#fef3c7] dark:bg-yellow-900/30 text-[#92400e] dark:text-yellow-500 text-xs font-bold px-3 py-1 rounded-full">
                +11% sem
              </span>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white dark:bg-[#18181b] rounded-full py-5 px-6 flex items-center justify-between border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center bg-slate-50 dark:bg-[#27272a]">
                  <Users className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">+89</p>
                  <p className="text-sm text-muted-foreground font-medium">Novos Clientes</p>
                </div>
              </div>
              <span className="bg-[#dbeafe] dark:bg-blue-900/30 text-[#1e40af] dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                +12 hoje
              </span>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white dark:bg-[#18181b] rounded-full py-5 px-6 flex items-center justify-between border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center bg-slate-50 dark:bg-[#27272a]">
                  <CheckCircle2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">+31</p>
                  <p className="text-sm text-muted-foreground font-medium">Tarefas Concluídas</p>
                </div>
              </div>
              <span className="bg-[#dcfce7] dark:bg-green-900/30 text-[#166534] dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                +6 hoje
              </span>
            </div>
          </div>
        </section>

        {/* Histórico de Interação */}
        <section className="gsap-grow pt-6">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Histórico de Interação
            </h2>
            <div className="flex gap-3 text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                <MoreHorizontal className="w-6 h-6" />
              </button>
              <button className="hover:text-foreground transition-colors">
                <ArrowUpRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blue Card */}
            <div className="bg-[#2563eb] text-white rounded-[2.5rem] p-8 relative flex flex-col justify-between min-h-[260px] shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold opacity-90">4 Out</span>
                <MoreHorizontal className="w-6 h-6 opacity-90 cursor-pointer hover:opacity-100" />
              </div>
              <div className="mt-8">
                <h3 className="text-3xl font-bold mb-1 tracking-tight">Pacote Royal</h3>
                <p className="text-blue-100 font-medium mb-8">Oportunidade</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-extrabold">11,250$</span>
                  <div className="flex -space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-[#2563eb]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
                    </Avatar>
                    <Avatar className="w-10 h-10 border-2 border-[#2563eb]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2" />
                    </Avatar>
                    <Avatar className="w-10 h-10 border-2 border-[#2563eb]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3" />
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Card */}
            <div className="bg-[#349880] text-white rounded-[2.5rem] p-8 relative flex flex-col justify-between min-h-[260px] shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold opacity-90">16 Out</span>
                <MoreHorizontal className="w-6 h-6 opacity-90 cursor-pointer hover:opacity-100" />
              </div>
              <div className="mt-8">
                <h3 className="text-3xl font-bold mb-1 tracking-tight">Terceiro Negócio</h3>
                <p className="text-teal-100 font-medium mb-8">Mais Útil</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-extrabold">21,300$</span>
                  <div className="flex -space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-[#349880]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4" />
                    </Avatar>
                    <Avatar className="w-10 h-10 border-2 border-[#349880]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=5" />
                    </Avatar>
                    <Avatar className="w-10 h-10 border-2 border-[#349880]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=6" />
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>

            {/* Black Card */}
            <div className="bg-[#09090b] text-white rounded-[2.5rem] p-8 relative flex flex-col justify-between min-h-[260px] shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold opacity-90">12 Out</span>
                <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4 font-bold" />
                </button>
              </div>
              <div className="mt-8">
                <h3 className="text-3xl font-bold mb-1 tracking-tight">Sucesso Absoluto</h3>
                <p className="text-zinc-400 font-medium mb-8">Negócio Fechado</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-extrabold">2,100$</span>
                  <div className="flex -space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-[#09090b]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=7" />
                    </Avatar>
                    <Avatar className="w-10 h-10 border-2 border-[#09090b]">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=8" />
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-6">
          <FeatureCards userPlan={userPlan} user={user} />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 gsap-grow pb-12">
          <div className="lg:col-span-8 space-y-8">
            <MapSection />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeatherForecast />
              <HistoryChart />
            </div>
          </div>
          <div className="lg:col-span-4 h-full">
            <AlertsSection />
          </div>
        </section>
      </main>

      <Dialog open={blockedOpen} onOpenChange={setBlockedOpen}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Funcionalidade bloqueada</DialogTitle>
            <DialogDescription>
              Faça upgrade do seu plano para acessar este recurso e potencializar sua produção.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setBlockedOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-full"
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
    </div>
  )
}

export default Dashboard
