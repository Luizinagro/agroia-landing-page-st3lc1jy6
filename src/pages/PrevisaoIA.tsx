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
import { LineChart, TrendingUp, TrendingDown, DollarSign, Loader2, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function PrevisaoIA() {
  const [cultura, setCultura] = useState<string>('Soja')
  const [quantidade, setQuantidade] = useState<string>('')
  const [resultado, setResultado] = useState<{
    cultura: string
    quantidadeSacas: number
    precosSaca: { current: number; d30: number; d60: number }
    recommendation: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBuscarPreco = async () => {
    if (!quantidade || isNaN(Number(quantidade))) return
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('gemini-forecast', {
        body: { commodity: cultura },
      })

      if (error) throw error

      if (data?.data) {
        const trendData = data.data.trend_data || []
        const currentTon = data.data.current_price
        const precoSacaAtual = currentTon * 0.06

        // Safety check to ensure we don't go out of bounds
        const d30Index = Math.min(29, trendData.length - 1)
        const d60Index = Math.min(59, trendData.length - 1)

        setResultado({
          cultura,
          quantidadeSacas: Number(quantidade),
          precosSaca: {
            current: precoSacaAtual,
            d30: (trendData[d30Index]?.price || currentTon) * 0.06,
            d60: (trendData[d60Index]?.price || currentTon) * 0.06,
          },
          recommendation: data.data.recommendation,
        })
      } else {
        throw new Error('Dados inválidos retornados pela IA')
      }
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erro ao buscar previsão',
        description: 'Não foi possível gerar a previsão com IA no momento.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans">
      <main className="flex-1 container py-8 mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Previsão IA
            </h1>
            <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
              Antecipe o mercado com inteligência artificial. Obtenha projeções precisas de preços
              para soja, milho e trigo e maximize seus lucros.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card className="bg-[#050505] border-[#1DB954]/20 h-fit">
              <CardHeader>
                <CardTitle className="text-[#FFFFFF] font-bold">Consultar Previsão</CardTitle>
                <CardDescription className="text-[#E0E0E0] font-medium">
                  Insira os dados da sua produção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#FFFFFF] font-semibold">Cultura</Label>
                  <Select value={cultura} onValueChange={setCultura}>
                    <SelectTrigger className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus:ring-[#1DB954]">
                      <SelectValue placeholder="Selecione a cultura" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050505] border-[#1DB954]/20 text-[#FFFFFF]">
                      <SelectItem value="Soja">Soja</SelectItem>
                      <SelectItem value="Milho">Milho</SelectItem>
                      <SelectItem value="Trigo">Trigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#FFFFFF] font-semibold">Quantidade (Sacas de 60kg)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Ex: 1000"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
                  />
                </div>

                <Button
                  className="w-full btn-agro-primary font-bold"
                  onClick={handleBuscarPreco}
                  disabled={isLoading || !quantidade}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculando Previsões...
                    </>
                  ) : (
                    'Buscar Preço'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            {resultado ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-[#1DB954]/20 pb-2 flex items-center gap-2 text-[#FFFFFF]">
                  <LineChart className="h-5 w-5 text-[#1DB954]" />
                  Resultados para {resultado.quantidadeSacas} sacas de {resultado.cultura}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-[#050505] border-[#1DB954]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#E0E0E0] flex items-center justify-between">
                        Preço Atual (R$/saca)
                        <DollarSign className="h-4 w-4 text-[#1DB954]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#FFFFFF]">
                        {formatCurrency(resultado.precosSaca.current)}
                      </div>
                      <p className="text-xs text-[#E0E0E0] mt-1 font-medium">
                        Total:{' '}
                        {formatCurrency(resultado.precosSaca.current * resultado.quantidadeSacas)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#050505] border-[#1DB954]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <LineChart className="h-16 w-16 text-[#1DB954]" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#E0E0E0] flex items-center justify-between">
                        Previsão 30 dias
                        {resultado.precosSaca.d30 > resultado.precosSaca.current ? (
                          <TrendingUp className="h-4 w-4 text-[#1DB954]" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#FFFFFF]">
                        {formatCurrency(resultado.precosSaca.d30)}
                      </div>
                      <p className="text-xs text-[#E0E0E0] mt-1 font-medium">
                        Total:{' '}
                        {formatCurrency(resultado.precosSaca.d30 * resultado.quantidadeSacas)}
                      </p>
                      <div
                        className={cn(
                          'text-xs font-bold mt-2',
                          resultado.precosSaca.d30 > resultado.precosSaca.current
                            ? 'text-[#1DB954]'
                            : 'text-red-500',
                        )}
                      >
                        {(
                          ((resultado.precosSaca.d30 - resultado.precosSaca.current) /
                            resultado.precosSaca.current) *
                          100
                        ).toFixed(1)}
                        % vs Atual
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#050505] border-[#1DB954]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <LineChart className="h-16 w-16 text-[#1DB954]" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#E0E0E0] flex items-center justify-between">
                        Previsão 60 dias
                        {resultado.precosSaca.d60 > resultado.precosSaca.current ? (
                          <TrendingUp className="h-4 w-4 text-[#1DB954]" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#FFFFFF]">
                        {formatCurrency(resultado.precosSaca.d60)}
                      </div>
                      <p className="text-xs text-[#E0E0E0] mt-1 font-medium">
                        Total:{' '}
                        {formatCurrency(resultado.precosSaca.d60 * resultado.quantidadeSacas)}
                      </p>
                      <div
                        className={cn(
                          'text-xs font-bold mt-2',
                          resultado.precosSaca.d60 > resultado.precosSaca.current
                            ? 'text-[#1DB954]'
                            : 'text-red-500',
                        )}
                      >
                        {(
                          ((resultado.precosSaca.d60 - resultado.precosSaca.current) /
                            resultado.precosSaca.current) *
                          100
                        ).toFixed(1)}
                        % vs Atual
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-[#1DB954]/5 border-[#1DB954]/30 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
                  <CardContent className="p-5">
                    <p className="text-sm text-[#FFFFFF] flex items-start gap-3 font-medium">
                      <Bot className="h-6 w-6 text-[#1DB954] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#1DB954]">Análise IA:</strong>{' '}
                        {resultado.recommendation}{' '}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#E0E0E0] border-2 border-dashed border-[#1DB954]/20 rounded-xl p-8 bg-[#050505] min-h-[300px]">
                <LineChart className="h-16 w-16 mb-4 text-[#1DB954]/50" />
                <p className="text-center max-w-md font-medium">
                  Preencha os dados da sua produção e clique em "Buscar Preço" para que nossa IA
                  analise as tendências de mercado para você.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
