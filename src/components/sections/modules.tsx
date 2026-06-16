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
      desc: 'Tire dúvidas agronômicas 24h por dia. É como ter um técnico sempre ao lado.',
      badge: 'TODOS OS PLANOS',
      badgeColor: 'bg-[#1A3A0A] text-[#8BC34A]',
    },
    {
      icon: Satellite,
      title: 'Análise Satelital',
      desc: 'Veja a saúde de cada talhão por imagem de satélite. Índices NDVI atualizados toda semana.',
      badge: 'A PARTIR DE LAVOURA',
      badgeColor: 'bg-[#1A2A3A] text-[#64B5F6]',
    },
    {
      icon: Bug,
      title: 'Diagnóstico de Pragas',
      desc: 'Tire uma foto da planta. A IA identifica a praga ou doença e já sugere o tratamento correto.',
      badge: 'A PARTIR DE LAVOURA',
      badgeColor: 'bg-[#1A2A3A] text-[#64B5F6]',
    },
    {
      icon: CalendarDays,
      title: 'Calendário Agrícola',
      desc: 'Planejamento de plantio e colheita baseado no clima local e nos dados da sua propriedade.',
      badge: 'A PARTIR DE LAVOURA',
      badgeColor: 'bg-[#1A2A3A] text-[#64B5F6]',
    },
    {
      icon: Droplets,
      title: 'Irrigação Inteligente',
      desc: 'Calcula milímetro a milímetro o que cada área da fazenda precisa. Sem desperdício de água.',
      badge: 'A PARTIR DE LAVOURA',
      badgeColor: 'bg-[#1A2A3A] text-[#64B5F6]',
    },
    {
      icon: LineChart,
      title: 'Preços em Tempo Real',
      desc: 'Cotações de soja, milho, boi e outras commodities com análise de tendência para vender na hora certa.',
      badge: 'TODOS OS PLANOS',
      badgeColor: 'bg-[#1A3A0A] text-[#8BC34A]',
    },
    {
      icon: Leaf,
      title: 'Cálculo de Carbono',
      desc: 'Estime a pegada de carbono da sua produção e acesse créditos do mercado verde.',
      badge: 'FAZENDEIRO COMPLETO',
      badgeColor: 'bg-[#2A1A0A] text-[#FFB74D]',
    },
    {
      icon: Calculator,
      title: 'Análise de ROI',
      desc: 'Veja o retorno exato de cada cultura e tome decisões baseadas em número, não em chute.',
      badge: 'TODOS OS PLANOS',
      badgeColor: 'bg-[#1A3A0A] text-[#8BC34A]',
    },
    {
      icon: BarChart3,
      title: 'Resumo Semanal',
      desc: 'Todo domingo, um relatório gerado por IA com os principais alertas e oportunidades da semana.',
      badge: 'TODOS OS PLANOS',
      badgeColor: 'bg-[#1A3A0A] text-[#8BC34A]',
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-[#070F07]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#F5F0E8] mb-6">
            9 módulos para cada fase da sua produção
          </h2>
          <p className="text-[#A8B8A0] max-w-2xl mx-auto text-lg">
            Da análise do solo à venda da safra — tudo centralizado no seu celular.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <div className="bg-[#0D1F0D] border border-[#1E3A1E] hover:border-[#6DBF4A]/30 transition-all group rounded-xl px-6 py-7 h-full flex flex-col hover:bg-[#1A3A1A]/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#4A8A1A]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <mod.icon className="w-6 h-6 text-[#6DBF4A]" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${mod.badgeColor}`}
                  >
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#F5F0E8] mb-3">{mod.title}</h3>
                <p className="text-[#A8B8A0] leading-relaxed text-sm">{mod.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
