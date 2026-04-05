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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const ecossistema = [
  {
    icon: Cpu,
    title: 'IA Avançada',
    description: 'Previsões precisas e análises preditivas para sua fazenda.',
    cta: 'Ver previsões na prática',
    modalTitle: 'Previsões mais inteligentes para decidir melhor',
    modalText:
      'A IA Avançada analisa dados da operação para gerar previsões e apoiar decisões com mais segurança. Na prática, ela ajuda a antecipar cenários, reduzir erros e agir com mais precisão no campo.',
  },
  {
    icon: BarChart3,
    title: 'Gestão Completa',
    description: 'Dashboard intuitivo com todos os dados concentrados.',
    cta: 'Ver o dashboard em ação',
    modalTitle: 'Tudo centralizado em um só lugar',
    modalText:
      'A Gestão Completa reúne os principais dados da fazenda em um painel intuitivo e organizado. Isso facilita o acompanhamento da operação, melhora o controle e reduz a perda de informação no dia a dia.',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade ESG',
    description: 'Rastreabilidade total e conformidade com normas globais.',
    cta: 'Ver como rastrear',
    modalTitle: 'Rastreabilidade e conformidade com mais clareza',
    modalText:
      'Este recurso ajuda a acompanhar processos, registros e padrões importantes para a operação. Na prática, fortalece a transparência, melhora o controle e apoia uma gestão mais alinhada às exigências do mercado.',
  },
  {
    icon: Calculator,
    title: 'Calculadora ROI',
    description: 'Calcule o retorno sobre o investimento da sua safra.',
    cta: 'Calcular retorno',
    modalTitle: 'Entenda o retorno antes de investir',
    modalText:
      'A Calculadora ROI mostra de forma simples o retorno esperado sobre investimentos da operação. Assim, você compara custos, avalia viabilidade e toma decisões com mais confiança.',
  },
  {
    icon: Tractor,
    title: 'Pecuária',
    description: 'Controle de rebanho e manejo eficiente.',
    cta: 'Ver controle do rebanho',
    modalTitle: 'Mais controle sobre o rebanho',
    modalText:
      'O módulo de Pecuária ajuda a organizar informações do rebanho e melhorar o manejo da operação. Com isso, fica mais fácil acompanhar dados importantes e tomar decisões com mais precisão.',
  },
  {
    icon: DollarSign,
    title: 'SaaS Faturamento',
    description: 'Gestão financeira e emissão de cobranças.',
    cta: 'Ver gestão financeira',
    modalTitle: 'Mais organização financeira na operação',
    modalText:
      'O recurso de faturamento ajuda no controle financeiro, nas cobranças e na visão das receitas da operação. Isso traz mais clareza para a gestão e mais controle sobre o fluxo financeiro.',
  },
  {
    icon: ShoppingBag,
    title: 'Loja Agrícola',
    description: 'Compre insumos e equipamentos diretamente na plataforma.',
    cta: 'Ver como comprar',
    modalTitle: 'Compra mais prática dentro da plataforma',
    modalText:
      'A Loja Agrícola facilita o acesso a insumos e equipamentos em um só ambiente. Na prática, isso agiliza compras importantes e centraliza parte da rotina da operação.',
  },
  {
    icon: MessageSquare,
    title: 'Comunidade',
    description: 'Conecte-se com outros produtores e troque experiências.',
    cta: 'Entrar na comunidade',
    modalTitle: 'Troque experiências com outros produtores',
    modalText:
      'A Comunidade conecta usuários que vivem desafios parecidos no campo. É um espaço para aprender, compartilhar experiências e ampliar a visão com trocas relevantes.',
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
          <Link to="/cadastro">
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

              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto uppercase tracking-wider outline-none">
                    {item.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background border border-primary/20 shadow-[0_0_40px_rgba(29,185,84,0.1)]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground mb-3 leading-tight">
                      {item.modalTitle}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                      {item.modalText}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
                    <Link to="/cadastro">
                      <Button className="bg-primary text-black hover:bg-primary/90 font-bold px-6">
                        Começar agora
                      </Button>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
