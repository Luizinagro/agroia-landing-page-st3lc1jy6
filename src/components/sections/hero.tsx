import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf, Cpu, BarChart3 } from 'lucide-react'
import { LogoText } from '@/components/ui/logo'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.15)_0,transparent_50%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-900/20 rounded-full blur-3xl -z-10 animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="container mx-auto px-4 z-10 text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mx-auto">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16 scroll-mt-24"
        >
          <div className="flex flex-col items-center p-6 rounded-2xl bg-black/40 border border-primary/20 backdrop-blur hover:bg-primary/5 transition-colors">
            <Cpu className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">IA Avançada</h3>
            <p className="text-sm text-muted-foreground text-center">
              Previsões precisas e análises preditivas para sua fazenda.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-black/40 border border-primary/20 backdrop-blur hover:bg-primary/5 transition-colors">
            <BarChart3 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Gestão Completa</h3>
            <p className="text-sm text-muted-foreground text-center">
              Dashboard intuitivo com todos os dados concentrados.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-black/40 border border-primary/20 backdrop-blur hover:bg-primary/5 transition-colors">
            <Leaf className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Sustentabilidade ESG</h3>
            <p className="text-sm text-muted-foreground text-center">
              Rastreabilidade total e conformidade com normas globais.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
