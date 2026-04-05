import { MapPin } from 'lucide-react'

export function InteractiveMap() {
  return (
    <section className="py-24 bg-black relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.03)_0,transparent_70%)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Monitoramento em Tempo Real
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Acompanhe sua propriedade, clima e maquinário em um mapa interativo e dinâmico. Tenha
              a visão completa do seu agronegócio literalmente na palma da sua mão.
            </p>
            <ul className="space-y-5">
              {[
                'Zonas de calor e umidade',
                'Localização do maquinário em campo',
                'Alertas de geolocalizados em tempo real',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-300">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                    <MapPin className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-4 bg-green-500/10 blur-3xl rounded-full"></div>
            <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/600?q=farm%20map&color=green')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

              {/* Map Points */}
              <div className="absolute top-[30%] left-[35%] animate-pulse">
                <MapPin className="w-8 h-8 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,1)] -translate-x-1/2 -translate-y-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 bg-black/80 px-2 py-1 rounded text-[10px] text-white border border-green-500/30 whitespace-nowrap font-medium">
                  Trator 01 - Operando
                </div>
              </div>

              <div
                className="absolute bottom-[40%] right-[30%] animate-pulse"
                style={{ animationDelay: '1.5s' }}
              >
                <MapPin className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,1)] -translate-x-1/2 -translate-y-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 bg-black/80 px-2 py-1 rounded text-[10px] text-white border border-yellow-500/30 whitespace-nowrap font-medium">
                  Alerta de Solo Seco
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
