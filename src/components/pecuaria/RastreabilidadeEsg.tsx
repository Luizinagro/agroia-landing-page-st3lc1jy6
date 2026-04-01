import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, ShieldCheck, Leaf, FileText } from 'lucide-react'

export function RastreabilidadeEsg() {
  return (
    <Card className="border-agro-green/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-agro-green">Rastreabilidade ESG</CardTitle>
        <CardDescription>
          Gestão de origem, histórico sanitário e certificações para exportação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full h-64 bg-muted rounded-xl overflow-hidden border border-border">
          <img
            src="https://img.usecurling.com/p/1200/600?q=satellite%20farm"
            alt="Mapa da Fazenda"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-1/2 left-1/3 text-agro-yellow animate-bounce">
            <MapPin className="w-8 h-8 drop-shadow-md" fill="currentColor" />
          </div>
          <div
            className="absolute top-1/3 left-2/3 text-agro-yellow animate-bounce"
            style={{ animationDelay: '0.2s' }}
          >
            <MapPin className="w-8 h-8 drop-shadow-md" fill="currentColor" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-agro-green flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-agro-yellow" /> Histórico Sanitário
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-agro-green text-agro-green bg-agro-green/5"
              >
                <Leaf className="w-3 h-3 mr-1" /> Orgânico
              </Badge>
              <Badge
                variant="outline"
                className="border-agro-green text-agro-green bg-agro-green/5"
              >
                <Leaf className="w-3 h-3 mr-1" /> Grass-fed
              </Badge>
              <Badge
                variant="outline"
                className="border-agro-green text-agro-green bg-agro-green/5"
              >
                <ShieldCheck className="w-3 h-3 mr-1" /> Livre de Aftosa
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Todos os animais registrados no último lote atendem aos requisitos sanitários
              internacionais.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-agro-green flex items-center gap-2">
              <FileText className="w-5 h-5 text-agro-yellow" /> Conformidade de Exportação
            </h4>
            <Card className="bg-agro-green/5 border-agro-green/10 shadow-none">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-agro-green">
                    Relatório ESG para exportação UE 2027
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Atualizado há 2 dias</p>
                </div>
                <Button
                  size="sm"
                  className="bg-agro-green text-white hover:bg-agro-green/90 shrink-0"
                >
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
