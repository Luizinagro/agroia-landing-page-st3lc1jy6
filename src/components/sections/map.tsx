import { MapPin, Tractor, AlertTriangle } from 'lucide-react'

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
              {/* Realistic Map Background */}
              <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/600?q=realistic%20satellite%20farm%20field%20map')] bg-cover bg-center transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Dynamic Map Points */}
              <div className="absolute top-[35%] left-[45%] group cursor-pointer z-10">
                <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="relative bg-black border border-green-500 p-2 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                  <Tractor className="w-5 h-5 text-green-400" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-950/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white border border-green-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-bold text-green-400 mb-1">Trator 01 - Operando</p>
                  <p className="text-zinc-300">Velocidade: 8 km/h</p>
                  <p className="text-zinc-300">Talhão: Leste</p>
                </div>
              </div>

              <div className="absolute bottom-[25%] right-[25%] group cursor-pointer z-10">
                <div
                  className="absolute -inset-4 bg-yellow-500/20 rounded-full animate-ping"
                  style={{ animationDelay: '1s' }}
                ></div>
                <div className="relative bg-black border border-yellow-500 p-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-950/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white border border-yellow-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-bold text-yellow-400 mb-1">Alerta: Solo Seco</p>
                  <p className="text-zinc-300">Umidade: 12%</p>
                  <p className="text-zinc-300">Ação: Irrigação recomendada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
