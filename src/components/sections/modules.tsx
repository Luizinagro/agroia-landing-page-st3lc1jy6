import { TrendingUp, Users, FileText, Tractor, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatedSection } from '@/components/animated-section'
import { cn } from '@/lib/utils'

const modules = [
  {
    title: 'Previsão IA',
    description: 'Modelos preditivos de alta precisão baseados em microclimas locais.',
    icon: TrendingUp,
  },
  {
    title: 'Comunidade',
    description: 'Conecte-se com produtores e troque experiências de sucesso.',
    icon: Users,
  },
  {
    title: 'SaaS Faturamento',
    description: 'Gestão financeira inteligente, integrada e simplificada para sua propriedade.',
    icon: FileText,
  },
  {
    title: 'Pecuária',
    description: 'Monitoramento de rebanho e otimização de pastagens.',
    icon: Tractor,
  },
]

function ModuleCard({
  mod,
  className,
  isAccent,
}: {
  mod: (typeof modules)[0]
  className?: string
  isAccent?: boolean
}) {
  const Icon = mod.icon
  return (
    <div
      className={cn(
        'rounded-[32px] p-8 flex flex-col justify-between transition-all duration-500 hover:scale-[1.01] group',
        isAccent
          ? 'bg-[#1DB954] text-black'
          : 'bg-[#050505] border border-white/5 text-white hover:border-[#1DB954]/30',
        className,
      )}
    >
      <div className="mb-12">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors',
            isAccent ? 'bg-black/10' : 'bg-[#1DB954]/10',
          )}
        >
          <Icon className={cn('w-6 h-6', isAccent ? 'text-black' : 'text-[#1DB954]')} />
        </div>
        <h3
          className={cn(
            'text-2xl font-black mb-3 tracking-tight',
            isAccent ? 'text-black' : 'text-white',
          )}
        >
          {mod.title}
        </h3>
        <p
          className={cn(
            'font-medium leading-relaxed',
            isAccent ? 'text-black/70' : 'text-[#A0A0A0]',
          )}
        >
          {mod.description}
        </p>
      </div>

      <Link
        to="/cadastro"
        className={cn(
          'flex items-center gap-2 font-bold w-fit mt-auto',
          isAccent ? 'text-black hover:text-black/70' : 'text-[#1DB954] hover:text-[#1aa34a]',
        )}
      >
        Saiba Mais
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}

export function Modules() {
  return (
    <section className="py-32 bg-black">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <AnimatedSection className="max-w-2xl mb-16">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Ecossistema</h2>
          <p className="text-[#A0A0A0] text-lg font-medium">
            Ferramentas essenciais modulares para modernizar e escalar os resultados da sua
            propriedade.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <AnimatedSection delay={0} className="md:col-span-6 lg:col-span-8">
            <ModuleCard mod={modules[0]} className="h-full min-h-[320px]" />
          </AnimatedSection>

          <AnimatedSection delay={100} className="md:col-span-6 lg:col-span-4">
            <ModuleCard mod={modules[1]} isAccent className="h-full min-h-[320px]" />
          </AnimatedSection>

          <AnimatedSection delay={200} className="md:col-span-6 lg:col-span-5">
            <ModuleCard mod={modules[2]} className="h-full min-h-[320px]" />
          </AnimatedSection>

          <AnimatedSection delay={300} className="md:col-span-6 lg:col-span-7">
            <ModuleCard mod={modules[3]} className="h-full min-h-[320px]" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
