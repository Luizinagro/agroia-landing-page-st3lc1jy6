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
  const { user } = useAuth() as any
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
    <div className="min-h-screen bg-[#000000] p-4 md:p-8 text-white animate-fade-in font-sans selection:bg-primary/30">
      <SEO
        title="Dashboard"
        description="Painel central de controle. Visão geral da propriedade, métricas de inteligência artificial e monitoramento de ativos."
      />

      <header className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between mb-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.3)] border border-primary/30">
            <Tractor className="text-primary w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">AgroIA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[#A0A0A0] hidden sm:block">
            Olá,{' '}
            <span className="text-white">
              {user?.name || user?.email?.split('@')[0] || 'Produtor'}
            </span>
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {isTrialExpired && (
          <div className="bg-red-950/30 border border-red-900 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 shrink-0" />
              <p className="text-red-300 font-medium text-sm">
                Seu trial expirou. Escolha um plano pago para continuar tendo acesso total.
              </p>
            </div>
            <Button
              asChild
              className="whitespace-nowrap w-full sm:w-auto rounded-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              <Link to="/selecionar-plano">Upgrade Agora</Link>
            </Button>
          </div>
        )}

        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-white">Visão Geral</h1>
            <p className="text-[#A0A0A0] font-medium">Métricas principais da sua operação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <TrendingUp className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.8)]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0] font-semibold uppercase tracking-wider">
                  Produtividade Estimada
                </p>
                <p className="text-2xl font-black text-white drop-shadow-md">+14.5%</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.8)]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0] font-semibold uppercase tracking-wider">
                  Status das Lavouras
                </p>
                <p className="text-2xl font-black text-white drop-shadow-md">Excelente</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Users className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.8)]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0] font-semibold uppercase tracking-wider">
                  Equipe Ativa
                </p>
                <p className="text-2xl font-black text-white drop-shadow-md">12 Operadores</p>
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
              className="rounded-full border-primary/20 text-white hover:bg-primary/10"
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
    </div>
  )
}

export default Dashboard
