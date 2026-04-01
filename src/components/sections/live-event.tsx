import { Calendar, Clock, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/animated-section'

export function LiveEvent() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <AnimatedSection>
          <div className="relative rounded-3xl overflow-hidden bg-primary shadow-elevation">
            <div className="absolute inset-0 z-0 opacity-20">
              <img
                src="https://img.usecurling.com/p/1200/400?q=modern%20farming&color=green"
                alt="Agro Event"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
              <div className="flex-1 space-y-6 text-white text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  Próxima Live Agro-Futuro
                </div>

                <h2 className="text-3xl md:text-4xl font-bold">
                  Estratégias de Exportação para 2027
                </h2>

                <p className="text-primary-foreground/80 text-lg max-w-xl">
                  Aprenda como preparar sua propriedade para as novas exigências de rastreabilidade
                  ESG da União Europeia.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-center md:items-start text-primary-foreground/90 font-medium pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span>Quinta-feira, 15 de Maio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span>19:00 (Horário de Brasília)</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <img
                  src="https://img.usecurling.com/ppl/thumbnail?seed=88"
                  alt="Dr. Roberto Silva"
                  className="w-20 h-20 rounded-full border-2 border-secondary mb-4 object-cover"
                />
                <h3 className="text-white font-semibold text-lg text-center">Dr. Roberto Silva</h3>
                <p className="text-white/70 text-sm text-center mb-6">
                  Especialista em Agronegócio Global
                </p>

                <Button className="w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold gap-2">
                  <Video className="w-4 h-4" />
                  Assistir Gratuitamente
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
