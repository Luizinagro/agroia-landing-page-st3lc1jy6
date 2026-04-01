import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle, Calendar } from 'lucide-react'

export function LiveTab() {
  return (
    <Card className="overflow-hidden border-[#1a3c34]/10 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-auto">
          <img
            src="https://img.usecurling.com/ppl/large?gender=male&seed=1"
            alt="Especialista"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 to-transparent flex items-end p-6">
            <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse mb-2 font-bold px-3 py-1 border-none">
              AO VIVO EM BREVE
            </Badge>
          </div>
        </div>
        <div className="p-8 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-[#1a3c34] mb-4">Previsão Safra Soja 2027</h2>
          <div className="flex items-center gap-2 text-gray-600 mb-6 font-medium">
            <Calendar className="w-5 h-5 text-[#f4d03f]" />
            <span>15 de Outubro, 19:00 (Horário de Brasília)</span>
          </div>
          <div className="space-y-2 text-gray-600 mb-8 border-l-2 border-[#1a3c34] pl-4">
            <p>
              Acompanhe a análise detalhada dos principais fatores climáticos e econômicos que
              impactarão a próxima safra.
            </p>
            <p>
              Especialistas convidados debaterão as tendências de mercado e estratégias de
              comercialização.
            </p>
            <p>Prepare-se com antecedência e garanta a melhor rentabilidade para o seu negócio.</p>
          </div>
          <Button
            className="bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90 font-bold text-lg h-12 w-full md:w-auto shadow-sm transition-transform hover:scale-[1.02]"
            asChild
          >
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <PlayCircle className="w-5 h-5 mr-2" />
              Assistir Agora
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}
