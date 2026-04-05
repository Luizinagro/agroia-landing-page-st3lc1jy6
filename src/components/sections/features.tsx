import { BrainCircuit, LineChart, MapPin, Tractor, ShieldCheck, CloudSun } from 'lucide-react'

export function Features() {
  const features = [
    {
      title: 'Previsão IA',
      description: 'Análise preditiva de safra e mercado utilizando algoritmos avançados.',
      icon: BrainCircuit,
    },
    {
      title: 'Gestão de Pecuária',
      description: 'Controle de rebanho, nutrição e ganho de peso com alta precisão.',
      icon: Tractor,
    },
    {
      title: 'Rastreabilidade',
      description: 'Acompanhe todo o ciclo do produto desde o plantio até a entrega.',
      icon: MapPin,
    },
    {
      title: 'Análise de ROI',
      description:
        'Calcule o retorno sobre o investimento de cada cultura de forma fácil e rápida.',
      icon: LineChart,
    },
    {
      title: 'Alertas Climáticos',
      description: 'Receba notificações em tempo real sobre mudanças drásticas no clima.',
      icon: CloudSun,
    },
    {
      title: 'Segurança de Dados',
      description: 'Suas informações de safra armazenadas com criptografia de ponta a ponta.',
      icon: ShieldCheck,
    },
  ]

  return (
    <section id="solucoes" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossas Soluções</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Tecnologia de ponta desenvolvida especificamente para as necessidades reais do produtor
            rural moderno, mantendo a simplicidade de uso.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-black border border-green-500/10 hover:border-green-500/30 transition-colors group rounded-xl p-8 shadow-sm"
            >
              <div className="w-14 h-14 rounded-lg bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
