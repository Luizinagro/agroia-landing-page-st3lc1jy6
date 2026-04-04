import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'

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
    // Simulate fast async load to prevent tab blocking
    const timer = setTimeout(() => {
      setData([
        {
          indicator: 'Boi Gordo (Arroba)',
          price: 235.5,
          variation: 1.2,
          date: new Date().toLocaleDateString(),
        },
        {
          indicator: 'Bezerro (Cabeça)',
          price: 1980.0,
          variation: -0.5,
          date: new Date().toLocaleDateString(),
        },
        {
          indicator: 'Milho (Saca 60kg)',
          price: 58.2,
          variation: 0.0,
          date: new Date().toLocaleDateString(),
        },
        {
          indicator: 'Soja (Saca 60kg)',
          price: 125.4,
          variation: 2.1,
          date: new Date().toLocaleDateString(),
        },
      ])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
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
              <span
                className={`text-sm flex items-center ${
                  item.variation > 0
                    ? 'text-green-500'
                    : item.variation < 0
                      ? 'text-red-500'
                      : 'text-gray-400'
                }`}
              >
                {item.variation > 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : item.variation < 0 ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : (
                  <Minus className="w-4 h-4 mr-1" />
                )}
                {Math.abs(item.variation)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ref: {item.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
