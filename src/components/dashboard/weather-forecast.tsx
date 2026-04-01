import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CloudRain, ThermometerSun, Droplets, Bug } from 'lucide-react'
import { useDatabase } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'

export function WeatherForecast() {
  const { previsoes, loading } = useDatabase()

  if (loading) {
    return (
      <Card className="h-full border-primary/10 shadow-elevation">
        <CardContent className="p-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const prev = previsoes.length > 0 ? previsoes[0] : null

  return (
    <Card className="h-full border-primary/10 shadow-elevation flex flex-col">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-primary flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-secondary" />
          Previsão Meteorológica
        </CardTitle>
        <CardDescription>
          {prev ? `${prev.cidade} - ${prev.cultura}` : 'Nenhuma previsão disponível'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-6 flex flex-col justify-center">
        {prev ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-orange-50/50 rounded-xl border border-orange-100">
              <ThermometerSun className="w-10 h-10 text-orange-500 mb-2" />
              <p className="text-sm text-muted-foreground font-medium">Temperatura</p>
              <p className="text-3xl font-bold text-foreground">{prev.temperatura}°C</p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <Droplets className="w-10 h-10 text-blue-500 mb-2" />
              <p className="text-sm text-muted-foreground font-medium">Umidade</p>
              <p className="text-3xl font-bold text-foreground">{prev.umidade}%</p>
            </div>

            <div className="col-span-2 flex items-center justify-between p-4 bg-destructive/5 rounded-xl border border-destructive/10">
              <div className="flex items-center gap-3">
                <Bug className="w-6 h-6 text-destructive" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Risco de Pragas</p>
                  <p className="text-xs text-muted-foreground">Baseado nas condições atuais</p>
                </div>
              </div>
              <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full font-bold text-sm">
                {prev.risco_pragas}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Aguardando sincronização de dados climáticos.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
