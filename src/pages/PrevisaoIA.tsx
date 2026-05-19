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
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
  Bot,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function PrevisaoIA() {
  const [cultura, setCultura] = useState<string>('Soja')
  const [quantidade, setQuantidade] = useState<string>('')
  const [resultado, setResultado] = useState<{
    cultura: string
    quantidadeSacas: number
    precosSaca: { current: number; d30: number; d60: number }
    recommendation: string
  } | null>(null)

  const [isLoadingSaca, setIsLoadingSaca] = useState(false)
  const [isLoadingIA, setIsLoadingIA] = useState(false)

  const [precoSacaData, setPrecoSacaData] = useState<{
    preco_saca: number
    quantidade: number
    valor_total: number
    data_atualizacao: string
  } | null>(null)
  const [precoSacaError, setPrecoSacaError] = useState<string | null>(null)

  const { toast } = useToast()

  const handleBuscarPreco = async () => {
    if (!quantidade || isNaN(Number(quantidade))) return

    setIsLoadingSaca(true)
    setIsLoadingIA(true)
    setPrecoSacaError(null)
    setPrecoSacaData(null)
    setResultado(null)

    let precoReal = 0

    // Busca o preço real na CEPEA primeiro
    try {
      const { data, error } = await supabase.functions.invoke('buscar-preco-saca', {
        body: { cultura, quantidade: Number(quantidade) },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      setPrecoSacaData(data)
      precoReal = data.preco_saca
    } catch (err: any) {
      console.error(err)
      setPrecoSacaError(
        err.message || 'Não conseguimos buscar o preço no momento. Tente novamente.',
      )
    } finally {
      setIsLoadingSaca(false)
    }

    // Busca a previsão da IA informando o preço real base
    try {
      const { data, error } = await supabase.functions.invoke('gemini-forecast', {
        body: { commodity: cultura, current_price_saca: precoReal || undefined },
      })

      if (error) throw error

      if (data?.data) {
        const trendData = data.data.trend_data || []
        const currentSaca = data.data.current_price

        const d30Index = Math.min(29, trendData.length - 1)
        const d60Index = Math.min(59, trendData.length - 1)

        setResultado({
          cultura,
          quantidadeSacas: Number(quantidade),
          precosSaca: {
            current: currentSaca,
            d30: data.data.previsao_30d || trendData[d30Index]?.price || currentSaca,
            d60: data.data.previsao_60d || trendData[d60Index]?.price || currentSaca,
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
      setIsLoadingIA(false)
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
                      <SelectItem value="Algodão">Algodão</SelectItem>
                      <SelectItem value="Café">Café</SelectItem>
                      <SelectItem value="Cana-de-açúcar">Cana-de-açúcar</SelectItem>
                      <SelectItem value="Milho">Milho</SelectItem>
                      <SelectItem value="Soja">Soja</SelectItem>
                      <SelectItem value="Trigo">Trigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#FFFFFF] font-semibold">
                    Quantidade (Sacas por alqueire/Hectare)
                  </Label>
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
                  disabled={isLoadingSaca || isLoadingIA || !quantidade}
                >
                  {isLoadingSaca || isLoadingIA ? (
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

          <div className="lg:col-span-8 space-y-6">
            {(isLoadingSaca || precoSacaData || precoSacaError) && (
              <div className="w-full">
                {isLoadingSaca ? (
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#1DB954] to-[#00B4D8] animate-pulse shadow-lg">
                    <div className="bg-[#050505] rounded-xl p-6 space-y-4">
                      <Skeleton className="h-6 w-1/3 bg-[#1DB954]/20" />
                      <Skeleton className="h-10 w-1/4 bg-[#1DB954]/20" />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Skeleton className="h-12 w-full bg-[#1DB954]/20" />
                        <Skeleton className="h-12 w-full bg-[#1DB954]/20" />
                      </div>
                    </div>
                  </div>
                ) : precoSacaError ? (
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
                    <div className="bg-[#050505] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                      <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                      <p className="text-red-400 font-medium text-lg">{precoSacaError}</p>
                    </div>
                  </div>
                ) : precoSacaData ? (
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#1DB954] to-[#00B4D8] shadow-[0_0_20px_rgba(0,180,216,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(29,185,84,0.25)]">
                    <div className="bg-[#050505] rounded-xl p-6 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                          <h3 className="text-sm font-bold text-[#E0E0E0] mb-2 flex items-center gap-2 uppercase tracking-wider">
                            Cotação Atual (CEPEA)
                            <DollarSign className="h-4 w-4 text-[#00B4D8]" />
                          </h3>
                          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#00B4D8]">
                            {formatCurrency(precoSacaData.preco_saca)}{' '}
                            <span className="text-sm text-[#A0A0A0] font-normal">/ unidade</span>
                          </div>
                        </div>
                        <div className="flex gap-8 bg-[#000000] p-4 rounded-lg border border-[#1DB954]/10">
                          <div>
                            <p className="text-xs text-[#A0A0A0] mb-1 uppercase tracking-wider">
                              Quantidade
                            </p>
                            <p className="text-xl font-semibold text-[#FFFFFF]">
                              {precoSacaData.quantidade}
                            </p>
                          </div>
                          <div className="w-[1px] bg-[#1DB954]/20"></div>
                          <div>
                            <p className="text-xs text-[#A0A0A0] mb-1 uppercase tracking-wider">
                              Valor Total
                            </p>
                            <p className="text-xl font-semibold text-[#1DB954]">
                              {formatCurrency(precoSacaData.valor_total)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#1DB954]/20 text-xs text-[#A0A0A0] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></span>
                          Atualizado em:{' '}
                          {new Date(precoSacaData.data_atualizacao).toLocaleString('pt-BR')}
                        </span>
                        <span className="text-[#00B4D8] font-medium">Mercado Real</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {isLoadingIA && !resultado && !precoSacaError && (
              <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#1DB954] to-[#00B4D8] animate-pulse shadow-lg mt-6">
                <div className="bg-[#050505] rounded-xl p-6 space-y-4">
                  <Skeleton className="h-6 w-1/3 bg-[#1DB954]/20" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Skeleton className="h-24 w-full bg-[#1DB954]/20" />
                    <Skeleton className="h-24 w-full bg-[#1DB954]/20" />
                    <Skeleton className="h-24 w-full bg-[#1DB954]/20" />
                  </div>
                  <Skeleton className="h-20 w-full bg-[#1DB954]/20 mt-4" />
                </div>
              </div>
            )}

            {resultado && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-[#1DB954]/20 pb-2 flex items-center gap-2 text-[#FFFFFF]">
                  <LineChart className="h-5 w-5 text-[#1DB954]" />
                  Resultados para {resultado.quantidadeSacas} de {resultado.cultura}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-[#050505] border-[#1DB954]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#E0E0E0] flex items-center justify-between">
                        Preço Atual (R$)
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
                    <p className="text-sm text-[#FFFFFF] flex items-start gap-3 font-medium leading-relaxed">
                      <Bot className="h-6 w-6 text-[#1DB954] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#1DB954]">Análise IA:</strong>{' '}
                        {resultado.recommendation}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {!isLoadingSaca && !isLoadingIA && !precoSacaData && !precoSacaError && !resultado && (
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
