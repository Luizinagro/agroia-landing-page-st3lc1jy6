import { AlertsSection } from '@/components/dashboard/alerts-section'
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
import { AlertTriangle, TrendingUp, Shield, Leaf, Activity, DollarSign, MapPin } from 'lucide-react'

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
  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans selection:bg-primary/30 w-full">
      <main className="flex-1 container py-8 mx-auto space-y-8 max-w-7xl animate-fade-in">
        <SEO
          title="Dashboard"
          description="Painel central de controle. Visão geral da propriedade, métricas de inteligência artificial e monitoramento de ativos."
        />

        <div className="flex flex-col md:flex-row items-start justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Visão Geral
            </h1>
            <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
              Acompanhe as principais métricas da sua operação.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/monitoramento')}
              className="bg-primary text-black font-bold hover:bg-primary/90 rounded-full shadow-[0_0_15px_rgba(29,185,84,0.3)]"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Monitoramento Técnico
            </Button>
            {isAdmin && (
              <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(29,185,84,0.15)] animate-pulse-slow shrink-0">
                <Shield className="w-4 h-4" />
                Modo Administrador
              </div>
            )}
          </div>
        </div>

        {isTrialExpired && !isAdmin && (
          <div className="bg-red-950/30 border border-red-900 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-down shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 shrink-0" />
              <p className="text-red-200 font-medium text-sm">
                Seu período de testes expirou. Assine um plano para liberar todos os recursos
                avançados.
              </p>
            </div>
            <Button
              asChild
              className="whitespace-nowrap w-full sm:w-auto rounded-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              <Link to="/selecionar-plano">Ver Planos</Link>
            </Button>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black border border-primary/60 hover:border-primary transition-colors duration-300 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_15px_rgba(29,185,84,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-[#A0A0A0] font-semibold mb-1">Produtividade</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">85%</p>
                <span className="text-xs text-primary font-bold">+5%</span>
              </div>
            </div>
          </div>

          <div className="bg-black border border-primary/60 hover:border-primary transition-colors duration-300 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_15px_rgba(29,185,84,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[#A0A0A0] font-semibold mb-1">Status Sensores</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">Ativos</p>
                <span className="text-xs text-blue-400 font-bold">12/12</span>
              </div>
            </div>
          </div>

          <div className="bg-black border border-primary/60 hover:border-primary transition-colors duration-300 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_15px_rgba(29,185,84,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-[#A0A0A0] font-semibold mb-1">Saúde Safra</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">Excelente</p>
              </div>
            </div>
          </div>

          <div className="bg-black border border-primary/60 hover:border-primary transition-colors duration-300 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_15px_rgba(29,185,84,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-[#A0A0A0] font-semibold mb-1">Receita Estimada</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">Em alta</p>
                <span className="text-xs text-purple-400 font-bold">IA</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Funcionalidades do Plano
                </h2>
                {isAdmin && (
                  <span className="text-xs text-primary font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    Acesso Total
                  </span>
                )}
              </div>
              <div className="[&>div]:bg-black [&>div]:border-primary/50 [&>div]:shadow-[0_0_15px_rgba(29,185,84,0.1)] [&_.bg-card]:bg-black [&_.bg-card]:border-primary/50">
                <FeatureCards
                  userPlan={isAdmin ? { plan_name: 'Completo' } : userPlan}
                  user={user}
                />
              </div>
            </section>
          </div>

          <div className="xl:col-span-1">
            <section className="bg-black border border-primary/50 rounded-3xl p-6 h-full flex flex-col shadow-[0_0_15px_rgba(29,185,84,0.1)]">
              <AlertsSection />
            </section>
          </div>
        </div>

        <Dialog open={blockedOpen} onOpenChange={setBlockedOpen}>
          <DialogContent className="bg-[#0A0A0A] border border-primary/20 text-white sm:max-w-[425px] rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Acesso Restrito
              </DialogTitle>
              <DialogDescription className="text-[#A0A0A0] mt-2">
                Esta funcionalidade é exclusiva para planos superiores. Faça upgrade para
                desbloquear todo o potencial da AgroIA.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                className="rounded-full border-white/10 text-white hover:bg-white/5 hover:text-white"
                onClick={() => setBlockedOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_20px_rgba(29,185,84,0.4)]"
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
      </main>
    </div>
  )
}

export default Dashboard
