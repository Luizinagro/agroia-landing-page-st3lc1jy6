import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Tractor, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black pt-32 pb-16">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/1080?q=agriculture%20technology')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-center">
          {/* Main Content Block */}
          <div className="lg:col-span-7 flex flex-col justify-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary/30 mb-8 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                Sistema Operacional Agro
              </span>
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
              Inteligência <br className="hidden md:block" />
              <span className="text-primary">Agronômica</span> <br className="hidden md:block" />
              Avançada
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-lg mb-10 font-medium leading-relaxed">
              Maximize seus lucros com a plataforma definitiva para o campo. Previsões com IA,
              rastreabilidade e gestão em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-full text-lg"
              >
                <Link to="/cadastro">
                  Comece Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-zinc-700 text-white hover:bg-white/5 hover:text-white font-bold h-14 px-8 rounded-full text-lg"
              >
                <a href="#planos">Ver Planos</a>
              </Button>
            </div>
          </div>

          {/* Right side widgets */}
          <div className="lg:col-span-5 grid grid-rows-2 gap-6 animate-fade-in-left">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <span className="text-black font-black text-sm bg-primary px-3 py-1 rounded-full">
                  +14.5%
                </span>
              </div>
              <div>
                <p className="text-zinc-400 font-bold text-sm mb-1 uppercase tracking-wider">
                  Previsão Soja
                </p>
                <p className="text-5xl font-black text-white tracking-tighter">
                  <span className="text-2xl text-zinc-500 mr-1">R$</span>142
                  <span className="text-2xl text-zinc-500">,50</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 transition-colors duration-500">
                <Tractor className="w-8 h-8 text-primary mb-4" />
                <div>
                  <p className="text-zinc-400 font-bold text-xs mb-1 uppercase tracking-wider">
                    Precisão IA
                  </p>
                  <p className="text-3xl font-black text-white tracking-tighter">92%</p>
                </div>
              </div>

              <div className="bg-primary rounded-3xl p-6 flex flex-col justify-between text-black hover:bg-primary/90 transition-colors duration-500">
                <Users className="w-8 h-8 text-black/60 mb-4" />
                <div>
                  <p className="text-black/80 font-bold text-xs mb-1 uppercase tracking-wider">
                    Produtores
                  </p>
                  <p className="text-3xl font-black text-black tracking-tighter">5k+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
