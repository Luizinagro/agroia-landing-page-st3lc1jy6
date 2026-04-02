import { MapSection } from '@/components/dashboard/map-section'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { WeatherForecast } from '@/components/dashboard/weather-forecast'
import { FeatureCards } from '@/components/dashboard/feature-cards'
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

const Dashboard = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const { plan: userPlan } = useSubscription()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const trialDate = userPlan?.expires_at || user?.trial_expires_at || user?.data_trial_expira
  const isTrialExpired = trialDate ? new Date() > new Date(trialDate) : false
  const currentPlanName = userPlan?.plan_name || user?.plan_active || user?.plano_ativo || 'Básico'
  const userName = user?.name || user?.nome || 'Agricultor'
  const userEmail = user?.email || ''

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <SEO
        title="Dashboard"
        description="Visão geral da propriedade e monitoramento inteligente."
      />
      <header className="sticky top-0 z-50 w-full bg-[#1a3c34]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a3c34]/80 border-b border-white/10 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-white hover:bg-white/10 hover:text-[#f4d03f] h-9 w-9"
            >
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <Tractor className="w-6 h-6 text-[#f4d03f]" />
              <span className="hidden sm:inline">AgroIA Dashboard</span>
              <span className="sm:hidden">AgroIA</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <IotConnection />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 dark:bg-transparent rounded-xl mt-4">
        {isTrialExpired && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3 shrink-0" />
              <p className="text-red-800 font-medium text-base sm:text-lg">
                Seu trial expirou. Escolha um plano pago para continuar tendo acesso.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90 font-bold whitespace-nowrap shadow-sm w-full sm:w-auto text-base"
            >
              <Link to="/selecionar-plano">Upgrade Agora</Link>
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1a3c34] flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-[#f4d03f]" />
              Olá, {userName}
            </h1>
            {userEmail && <p className="text-slate-500 mt-1 font-medium">{userEmail}</p>}
            <p className="text-muted-foreground mt-2 text-lg">
              Bem-vindo ao seu painel. Monitore suas culturas e acompanhe seus benefícios.
            </p>
          </div>

          <div className="flex flex-col bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#f4d03f]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Plano Atual
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-[#f4d03f]/10 text-[#1a3c34] border-[#f4d03f]/50 font-bold px-3 py-1 text-sm"
              >
                {currentPlanName}
              </Badge>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Trial expira em:{' '}
                {trialDate ? new Date(trialDate).toLocaleDateString('pt-BR') : 'N/A'}
              </span>
            </div>

            <Button
              asChild
              className="mt-4 w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 font-semibold shadow-sm"
            >
              <Link to="/selecionar-plano">Fazer Upgrade</Link>
            </Button>
          </div>
        </div>

        <FeatureCards userPlan={userPlan} user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-2 space-y-8 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <MapSection />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeatherForecast />
              <HistoryChart />
            </div>
          </div>
          <div className="h-full animate-slide-up" style={{ animationDelay: '200ms' }}>
            <AlertsSection />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
