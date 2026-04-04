import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Syringe, Users } from 'lucide-react'

export function Rebanho() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Cabeças
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.250</div>
            <p className="text-xs text-primary/80 mt-1">+45 nascimentos este mês</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ganho de Peso Médio
            </CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">850g/dia</div>
            <p className="text-xs text-primary/80 mt-1">Acima da meta (800g)</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vacinas Pendentes
            </CardTitle>
            <Syringe className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">120</div>
            <p className="text-xs text-muted-foreground mt-1">Lote B3 - Aftosa</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atenção Especial
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">Animais em observação</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-white">Distribuição por Lote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Lote A1 (Engorda)', 'Lote B3 (Recria)', 'Lote C2 (Bezerrada)'].map((lote, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <span className="font-medium text-foreground">{lote}</span>
                <span className="text-muted-foreground font-semibold">{300 - i * 50} cabeças</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
