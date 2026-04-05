import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { LogoText } from '@/components/ui/logo'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.15)_0,transparent_50%)] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-10 animate-float pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-900/20 rounded-full blur-3xl -z-10 animate-float pointer-events-none"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center justify-center animate-fade-in-up">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium mt-8 lg:mt-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              A Revolução no Agronegócio
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Inteligência Artificial para o seu{' '}
              <span className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] block mt-2">
                Agronegócio
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Com a <LogoText className="text-xl md:text-2xl ml-1" />, você otimiza sua produção,
              rastreia sua pecuária e toma decisões baseadas em dados precisos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/cadastro">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-green-500 text-black hover:bg-green-400 font-black text-lg gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
                >
                  Começar Agora <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#planos">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400 font-bold text-lg transition-all"
                >
                  Conhecer Planos
                </Button>
              </a>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center relative mt-12 lg:mt-0">
            <div className="absolute w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div
              className="relative w-full max-w-lg aspect-square flex items-center justify-center animate-float pointer-events-none"
              style={{ animationDuration: '6s' }}
            >
              <img
                src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=800&auto=format&fit=crop"
                alt="Modelo 3D de Análise de Dados"
                className="w-full h-full object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                style={{ filter: 'hue-rotate(110deg) brightness(1.3) contrast(1.2)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
