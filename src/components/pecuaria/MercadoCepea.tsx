import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface PriceData {
  indicator: string
  price: number
  variation: number
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
          const indicators = ['Boi Gordo (Arroba)', 'Bezerro (Cabeça)', 'Milho', 'Soja']

          const mapped = indicators.map((ind) => ({
            indicator: ind,
            price: res.prices[ind] || 0,
            variation: 0,
            date: new Date().toLocaleDateString(),
          }))
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
      {data.map((item, i) => (
        <Card
          key={i}
          className="glass-panel border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_15px_rgba(29,185,84,0.1)]"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.indicator}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center justify-between text-white">
              R$ {item.price.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ref: {item.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
