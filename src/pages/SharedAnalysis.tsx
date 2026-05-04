import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Satellite, Droplets, Thermometer, Calendar, MapPin } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

export default function SharedAnalysis() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const { data: analysis, error } = await supabase
          .from('satellite_analyses')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setData(analysis)
      } catch (e) {
        console.error('Error fetching shared analysis:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Satellite className="w-12 h-12 text-primary animate-pulse" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <Satellite className="w-16 h-16 text-zinc-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Análise não encontrada</h2>
        <p className="text-zinc-400 mb-6">O link pode estar quebrado ou a análise foi removida.</p>
        <Link to="/" className="text-primary hover:underline font-medium">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const getNdviColor = (value: number) => {
    if (value < 0.4) return 'text-red-500'
    if (value <= 0.6) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl space-y-8 relative z-10 animate-fade-in-up">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="text-center md:text-right">
            <h1 className="text-xl font-bold text-white">Relatório Agronômico Compartilhado</h1>
            <p className="text-sm text-zinc-400">Gerado via AgroIA</p>
          </div>
        </header>

        <Card className="bg-zinc-900/60 border-white/10 overflow-hidden backdrop-blur-md shadow-2xl">
          <CardHeader className="bg-black/50 border-b border-white/5 py-4">
            <CardTitle className="flex items-center justify-between text-base font-medium">
              <span className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-5 h-5 text-primary" />
                Coordenadas Analisadas
              </span>
              <span className="text-white bg-black px-3 py-1 rounded-md border border-white/10">
                {data.latitude}, {data.longitude}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="space-y-3 bg-black/40 p-6 rounded-2xl border border-white/5">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Índice NDVI (Saúde Vegetal)
                </span>
                <div className="flex items-end gap-4">
                  <p
                    className={cn(
                      'text-6xl font-extrabold tracking-tighter',
                      getNdviColor(data.ndvi_value),
                    )}
                  >
                    {data.ndvi_value}
                  </p>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-4">
                  <div
                    className={cn(
                      'h-full transition-all',
                      getNdviColor(data.ndvi_value).replace('text-', 'bg-'),
                    )}
                    style={{ width: `${data.ndvi_value * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-blue-400 mb-3">
                    <Droplets className="w-5 h-5" />
                    <span className="text-sm font-medium">Umidade Solo</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{data.soil_moisture}%</p>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-orange-400 mb-3">
                    <Thermometer className="w-5 h-5" />
                    <span className="text-sm font-medium">Temperatura</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{data.temperature}°C</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400 font-medium">Imagem Espectral</span>
                <span className="text-white flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                  <Calendar className="w-4 h-4 text-primary" />{' '}
                  {new Date(data.analysis_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] shadow-inner bg-black">
                <img
                  src={data.image_url}
                  alt="Satélite Thumbnail"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 pb-12">
          <p className="text-zinc-500 text-sm">
            Este relatório foi gerado e compartilhado através da plataforma AgroIA.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-primary hover:underline text-sm font-medium"
          >
            Conheça as soluções da AgroIA
          </Link>
        </div>
      </div>
    </div>
  )
}
