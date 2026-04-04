import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaf, ShieldCheck, TreePine } from 'lucide-react'

export function RastreabilidadeEsg() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Área Preservada
            </CardTitle>
            <TreePine className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">450 ha</div>
            <p className="text-xs text-primary/80 mt-1">+12% este ano</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emissão de Carbono
            </CardTitle>
            <Leaf className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">-25%</div>
            <p className="text-xs text-primary/80 mt-1">Meta atingida</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificações
            </CardTitle>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3 Ativas</div>
            <p className="text-xs text-muted-foreground mt-1">ISO 14001, RenovaBio</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-primary/20 overflow-hidden relative">
        <CardHeader>
          <CardTitle className="text-white">Mapa de Rastreabilidade Sustentável</CardTitle>
          <CardDescription>
            Monitoramento limpo e seguro das áreas de preservação e manejo
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[450px] w-full bg-[#050a07] flex items-center justify-center overflow-hidden border-t border-primary/10">
            {/* Clean grid background without bouncing images */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1db9540a_1px,transparent_1px),linear-gradient(to_bottom,#1db9540a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

            {/* Subtle, professional glowing zones representing areas */}
            <div className="absolute top-[30%] left-[20%] w-40 h-40 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="absolute top-[50%] right-[30%] w-56 h-56 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] left-[45%] w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="absolute top-[35%] left-[25%] flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#1db954]"></div>
              <Badge
                variant="outline"
                className="bg-black/60 backdrop-blur-md border-primary/40 text-primary px-3 py-1"
              >
                Zona Preservada A
              </Badge>
            </div>

            <div className="absolute top-[55%] right-[35%] flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
              <Badge
                variant="outline"
                className="bg-black/60 backdrop-blur-md border-blue-500/40 text-blue-400 px-3 py-1"
              >
                Recurso Hídrico
              </Badge>
            </div>

            <div className="absolute bottom-[25%] left-[45%] flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_15px_#eab308]"></div>
              <Badge
                variant="outline"
                className="bg-black/60 backdrop-blur-md border-yellow-500/40 text-yellow-500 px-3 py-1"
              >
                Área de Manejo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
