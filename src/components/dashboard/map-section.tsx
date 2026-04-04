import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin, Thermometer, Droplets, CloudRain, Bug } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface RegionData {
  id: string
  name: string
  crop: string
  temp: number
  humidity: number
  rainForecast: string
  pestRisk: {
    pest: string
    level: string
    recommendation: string
  }
  coordinates: { x: number; y: number }
}

const regions: RegionData[] = [
  {
    id: 'cascavel',
    name: 'Cascavel',
    crop: 'Soja',
    temp: 28,
    humidity: 65,
    rainForecast: 'em 3 dias',
    pestRisk: {
      pest: 'Lagarta',
      level: 'MÉDIO',
      recommendation: 'aplicar defensivo X',
    },
    coordinates: { x: 30, y: 45 },
  },
  {
    id: 'toledo',
    name: 'Toledo',
    crop: 'Milho',
    temp: 30,
    humidity: 60,
    rainForecast: 'em 2 dias',
    pestRisk: {
      pest: 'Ferrugem',
      level: 'ALTO',
      recommendation: 'aplicar defensivo Y',
    },
    coordinates: { x: 70, y: 35 },
  },
]

export function MapSection() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)

  return (
    <Card className="rounded-[2rem] border-black/5 dark:border-white/5 shadow-sm overflow-hidden bg-white dark:bg-[#18181b]">
      <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 pb-4">
        <CardTitle className="text-primary flex items-center gap-2">
          <MapPin className="w-5 h-5 text-secondary" />
          Mapa Interativo da Região
        </CardTitle>
        <CardDescription>
          Monitore dados hiperlocais de Cascavel e Toledo em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-primary/10 dark:to-primary/20 overflow-hidden">
          {/* Decorative Map Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Abstract map shapes to represent regions */}
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[50%] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] bg-secondary/20 rounded-full blur-3xl" />

          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group animate-float"
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y}%`,
                animationDelay: region.id === 'cascavel' ? '0s' : '1.5s',
                animationDuration: '4s',
              }}
            >
              <div className="relative">
                <MapPin
                  className="w-10 h-10 text-primary group-hover:text-secondary transition-colors duration-300 drop-shadow-lg"
                  fill="currentColor"
                />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 duration-1000"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive border-2 border-white dark:border-background"></span>
                </span>
              </div>
              <span className="mt-2 px-3 py-1 bg-white/95 dark:bg-black/95 text-primary dark:text-primary-foreground text-sm font-bold rounded-full shadow-md whitespace-nowrap group-hover:scale-105 transition-transform">
                {region.name}
              </span>
            </button>
          ))}
        </div>

        <Dialog open={!!selectedRegion} onOpenChange={(open) => !open && setSelectedRegion(null)}>
          <DialogContent className="sm:max-w-md border-t-4 border-t-secondary">
            {selectedRegion && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl text-primary flex items-center justify-between">
                    <span>
                      {selectedRegion.name} - {selectedRegion.crop}
                    </span>
                    <Badge
                      variant={
                        selectedRegion.pestRisk.level === 'ALTO' ? 'destructive' : 'secondary'
                      }
                      className="ml-2 font-bold shadow-sm"
                    >
                      Risco {selectedRegion.pestRisk.level}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>Monitoramento contínuo via sensores IoT</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Thermometer className="w-8 h-8 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Temperatura</p>
                        <p className="text-2xl font-bold tracking-tight text-primary">
                          {selectedRegion.temp}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Droplets className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Umidade</p>
                        <p className="text-2xl font-bold tracking-tight text-primary">
                          {selectedRegion.humidity}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <CloudRain className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                        Previsão de Chuva
                      </p>
                      <p className="font-semibold text-blue-900 dark:text-blue-300">
                        Chuva {selectedRegion.rainForecast}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                    <Bug className="w-6 h-6 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-400">
                        Risco de {selectedRegion.pestRisk.pest}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1 leading-snug">
                        Ação recomendada: <strong>{selectedRegion.pestRisk.recommendation}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
