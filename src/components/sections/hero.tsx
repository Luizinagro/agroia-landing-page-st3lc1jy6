import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Leaf,
  Cpu,
  BarChart3,
  Calculator,
  Tractor,
  DollarSign,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react'
import { LogoText } from '@/components/ui/logo'
import { Link } from 'react-router-dom'

const ecossistema = [
  {
    icon: Cpu,
    title: 'IA Avançada',
    description: 'Previsões precisas e análises preditivas para sua fazenda.',
    link: '/previsao-ia',
  },
  {
    icon: BarChart3,
    title: 'Gestão Completa',
    description: 'Dashboard intuitivo com todos os dados concentrados.',
    link: '/dashboard',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade ESG',
    description: 'Rastreabilidade total e conformidade com normas globais.',
    link: '/rastreabilidade',
  },
  {
    icon: Calculator,
    title: 'Calculadora ROI',
    description: 'Calcule o retorno sobre o investimento da sua safra.',
    link: '/roi',
  },
  {
    icon: Tractor,
    title: 'Pecuária',
    description: 'Controle de rebanho e manejo eficiente.',
    link: '/pecuaria',
  },
  {
    icon: DollarSign,
    title: 'SaaS Faturamento',
    description: 'Gestão financeira e emissão de cobranças.',
    link: '/faturamento',
  },
  {
    icon: ShoppingBag,
    title: 'Loja Agrícola',
    description: 'Compre insumos e equipamentos diretamente na plataforma.',
    link: '/loja',
  },
  {
    icon: MessageSquare,
    title: 'Comunidade',
    description: 'Conecte-se com outros produtores e troque experiências.',
    link: '/comunidade',
  },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.15)_0,transparent_50%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-900/20 rounded-full blur-3xl -z-10 animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="container mx-auto px-4 z-10 text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mx-auto mt-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          A Revolução no Agronegócio
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
          Inteligência Artificial para o seu{' '}
          <span className="text-primary drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]">
            Agronegócio
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Com a <LogoText className="text-xl md:text-2xl ml-1" />, você otimiza sua produção,
          rastreia sua pecuária e toma decisões baseadas em dados.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button
              size="lg"
              className="h-12 px-8 bg-primary text-black hover:bg-primary/90 font-bold text-lg gap-2 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] transition-all"
            >
              Começar Agora <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border-primary/30 text-primary hover:bg-primary/10 font-bold text-lg"
            >
              Conhecer Planos
            </Button>
          </a>
        </div>

        <div
          id="solucoes"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-24 scroll-mt-24"
        >
          {ecossistema.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between p-6 rounded-2xl bg-black/40 border border-primary/20 backdrop-blur hover:bg-primary/10 hover:border-primary/50 transition-all group h-full shadow-lg"
            >
              <div className="flex flex-col items-center w-full">
                <div className="mb-4">
                  <item.icon className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground text-center">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">{item.description}</p>
              </div>
              <Link
                to={item.link}
                className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto uppercase tracking-wider"
              >
                Saiba Mais <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
