import { useState } from 'react'
import {
  MapPin,
  Satellite,
  Droplets,
  Thermometer,
  Calendar,
  AlertTriangle,
  Search,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export default function AnaliseSatelite() {
  const [lat, setLat] = useState('-15.7938')
  const [lng, setLng] = useState('-47.8827')
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 })
  const [status, setStatus] = useState<'empty' | 'loading' | 'success' | 'error'>('empty')

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPinPos({ x, y })
    // Simulação simples de coordenada baseada no clique
    setLat((-15 + (y - 50) * 0.2).toFixed(4))
    setLng((-47 + (x - 50) * 0.2).toFixed(4))
  }

  const handleAnalyse = () => {
    setStatus('loading')
    setTimeout(() => {
      // 10% chance de erro para testar a UX
      if (Math.random() > 0.9) {
        setStatus('error')
      } else {
        setStatus('success')
      }
    }, 2500)
  }

  // Dados mockados solicitados
  const mockData = {
    ndvi: 0.65,
    umidade: 72,
    temperatura: 28,
    data: new Date().toLocaleDateString('pt-BR'),
    thumbnail: 'https://img.usecurling.com/p/400/300?q=satellite%20farm%20field&color=green&dpr=2',
  }

  const getNdviColor = (value: number) => {
    if (value < 0.3) return 'bg-red-500'
    if (value < 0.6) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-24">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Satellite className="w-8 h-8 text-primary" />
            Análise de Solo por Satélite
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitore a saúde da lavoura através de índices espectrais e dados climáticos
            localizados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel do Mapa */}
        <Card className="lg:col-span-2 bg-black border-white/10 shadow-[0_0_15px_rgba(29,185,84,0.05)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Seleção de Área
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Clique no mapa ou insira as coordenadas para analisar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Latitude</label>
                <Input
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="bg-zinc-900 border-white/10 text-white focus-visible:ring-primary"
                  placeholder="-15.7938"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Longitude</label>
                <Input
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="bg-zinc-900 border-white/10 text-white focus-visible:ring-primary"
                  placeholder="-47.8827"
                />
              </div>
            </div>

            {/* Mapa Interativo Simulado */}
            <div
              className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden cursor-crosshair border border-white/10 bg-zinc-900 group"
              onClick={handleMapClick}
            >
              <img
                src="https://img.usecurling.com/p/1000/600?q=satellite%20map%20terrain&color=gray&dpr=2"
                alt="Mapa satélite"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Pino */}
              <div
                className="absolute w-6 h-6 -ml-3 -mt-6 text-primary transition-all duration-300 shadow-xl"
                style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
              >
                <MapPin className="w-6 h-6 fill-primary/20 drop-shadow-md" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-xs text-white/80 bg-black/60 p-2 rounded-md backdrop-blur-sm w-fit border border-white/10">
                Área selecionada: {lat}, {lng}
              </div>
            </div>

            <Button
              onClick={handleAnalyse}
              disabled={status === 'loading'}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              size="lg"
            >
              {status === 'loading' ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processando Imagens...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Analisar Satélite
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Painel de Resultados */}
        <div className="space-y-6">
          {status === 'empty' && (
            <Card className="bg-black/50 border-white/5 border-dashed h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 transition-all duration-500 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-white/5">
                <Satellite className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma Análise Ativa</h3>
              <p className="text-sm text-zinc-400">
                Selecione uma área no mapa ao lado e clique em Analisar para obter os índices
                agronômicos.
              </p>
            </Card>
          )}

          {status === 'loading' && (
            <Card className="bg-black border-white/10 h-full min-h-[400px] overflow-hidden animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-1/2 bg-zinc-800" />
                <Skeleton className="h-4 w-3/4 bg-zinc-800/50" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4 bg-zinc-800" />
                  <Skeleton className="h-2 w-full bg-zinc-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 bg-zinc-800 rounded-xl" />
                  <Skeleton className="h-24 bg-zinc-800 rounded-xl" />
                </div>
                <Skeleton className="h-32 w-full bg-zinc-800 rounded-xl" />
              </CardContent>
            </Card>
          )}

          {status === 'error' && (
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500/20 text-red-400 animate-fade-in"
            >
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-red-400 font-semibold text-lg">
                Erro na Análise
              </AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-4">
                <p>
                  Não conseguimos processar as imagens de satélite para esta coordenada no momento.
                  O servidor pode estar indisponível.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyse}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30 w-fit"
                >
                  Tentar Novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <div className="space-y-4 animate-slide-up">
              <Card className="bg-black border-white/10 shadow-[0_0_15px_rgba(29,185,84,0.1)] overflow-hidden">
                <CardHeader className="bg-zinc-900/50 border-b border-white/5 pb-4">
                  <CardTitle className="text-white text-lg">Resultados da Análise</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* NDVI */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-300">Índice NDVI</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium border border-primary/20">
                          Saudável
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-white">{mockData.ndvi}</span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all duration-1000',
                          getNdviColor(mockData.ndvi),
                        )}
                        style={{ width: `${mockData.ndvi * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                      <span>0.0 (Crítico)</span>
                      <span>0.5 (Atenção)</span>
                      <span>1.0 (Ideal)</span>
                    </div>
                  </div>

                  {/* Cards de Métricas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <Droplets className="w-4 h-4" />
                        <span className="text-sm font-medium">Umidade Solo</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockData.umidade}%</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-orange-400 mb-2">
                        <Thermometer className="w-4 h-4" />
                        <span className="text-sm font-medium">Temperatura</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockData.temperatura}°C</p>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" /> Imagem Recente
                      </span>
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" /> {mockData.data}
                      </span>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video group">
                      <img
                        src={mockData.thumbnail}
                        alt="Satélite Thumbnail"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          Ampliar Imagem
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
