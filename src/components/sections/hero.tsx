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
            <div className="absolute w-72 h-72 bg-green-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center pointer-events-none">
              {/* 3D Database / Neural Network CSS Animation */}
              <div
                className="relative w-48 h-48 sm:w-60 sm:h-60 animate-float"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(60deg) rotateZ(45deg)',
                }}
              >
                {/* Glowing Base */}
                <div
                  className="absolute inset-0 bg-green-500/20 blur-[40px] rounded-full"
                  style={{ transform: 'translateZ(-20px)' }}
                ></div>

                {/* Central vertical line connecting the layers */}
                <div
                  className="absolute left-1/2 top-1/2 w-0.5 bg-green-400/80 shadow-[0_0_15px_rgba(34,197,94,1)] -translate-x-1/2 -translate-y-1/2"
                  style={{ height: '100px', transform: 'translateZ(50px) rotateX(90deg)' }}
                ></div>

                {/* Secondary vertical line */}
                <div
                  className="absolute left-1/4 top-1/4 w-px bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.8)] -translate-x-1/2 -translate-y-1/2"
                  style={{ height: '100px', transform: 'translateZ(50px) rotateX(90deg)' }}
                ></div>

                {/* Stacked Layers */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 border border-green-500/30 bg-black/70 backdrop-blur-sm rounded-xl"
                    style={{
                      transform: `translateZ(${i * 50}px)`,
                      boxShadow:
                        '0 0 20px rgba(34,197,94,0.15), inset 0 0 20px rgba(34,197,94,0.1)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Inner grid/circuit pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.2)_1px,transparent_1px)] bg-[size:1rem_1rem] rounded-xl opacity-40"></div>

                    {/* Glowing nodes - different position per layer */}
                    <div
                      className={`absolute w-2 h-2 bg-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)] ${i === 0 ? 'top-4 left-4 animate-pulse' : i === 1 ? 'bottom-6 right-6 animate-ping' : 'top-10 right-8 animate-pulse'}`}
                    ></div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-green-500/40 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_20px_rgba(34,197,94,1)] animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
