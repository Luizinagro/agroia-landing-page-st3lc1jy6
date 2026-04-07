import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  BrainCircuit,
  Sprout,
  TestTube,
  Tractor,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface RecommendationData {
  recomendacao_plantio: string
  recomendacao_insumo: string
  recomendacao_manejo: string
  urgencia: 'alta' | 'média' | 'media' | 'baixa'
}

export function IntelligentRecommendationsWidget() {
  const [data, setData] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: userAuth } = await supabase.auth.getUser()

      // Payload base para garantir que sempre retorne algo (fallback)
      let payload = {
        cultura: 'Soja (Padrão)',
        clima: { temperatura: 28, umidade: 65, precipitacao: 15 },
        solo: { tipo: 'Argiloso', ph: 6.2, nivel_umidade: 'Adequado' },
        historico: 'Produtividade anterior de 65 sc/ha. Histórico leve de estresse hídrico.',
      }

      if (userAuth?.user?.id) {
        // Tenta buscar a propriedade principal do usuário
        const { data: props } = await supabase
          .from('propriedades')
          .select('*')
          .eq('user_id', userAuth.user.id)
          .limit(1)

        if (props && props.length > 0) {
          const p = props[0]
          payload.cultura = p.cultura_principal || payload.cultura

          // Tenta buscar o clima mais recente dessa propriedade
          const { data: clima } = await supabase
            .from('clima')
            .select('*')
            .eq('propriedade_id', p.id)
            .order('data_atualizacao', { ascending: false })
            .limit(1)

          if (clima && clima.length > 0) {
            payload.clima = {
              temperatura: clima[0].temperatura,
              umidade: clima[0].umidade,
              precipitacao: clima[0].precipitacao,
            }
          }
        }
      }

      const { data: result, error: funcError } = await supabase.functions.invoke(
        'gemini-recomendacoes',
        {
          body: payload,
        },
      )

      if (funcError) throw funcError
      if (result?.error) throw new Error(result.error)

      if (result?.data) {
        setData(result.data)
      } else {
        throw new Error('Formato de resposta inválido retornado pela IA.')
      }
    } catch (err: any) {
      console.error('Erro ao buscar recomendações:', err)
      setError(err.message || 'Falha ao processar as recomendações inteligentes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const getUrgencyBadge = (urgencia: string) => {
    const u = urgencia.toLowerCase()
    if (u === 'alta') {
      return (
        <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-3.5 h-3.5" /> Urgência Alta
        </span>
      )
    }
    if (u === 'média' || u === 'media') {
      return (
        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
          <AlertTriangle className="w-3.5 h-3.5" /> Urgência Média
        </span>
      )
    }
    return (
      <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(29,185,84,0.2)]">
        <CheckCircle2 className="w-3.5 h-3.5" /> Monitoramento
      </span>
    )
  }

  return (
    <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-primary via-emerald-500 to-blue-600 shadow-[0_0_25px_rgba(29,185,84,0.15)] group transition-all duration-500 hover:shadow-[0_0_35px_rgba(29,185,84,0.25)]">
      <div className="bg-black/95 backdrop-blur-xl rounded-[23px] p-6 sm:p-8 h-full w-full flex flex-col relative overflow-hidden">
        {/* Glow em background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-primary/10 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-600/10 blur-[60px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-inner">
              <BrainCircuit className="w-7 h-7 text-primary animate-pulse-slow" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Recomendações Inteligentes
              </h2>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                Análise preditiva gerada por Gemini AI 2.5
              </p>
            </div>
          </div>
          {data && !loading && !error && (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {getUrgencyBadge(data.urgencia)}
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchRecommendations}
                className="rounded-full text-zinc-400 hover:text-primary hover:bg-primary/10 transition-colors"
                title="Atualizar recomendações"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl bg-zinc-800" />
                    <Skeleton className="h-5 w-24 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                  <Skeleton className="h-4 w-4/6 bg-zinc-800" />
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 py-10">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <div>
                <p className="text-white font-medium mb-1">
                  Não foi possível carregar as recomendações.
                </p>
                <p className="text-sm text-zinc-400">{error}</p>
              </div>
              <Button
                onClick={fetchRecommendations}
                className="mt-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 rounded-full"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {data && !loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plantio */}
              <div className="bg-zinc-950/80 border border-emerald-900/30 hover:border-emerald-500/50 transition-colors duration-300 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Sprout className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-emerald-100">Fase de Plantio</h3>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{data.recomendacao_plantio}</p>
              </div>

              {/* Insumos */}
              <div className="bg-zinc-950/80 border border-blue-900/30 hover:border-blue-500/50 transition-colors duration-300 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <TestTube className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-100">Insumos & Correção</h3>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{data.recomendacao_insumo}</p>
              </div>

              {/* Manejo */}
              <div className="bg-zinc-950/80 border border-amber-900/30 hover:border-amber-500/50 transition-colors duration-300 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Tractor className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-amber-100">Tratos & Manejo</h3>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{data.recomendacao_manejo}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
