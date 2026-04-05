import { Button } from '@/components/ui/button'
import { ArrowRight, BrainCircuit } from 'lucide-react'
import { LogoText } from '@/components/ui/logo'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.15)_0,transparent_50%)] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center justify-center animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mt-8 lg:mt-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              A Revolução no Agronegócio
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Inteligência Artificial para o seu{' '}
              <span className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] block mt-2">
                Agronegócio
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Com a <LogoText className="text-xl md:text-2xl ml-1 inline-flex" />, você otimiza sua
              produção, rastreia sua pecuária e toma decisões baseadas em dados precisos.
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
            {/* Safe 2D Animation replacing crash-prone 3D logic */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/10 rounded-full blur-[80px] animate-pulse"></div>

              <div className="relative w-full h-full border-[3px] border-dashed border-green-500/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)]"></div>
              </div>

              <div className="absolute w-3/4 h-3/4 border-2 border-yellow-500/20 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
              </div>

              <div className="absolute z-10 bg-zinc-950/90 p-8 rounded-full border border-green-500/30 backdrop-blur-md shadow-2xl">
                <BrainCircuit className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
