import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award } from 'lucide-react'

export function GamificationCard() {
  return (
    <Card className="bg-white border-[#1a3c34]/10 shadow-sm w-full md:w-auto">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0 bg-[#f4d03f]/20 p-3 rounded-full">
          <Award className="w-6 h-6 text-[#1a3c34]" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">Meus Pontos</span>
            <Badge className="bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 border-none">
              Produtor Ativo
            </Badge>
          </div>
          <div className="text-2xl font-bold text-[#1a3c34]">4.500 pts</div>
        </div>
        <div className="ml-2 pl-4 border-l border-gray-100 hidden sm:block">
          <Button className="bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90 font-semibold text-sm h-9">
            Resgate Descontos
          </Button>
        </div>
      </CardContent>
      <div className="px-4 pb-4 sm:hidden">
        <Button className="w-full bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90 font-semibold text-sm h-9">
          Resgate Descontos
        </Button>
      </div>
    </Card>
  )
}
