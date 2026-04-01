import { MapSection } from '@/components/dashboard/map-section'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { LayoutDashboard, ArrowLeft, Tractor } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80 border-b border-white/10 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-white hover:bg-white/10 hover:text-secondary h-9 w-9"
            >
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <Tractor className="w-6 h-6 text-secondary" />
              <span className="hidden sm:inline">AgroIA Dashboard</span>
              <span className="sm:hidden">AgroIA</span>
            </div>
          </div>
          <IotConnection />
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 dark:bg-transparent rounded-xl mt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-secondary" />
              Visão Geral da Propriedade
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitore suas culturas, clima e receba alertas inteligentes em tempo real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-2 space-y-8 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <MapSection />
            <HistoryChart />
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
