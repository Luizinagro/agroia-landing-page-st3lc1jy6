import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-[#0A0A0A] relative overflow-hidden border-white/5 shadow-2xl rounded-3xl">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-green-300 to-green-600">
            Tecnologia de Precisão
          </h2>
          <p className="mt-6 text-neutral-300 max-w-lg text-lg leading-relaxed">
            O futuro do campo em suas mãos. Monitore, preveja e gerencie sua produção de forma
            inteligente, utilizando dados avançados e visualizações interativas de alta performance.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[300px] md:min-h-full">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full pointer-events-none"
          />
        </div>
      </div>
    </Card>
  )
}
