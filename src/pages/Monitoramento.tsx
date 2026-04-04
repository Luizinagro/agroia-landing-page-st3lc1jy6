import { MapSection } from '@/components/dashboard/map-section'
import { HistoryChart } from '@/components/dashboard/history-chart'
import { IotConnection } from '@/components/dashboard/iot-connection'
import { WeatherForecast } from '@/components/dashboard/weather-forecast'
import { SEO } from '@/components/SEO'

const Monitoramento = () => {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans selection:bg-primary/30 w-full">
      <main className="flex-1 container py-8 mx-auto space-y-8 max-w-7xl animate-fade-in">
        <SEO
          title="Monitoramento Técnico"
          description="Monitoramento técnico da sua propriedade. Acompanhe mapas, clima e tendências em tempo real."
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-primary/20 bg-black">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Monitoramento Técnico
            </h1>
            <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
              Acompanhe mapas, clima e tendências da sua propriedade.
            </p>
          </div>
          <div className="shrink-0 flex items-center">
            <IotConnection />
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-black border border-primary/60 rounded-3xl p-6 overflow-hidden shadow-[0_0_15px_rgba(29,185,84,0.1)] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <h2 className="text-xl font-bold tracking-tight mb-6 relative z-10 text-white">
              Mapa da Propriedade
            </h2>
            <div className="relative z-10">
              <MapSection />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-black border border-primary/60 rounded-3xl p-6 shadow-[0_0_15px_rgba(29,185,84,0.1)] h-full">
              <WeatherForecast />
            </section>
            <section className="bg-black border border-primary/60 rounded-3xl p-6 shadow-[0_0_15px_rgba(29,185,84,0.1)] h-full">
              <HistoryChart />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Monitoramento
