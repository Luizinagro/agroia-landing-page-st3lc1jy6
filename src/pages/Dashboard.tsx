import { MapSection } from '@/components/dashboard/map-section'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { WeatherForecast } from '@/components/dashboard/weather-forecast'
import { FeatureCards } from '@/components/dashboard/feature-cards'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { useSubscription } from '@/hooks/useSubscription'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { AlertTriangle, TrendingUp, Users, CheckCircle2, Tractor } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
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
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8 text-foreground animate-fade-in">
      <SEO
        title="Dashboard"
        description="Painel central de controle. Visão geral da propriedade, métricas de inteligência artificial e monitoramento de ativos."
      />

      <header className="bg-white dark:bg-zinc-950 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Tractor className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tight">AgroIA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-muted-foreground hidden sm:block">
            Olá, {user?.name || user?.email?.split('@')[0] || 'Produtor'}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {isTrialExpired && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500 mr-3 shrink-0" />
              <p className="text-red-800 dark:text-red-300 font-medium text-sm">
                Seu trial expirou. Escolha um plano pago para continuar tendo acesso total.
              </p>
            </div>
            <Button
              asChild
              className="whitespace-nowrap w-full sm:w-auto rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Link to="/selecionar-plano">Upgrade Agora</Link>
            </Button>
          </div>
        )}

        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-foreground">
              Visão Geral
            </h1>
            <p className="text-muted-foreground font-medium">Métricas principais da sua operação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  Produtividade Estimada
                </p>
                <p className="text-2xl font-black text-foreground">+14.5%</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  Status das Lavouras
                </p>
                <p className="text-2xl font-black text-foreground">Excelente</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  Equipe Ativa
                </p>
                <p className="text-2xl font-black text-foreground">12 Operadores</p>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-2">
          <FeatureCards userPlan={userPlan} user={user} />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          <div className="lg:col-span-8 space-y-8">
            <MapSection />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeatherForecast />
              <HistoryChart />
            </div>
            <IotConnection />
          </div>
          <div className="lg:col-span-4 h-full">
            <AlertsSection />
          </div>
        </section>
      </main>

      <Dialog open={blockedOpen} onOpenChange={setBlockedOpen}>
        <DialogContent className="rounded-2xl">
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
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
