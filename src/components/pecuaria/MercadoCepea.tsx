import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface PriceData {
  indicator: string
  atual: number
  media: number
  date: string
}

export function MercadoCepea() {
  const [data, setData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data: res, error } = await supabase.functions.invoke('cepea-prices')
        if (res?.prices) {
          const indicators = ['Boi Gordo (Arroba)', 'Bezerro (Cabeça)']

          const mapped = indicators.map((ind) => {
            const priceInfo = res.prices[ind] || { atual: 0, media: 0 }
            return {
              indicator: ind,
              atual: priceInfo.atual || 0,
              media: priceInfo.media || 0,
              date: new Date().toLocaleDateString('pt-BR'),
            }
          })
          setData(mapped)
        }
      } catch (error) {
        console.error('Erro ao buscar preços do CEPEA:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  if (loading) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center bg-black/40 rounded-xl border border-primary/10 backdrop-blur-sm animate-fade-in-up">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Carregando dados do CEPEA...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      {data.map((item, i) => {
        const isUp = item.atual > item.media
        const isDown = item.atual < item.media
        const diff = Math.abs(item.atual - item.media)
        const diffPercent = item.media > 0 ? (diff / item.media) * 100 : 0

        return (
          <Card
            key={i}
            className="glass-panel border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_15px_rgba(29,185,84,0.1)] bg-black"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                {item.indicator}
                <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(29,185,84,0.2)]">
                  CEPEA
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black flex items-center gap-3 text-white mb-4">
                R$ {item.atual.toFixed(2)}
                {isUp ? (
                  <TrendingUp className="w-6 h-6 text-primary" />
                ) : isDown ? (
                  <TrendingDown className="w-6 h-6 text-destructive" />
                ) : (
                  <Minus className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Média do Período:</span>
                  <span className="font-bold text-white text-base">R$ {item.media.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Variação vs Média:</span>
                  <span
                    className={`font-bold ${isUp ? 'text-primary' : isDown ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    {isUp ? '+' : isDown ? '-' : ''}
                    {diffPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <p className="text-xs text-muted-foreground">Atualizado em: {item.date}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
