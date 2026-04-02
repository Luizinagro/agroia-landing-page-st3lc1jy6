import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineChart, TrendingUp, TrendingDown, DollarSign, BrainCircuit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'

const mockPrices: Record<string, { current: number; d30: number; d60: number }> = {
  Soja: { current: 2166, d30: 2210, d60: 2280 },
  Milho: { current: 1000, d30: 980, d60: 950 },
  Trigo: { current: 1400, d30: 1450, d60: 1520 },
}

export default function PrevisaoIA() {
  const [cultura, setCultura] = useState<string>('Soja')
  const [quantidade, setQuantidade] = useState<string>('')
  const [resultado, setResultado] = useState<{
    cultura: string
    quantidade: number
    precos: { current: number; d30: number; d60: number }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBuscarPreco = () => {
    if (!quantidade || isNaN(Number(quantidade))) return
    setIsLoading(true)
    setTimeout(() => {
      setResultado({ cultura, quantidade: Number(quantidade), precos: mockPrices[cultura] })
      setIsLoading(false)
    }, 800)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const containerRef = useRef<HTMLDivElement>(null)
  useGsapAnimations(containerRef)

  return (
    <div ref={containerRef} className="container mx-auto py-8 space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-primary">
          <BrainCircuit className="h-8 w-8 text-green-500" /> Previsão IA
        </h1>
        <p className="text-muted-foreground mt-1">
          Análise preditiva de preços de commodities com base em inteligência artificial.
        </p>
      </div>

      <div className="grid-asymmetric-2">
        <Card className="border-white/5 bg-card/60 backdrop-blur-md shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Consultar Previsão</CardTitle>
            <CardDescription>Insira os dados da sua produção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Cultura</Label>
              <Select value={cultura} onValueChange={setCultura}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione a cultura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soja">Soja</SelectItem>
                  <SelectItem value="Milho">Milho</SelectItem>
                  <SelectItem value="Trigo">Trigo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade (Toneladas)</Label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 100"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <Button
              className="w-full bg-agro-green hover:bg-agro-green-hover text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-400 ease-bounce"
              onClick={handleBuscarPreco}
              disabled={isLoading || !quantidade}
            >
              {isLoading ? 'Calculando Previsões...' : 'Buscar Preço'}
            </Button>
          </CardContent>
        </Card>

        <div>
          {resultado ? (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold border-b border-primary/10 pb-2 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Resultados para {resultado.quantidade} ton de {resultado.cultura}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 gsap-stagger-container">
                <Card className="border-primary/20 bg-card/60 backdrop-blur-sm gsap-stagger-item">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                      Preço Atual (R$/ton)
                      <DollarSign className="h-4 w-4 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(resultado.precos.current)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total: {formatCurrency(resultado.precos.current * resultado.quantidade)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card/60 backdrop-blur-sm relative overflow-hidden gsap-stagger-item">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <LineChart className="h-16 w-16" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                      Previsão 30 dias
                      {resultado.precos.d30 > resultado.precos.current ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(resultado.precos.d30)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total: {formatCurrency(resultado.precos.d30 * resultado.quantidade)}
                    </p>
                    <div
                      className={cn(
                        'text-xs font-medium mt-2',
                        resultado.precos.d30 > resultado.precos.current
                          ? 'text-green-500'
                          : 'text-red-500',
                      )}
                    >
                      {(
                        ((resultado.precos.d30 - resultado.precos.current) /
                          resultado.precos.current) *
                        100
                      ).toFixed(1)}
                      % vs Atual
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card/60 backdrop-blur-sm relative overflow-hidden gsap-stagger-item">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <LineChart className="h-16 w-16" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                      Previsão 60 dias
                      {resultado.precos.d60 > resultado.precos.current ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(resultado.precos.d60)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total: {formatCurrency(resultado.precos.d60 * resultado.quantidade)}
                    </p>
                    <div
                      className={cn(
                        'text-xs font-medium mt-2',
                        resultado.precos.d60 > resultado.precos.current
                          ? 'text-green-500'
                          : 'text-red-500',
                      )}
                    >
                      {(
                        ((resultado.precos.d60 - resultado.precos.current) /
                          resultado.precos.current) *
                        100
                      ).toFixed(1)}
                      % vs Atual
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.1)] gsap-grow">
                <CardContent className="p-5">
                  <p className="text-sm text-foreground/90 flex items-start gap-3">
                    <BrainCircuit className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Análise IA:</strong>{' '}
                      {resultado.precos.d60 > resultado.precos.current
                        ? `A tendência para ${resultado.cultura} é de alta nos próximos 60 dias. A inteligência artificial recomenda segurar a comercialização se possível para maximizar os lucros na safra atual.`
                        : `A tendência para ${resultado.cultura} é de baixa nos próximos 60 dias. A inteligência artificial recomenda realizar a comercialização no curto prazo para proteger a margem de lucro e evitar perdas.`}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-primary/20 rounded-xl p-8 bg-card/30 backdrop-blur-sm min-h-[300px]">
              <LineChart className="h-16 w-16 mb-4 opacity-20 text-primary" />
              <p className="text-center max-w-md">
                Preencha os dados da sua produção e clique em "Buscar Preço" para que nossa IA
                analise as tendências de mercado para você.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
