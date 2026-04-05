import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'
export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main className="flex flex-col w-full bg-black">
        <Hero />

        {/* 3D Neural Core Section */}
        <section className="container mx-auto px-4 py-8 md:py-16 relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-green-500/10 bg-zinc-950/80">
            {/* Floating Badge */}
            <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-20">
              <div className="bg-black/60 backdrop-blur-md border border-green-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <span className="text-sm md:text-lg font-black tracking-widest text-green-400 uppercase">
                  Núcleo de IA
                </span>
              </div>
            </div>

            {/* Lightweight CSS Neural Core Animation */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505] overflow-hidden perspective-[1000px]">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"></div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0,transparent_50%)] pointer-events-none"></div>

              <div
                className="relative w-64 h-64 sm:w-96 sm:h-96 flex items-center justify-center animate-float pointer-events-none"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(60deg) rotateZ(45deg)',
                }}
              >
                {/* 3D Layers */}
                {[0, 1, 2, 3].map((layer) => (
                  <div
                    key={layer}
                    className="absolute inset-0"
                    style={{
                      transform: `translateZ(${layer * 40 - 60}px) scale(${1 - layer * 0.1})`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      className="absolute inset-0 border border-green-500/30 rounded-full"
                      style={{
                        boxShadow:
                          'inset 0 0 20px rgba(34,197,94,0.2), 0 0 20px rgba(34,197,94,0.2)',
                        transformStyle: 'preserve-3d',
                        animation: `spin ${10 + layer * 5}s linear infinite ${layer % 2 === 0 ? 'normal' : 'reverse'}`,
                      }}
                    >
                      {/* Nodes on rings */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)] animate-pulse"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    </div>
                  </div>
                ))}

                {/* Central Data Core connecting line */}
                <div
                  className="absolute left-1/2 top-1/2 w-0.5 bg-green-400/80 shadow-[0_0_20px_rgba(34,197,94,1)] -translate-x-1/2 -translate-y-1/2"
                  style={{ height: '180px', transform: 'translateZ(0px) rotateX(90deg)' }}
                ></div>

                {/* Central glowing orb */}
                <div
                  className="absolute left-1/2 top-1/2 w-12 h-12 bg-green-400 rounded-full blur-[10px] -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{ transform: 'translateZ(0px) rotateX(-60deg) rotateZ(-45deg)' }}
                ></div>
                <div
                  className="absolute left-1/2 top-1/2 w-6 h-6 bg-white rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: 'translateZ(0px) rotateX(-60deg) rotateZ(-45deg)' }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
