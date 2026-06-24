import { useState, useEffect } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { CalendarDays, MapPin, Loader2, AlertCircle, Sprout, DollarSign, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const ESTADOS = [
  'Acre',
  'Alagoas',
  'Amapá',
  'Amazonas',
  'Bahia',
  'Ceará',
  'Distrito Federal',
  'Espírito Santo',
  'Goiás',
  'Maranhão',
  'Mato Grosso',
  'Mato Grosso do Sul',
  'Minas Gerais',
  'Pará',
  'Paraíba',
  'Paraná',
  'Pernambuco',
  'Piauí',
  'Rio de Janeiro',
  'Rio Grande do Norte',
  'Rio Grande do Sul',
  'Rondônia',
  'Roraima',
  'Santa Catarina',
  'São Paulo',
  'Sergipe',
  'Tocantins',
]
const CULTURAS = ['Soja', 'Milho', 'Trigo', 'Café', 'Cana-de-açúcar', 'Algodão', 'Feijão', 'Arroz']

export default function CalendarioAgricola() {
  const { user } = useAuth() as any
  const [cultura, setCultura] = useState('Soja')
  const [estado, setEstado] = useState('Mato Grosso')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    async function loadProp() {
      if (!user) return
      const { data: props } = await supabase
        .from('propriedades')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
      if (props && props.length > 0) {
        setCultura(
          CULTURAS.includes(props[0].cultura_principal) ? props[0].cultura_principal : 'Soja',
        )
        if (props[0].estado) setEstado(props[0].estado)
        setCoords({ lat: props[0].latitude, lon: props[0].longitude })
      }
    }
    loadProp()
  }, [user])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const { data: result, error } = await supabase.functions.invoke('calendario-agricola', {
        body: { cultura, estado, latitude: coords?.lat, longitude: coords?.lon },
      })
      if (error || !result.success) throw new Error(result?.error || error?.message)
      setData(result.data)
      toast.success('Calendário gerado com sucesso!')
    } catch (e) {
      console.error(e)
      toast.error('Serviço temporariamente indisponível. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in w-full">
      <SEO title="Calendário Agrícola" description="Planejamento inteligente para sua safra." />

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary" />
            Calendário Agrícola IA
          </h1>
          <p className="text-[#A0A0A0] mt-2">
            Planejamento e visão financeira baseados na sua região.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-end border border-primary/20">
        <div className="w-full">
          <label className="text-sm text-zinc-400 mb-2 block">Cultura</label>
          <select
            value={cultura}
            onChange={(e) => setCultura(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary"
          >
            {CULTURAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label className="text-sm text-zinc-400 mb-2 block">Estado/Região</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full md:w-auto h-[50px] bg-primary text-black font-bold px-8 rounded-xl shadow-[0_0_15px_rgba(29,185,84,0.3)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="hidden sm:inline">
                Gerando análise com IA, pode levar até 15 segundos...
              </span>
              <span className="sm:hidden">Gerando análise...</span>
            </>
          ) : (
            'Gerar Calendário'
          )}
        </Button>
      </div>

      {data && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sprout className="w-32 h-32 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white mb-6">
                Situação Atual: {data.status_atual?.fase}
              </h2>
              <p className="text-zinc-300 text-lg mb-6 max-w-xl">{data.status_atual?.descricao}</p>
              <div className="flex gap-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border ${data.status_atual?.urgencia === 'alta' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}
                >
                  Urgência: {data.status_atual?.urgencia?.toUpperCase()}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white/5 text-zinc-300 border border-white/10">
                  Próxima fase em {data.status_atual?.dias_para_proxima_fase} dias
                </span>
              </div>
            </div>

            <div
              className={`p-8 rounded-[2rem] border ${data.janela_plantio?.aberta_agora ? 'bg-primary/10 border-primary/30' : 'bg-zinc-900 border-white/10'}`}
            >
              <h3 className="font-bold text-white mb-4">Janela de Plantio</h3>
              {data.janela_plantio?.aberta_agora ? (
                <div className="text-primary font-black text-2xl mb-2 flex items-center gap-2">
                  ✅ Aberta agora
                </div>
              ) : (
                <div className="text-zinc-400 font-bold text-xl mb-2">Fechada</div>
              )}
              <p className="text-sm text-zinc-300 mb-4">{data.janela_plantio?.recomendacao}</p>
              <p className="text-xs text-zinc-500 font-mono">
                Período Ideal: {data.janela_plantio?.inicio_ideal} a{' '}
                {data.janela_plantio?.fim_ideal}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Produtividade Média</p>
                <p className="text-lg font-bold text-white">{data.produtividade_media_regiao}</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Custo Estimado/ha</p>
                <p className="text-lg font-bold text-white">{data.custo_estimado_ha}</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Receita Estimada/ha</p>
                <p className="text-lg font-bold text-white">{data.receita_estimada_ha}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-6 text-xl">Próximas Atividades</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.proximas_atividades?.map((ativ: any, i: number) => (
                <div key={i} className="bg-black/50 border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <Clock className="w-5 h-5 text-zinc-400" />
                    <span
                      className={`w-2 h-2 rounded-full ${ativ.prioridade === 'alta' ? 'bg-red-500' : ativ.prioridade === 'media' ? 'bg-yellow-500' : 'bg-primary'}`}
                    />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">{ativ.atividade}</h4>
                  <p className="text-xs text-zinc-500">{ativ.prazo}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-6 text-xl">Linha do Tempo Anual</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {data.calendario_anual?.map((mes: any, i: number) => (
                <div
                  key={i}
                  className="min-w-[250px] bg-black/50 border border-white/10 p-5 rounded-2xl shrink-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-white">{mes.mes}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${mes.cor === 'verde' ? 'text-primary border-primary/30' : mes.cor === 'amarelo' ? 'text-yellow-400 border-yellow-400/30' : 'text-blue-400 border-blue-400/30'}`}
                    >
                      {mes.fase}
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {mes.atividades?.map((a: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-primary">•</span> <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                  {mes.alertas?.length > 0 && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-200">
                      <AlertCircle className="w-4 h-4 mb-1 text-red-500" />
                      {mes.alertas[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
