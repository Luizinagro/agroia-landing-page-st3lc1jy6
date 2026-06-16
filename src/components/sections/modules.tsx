import { ScrollReveal } from '@/components/ScrollReveal'
import {
  Brain,
  Satellite,
  Bug,
  CalendarDays,
  Droplets,
  LineChart,
  Leaf,
  Calculator,
  BarChart3,
} from 'lucide-react'

export function Modules() {
  const modules = [
    {
      icon: Brain,
      title: 'Consultor IA',
      desc: 'Assistente virtual disponível 24/7 para responder dúvidas técnicas agronômicas.',
      badge: 'Todos os planos',
      badgeColor: 'bg-white/10 text-white',
    },
    {
      icon: Satellite,
      title: 'Análise Satelital',
      desc: 'Índices NDVI e umidade do solo atualizados com imagens de alta resolução.',
      badge: 'A partir de Lavoura',
      badgeColor: 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20',
    },
    {
      icon: Bug,
      title: 'Diagnóstico de Pragas',
      desc: 'Tire uma foto e a IA identifica a praga ou doença e sugere o tratamento.',
      badge: 'A partir de Lavoura',
      badgeColor: 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20',
    },
    {
      icon: CalendarDays,
      title: 'Calendário Agrícola',
      desc: 'Planejamento inteligente de plantio e colheita baseado em dados climáticos.',
      badge: 'A partir de Lavoura',
      badgeColor: 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20',
    },
    {
      icon: Droplets,
      title: 'Irrigação Inteligente',
      desc: 'Cálculo exato de milímetros de água necessários para cada talhão.',
      badge: 'A partir de Lavoura',
      badgeColor: 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20',
    },
    {
      icon: LineChart,
      title: 'Preços em Tempo Real',
      desc: 'Cotações de commodities (soja, milho, boi) com previsão de tendências.',
      badge: 'Todos os planos',
      badgeColor: 'bg-white/10 text-white',
    },
    {
      icon: Leaf,
      title: 'Cálculo de Carbono',
      desc: 'Estime a pegada de carbono da sua produção e acesse o mercado verde.',
      badge: 'Fazendeiro Completo',
      badgeColor: 'bg-[#F9A825]/10 text-[#F9A825] border border-[#F9A825]/20',
    },
    {
      icon: Calculator,
      title: 'Análise de ROI',
      desc: 'Descubra rapidamente o retorno sobre investimento de cada cultura.',
      badge: 'Todos os planos',
      badgeColor: 'bg-white/10 text-white',
    },
    {
      icon: BarChart3,
      title: 'Resumo Semanal',
      desc: 'Relatórios gerados por IA com os principais insights da sua semana.',
      badge: 'Todos os planos',
      badgeColor: 'bg-white/10 text-white',
    },
  ]

  return (
    <section className="py-24 bg-[#0A0F0D]">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Módulos que transformam dados em <span className="text-[#00C853]">Lucro</span>
          </h2>
          <p className="text-[#A0AFA3] max-w-2xl mx-auto text-lg">
            Um ecossistema completo de Inteligência Artificial para cada etapa do seu ciclo
            produtivo.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((mod, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <div className="bg-[#111A13] border border-white/5 hover:border-[#00C853]/30 transition-all group rounded-2xl p-8 h-full flex flex-col hover:bg-[#1B5E20]/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1B5E20]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <mod.icon className="w-6 h-6 text-[#00C853]" />
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md ${mod.badgeColor}`}
                  >
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{mod.title}</h3>
                <p className="text-[#A0AFA3] leading-relaxed text-sm">{mod.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
