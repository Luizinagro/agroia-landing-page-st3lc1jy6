import {
  TrendingUp,
  Users,
  FileText,
  Tractor,
  ArrowRight,
  Calculator,
  Leaf,
  ShoppingCart,
  Briefcase,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const modules = [
  {
    title: 'Previsão IA',
    description: 'Modelos preditivos de alta precisão baseados em microclimas locais.',
    icon: TrendingUp,
  },
  {
    title: 'Calculadora ROI',
    description: 'Análise de custo de produção e tempo de retorno (payback).',
    icon: Calculator,
  },
  {
    title: 'SaaS Faturamento',
    description: 'Gestão financeira inteligente e simplificada para sua propriedade.',
    icon: FileText,
  },
  {
    title: 'Pecuária',
    description: 'Monitoramento de rebanho e otimização de pastagens.',
    icon: Tractor,
  },
  {
    title: 'CRM e Leads',
    description: 'Gestão de tarefas e controle de contatos para maximizar vendas.',
    icon: Briefcase,
  },
  {
    title: 'Rastreabilidade',
    description: 'Controle ESG de ponta a ponta da produção para certificações.',
    icon: Leaf,
  },
  {
    title: 'Loja Agrícola',
    description: 'Compre insumos, sementes e maquinários direto pela plataforma.',
    icon: ShoppingCart,
  },
  {
    title: 'Comunidade',
    description: 'Conecte-se com produtores e troque experiências de sucesso.',
    icon: Users,
  },
]

function ModuleCard({ mod, isAccent }: { mod: (typeof modules)[0]; isAccent?: boolean }) {
  const Icon = mod.icon
  return (
    <div
      className={cn(
        'rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1',
        isAccent
          ? 'bg-primary text-black'
          : 'bg-zinc-950 border border-zinc-800 text-white hover:border-zinc-700',
      )}
    >
      <div className="mb-12">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center mb-6',
            isAccent ? 'bg-black/10' : 'bg-primary/10',
          )}
        >
          <Icon className={cn('w-6 h-6', isAccent ? 'text-black' : 'text-primary')} />
        </div>
        <h3 className="text-2xl font-black mb-3 tracking-tight">{mod.title}</h3>
        <p className={cn('font-medium', isAccent ? 'text-black/80' : 'text-zinc-400')}>
          {mod.description}
        </p>
      </div>

      <Link
        to="/cadastro"
        className={cn(
          'flex items-center gap-2 font-bold w-fit mt-auto group',
          isAccent ? 'text-black hover:text-black/70' : 'text-primary hover:text-primary/80',
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
    <section id="features" className="py-32 bg-black">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
            Ecossistema Completo
          </h2>
          <p className="text-zinc-400 text-lg font-medium">
            Ferramentas essenciais modulares para modernizar e escalar os resultados da sua
            propriedade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, i) => (
            <ModuleCard key={i} mod={mod} isAccent={i === 1 || i === 6} />
          ))}
        </div>
      </div>
    </section>
  )
}
