import { MapSection } from '@/components/dashboard/map-section'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { WeatherForecast } from '@/components/dashboard/weather-forecast'
import { FeatureCards } from '@/components/dashboard/feature-cards'
import { NeonParticles } from '@/components/ui/neon-particles'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'
import { useRef } from 'react'
import {
  LayoutDashboard,
  ArrowLeft,
  Tractor,
  LogOut,
  AlertTriangle,
  Calendar,
  Star,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { useSubscription } from '@/hooks/useSubscription'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const trialDate = userPlan?.expires_at || user?.trial_expires_at || user?.data_trial_expira
  const isTrialExpired = trialDate ? new Date() > new Date(trialDate) : false
  const currentPlanName = userPlan?.plan_name || user?.plan_active || user?.plano_ativo || 'Básico'
  const userName = user?.name || user?.nome || 'Agricultor'
  const userEmail = user?.email || ''

  return (
    <div
      ref={dashboardRef}
      className="relative min-h-screen bg-background text-foreground font-sans flex flex-col"
    >
      <NeonParticles className="opacity-50" />
      <SEO
        title="Dashboard"
        description="Visão geral da propriedade e monitoramento inteligente."
      />
      <header className="navbar-glass !border-b !border-[#1DB954]/20">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-[#E0E0E0] hover:bg-[#1DB954]/10 hover:text-[#1DB954] h-9 w-9"
            >
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 font-medium text-lg text-[#FFFFFF]">
              <Tractor className="w-5 h-5 text-[#1DB954]" />
              <span className="hidden sm:inline">AgroIA Dashboard</span>
              <span className="sm:hidden">AgroIA</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <IotConnection />
            <button
              onClick={handleLogout}
              className="btn-agro-secondary px-4 py-2 flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto space-y-8 bg-transparent rounded-xl pt-24 pb-12">
        {isTrialExpired && (
          <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 shrink-0" />
              <p className="text-red-200 font-medium text-base sm:text-lg">
                Seu trial expirou. Escolha um plano pago para continuar tendo acesso.
              </p>
            </div>
            <Button
              asChild
              className="btn-agro-primary whitespace-nowrap w-full sm:w-auto text-base"
            >
              <Link to="/selecionar-plano">Upgrade Agora</Link>
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 gsap-grow">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[12px] bg-[#1DB954]/5 border border-[#1DB954]/20 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-[#1DB954] animate-pulse"></span>
              <span className="text-xs font-medium text-[#E0E0E0] uppercase tracking-wider">
                Sistema Ativo
              </span>
            </div>
            <h1 className="flex items-center gap-3 text-[#FFFFFF]">Olá, {userName}</h1>
            {userEmail && <p className="text-[#E0E0E0] mt-1 font-medium">{userEmail}</p>}
            <p className="text-[#E0E0E0] mt-2 text-base max-w-2xl">
              Bem-vindo ao centro de comando AgroTech. Monitore suas culturas, preveja cenários com
              IA e maximize seus lucros.
            </p>
          </div>

          <div className="card-glass flex flex-col p-6 min-w-[300px] bg-[#000000] border-[#1DB954]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#1DB954]" />
                <span className="text-sm font-medium uppercase tracking-wider text-[#E0E0E0]">
                  Plano Atual
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20 font-medium px-3 py-1 text-sm rounded-[12px]"
              >
                {currentPlanName}
              </Badge>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#1DB954]/20">
              <Calendar className="w-4 h-4 text-[#E0E0E0]" />
              <span className="text-sm font-medium text-[#E0E0E0]">
                Trial expira em:{' '}
                <span className="text-[#FFFFFF] font-bold">
                  {trialDate ? new Date(trialDate).toLocaleDateString('pt-BR') : 'N/A'}
                </span>
              </span>
            </div>

            <Link
              to="/selecionar-plano"
              className="btn-agro-primary w-full mt-6 py-3 text-center text-sm"
            >
              Fazer Upgrade
            </Link>
          </div>
        </div>

        <FeatureCards userPlan={userPlan} user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 gsap-grow">
          <div className="lg:col-span-8 space-y-8">
            <MapSection />
            <div className="grid-responsive">
              <WeatherForecast />
              <HistoryChart />
            </div>
          </div>
          <div className="lg:col-span-4 h-full">
            <AlertsSection />
          </div>
        </div>
      </main>

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
    </div>
  )
}

export default Dashboard
