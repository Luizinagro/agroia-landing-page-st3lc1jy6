import { MapSection } from '@/components/dashboard/map-section'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { WeatherForecast } from '@/components/dashboard/weather-forecast'
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
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'

const Dashboard = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isTrialExpired = user?.data_trial_expira
    ? new Date() > new Date(user.data_trial_expira)
    : false

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
                Seu trial expirou. Escolha um plano pago
              </p>
            </div>
            <Button
              asChild
              className="bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90 font-bold whitespace-nowrap shadow-sm w-full sm:w-auto text-base"
            >
              <Link to="/selecionar-plano">Upgrade</Link>
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1a3c34] flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-[#f4d03f]" />
              Olá, {user?.nome || 'Agricultor'}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Bem-vindo ao seu painel. Monitore suas culturas e receba alertas inteligentes em tempo
              real.
            </p>
          </div>

          {user && (
            <div className="flex flex-col bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#f4d03f]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Plano Atual
                </span>
              </div>
              <p className="text-xl font-bold text-[#1a3c34] dark:text-white mb-4">
                {user.plano_ativo || user.plano || 'N/A'}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Válido até:{' '}
                  {user.data_trial_expira
                    ? new Date(user.data_trial_expira).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>

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
