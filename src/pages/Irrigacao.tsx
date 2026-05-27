import { useState, useEffect } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import {
  Droplet,
  Loader2,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Irrigacao() {
  const { user } = useAuth()
  const [cultura, setCultura] = useState('Soja')
  const [area, setArea] = useState(100)
  const [sistema, setSistema] = useState('Gotejamento')
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
        setCultura(props[0].cultura_principal)
        setCoords({ lat: props[0].latitude, lon: props[0].longitude })
      }
    }
    loadProp()
  }, [user])

  const handleSimular = async () => {
    setLoading(true)
    try {
      const { data: res, error } = await supabase.functions.invoke('calcular-irrigacao', {
        body: {
          latitude: coords?.lat || -12,
          longitude: coords?.lon || -50,
          cultura,
          area_hectares: area,
          sistema_irrigacao: sistema,
        },
      })
      if (error) throw error
      setData(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getDecisionColor = (necessidade: string) => {
    if (necessidade?.includes('Não'))
      return 'from-[#0f3a1f] to-[#051c0d] border-green-500/30 text-green-400'
    if (necessidade?.includes('leve'))
      return 'from-[#42310b] to-[#1a1303] border-yellow-500/30 text-yellow-400'
    return 'from-[#3a0f0f] to-[#1c0505] border-red-500/30 text-red-400'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in w-full">
      <SEO title="Smart Irrigation" description="Recomendações baseadas no balanço hídrico." />

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Droplet className="w-8 h-8 text-primary" />
            Smart Irrigation
          </h1>
          <p className="text-[#A0A0A0] mt-2">
            Balanço hídrico e decisão de irrigação via dados climáticos reais.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-end border border-primary/20">
        <div className="w-full">
          <label className="text-sm text-zinc-400 mb-2 block">Cultura</label>
          <input
            value={cultura}
            onChange={(e) => setCultura(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
          />
        </div>
        <div className="w-full">
          <label className="text-sm text-zinc-400 mb-2 block">Área (ha)</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
          />
        </div>
        <div className="w-full">
          <label className="text-sm text-zinc-400 mb-2 block">Sistema</label>
          <select
            value={sistema}
            onChange={(e) => setSistema(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
          >
            <option>Gotejamento</option>
            <option>Aspersão</option>
            <option>Pivô Central</option>
          </select>
        </div>
        <Button
          onClick={handleSimular}
          disabled={loading || !coords}
          className="w-full md:w-auto h-[50px] bg-primary text-black font-bold px-8 rounded-xl shadow-[0_0_15px_rgba(29,185,84,0.3)]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analisar Campo'}
        </Button>
      </div>

      {data && (
        <div className="space-y-6 animate-fade-in-up">
          <div
            className={`p-10 rounded-[2.5rem] bg-gradient-to-br border ${getDecisionColor(data.decisao.necessidade)} shadow-2xl relative overflow-hidden flex flex-col items-center text-center`}
          >
            <div className="absolute opacity-5 -top-10 -right-10">
              <Droplet className="w-64 h-64" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 tracking-wide uppercase">
              {data.decisao.necessidade}
            </h2>
            <p className="text-5xl md:text-7xl font-black text-white my-4">
              {data.decisao.litros_por_m2}{' '}
              <span className="text-2xl opacity-70 font-normal">L/m²</span>
            </p>
            <p className="text-lg opacity-80 mt-2 font-medium">
              Volume total: {data.decisao.volume_total_m3.toLocaleString('pt-BR')} m³ na área
            </p>
            {data.decisao.litros_por_m2 > 0 && (
              <p className="mt-4 bg-black/40 px-6 py-2 rounded-full text-sm font-bold border border-white/10">
                Horário recomendado: {data.decisao.melhor_horario}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-center text-center">
              <Thermometer className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-white">{data.condicoes_atuais.temperatura}°</p>
              <p className="text-xs text-zinc-500">Temperatura</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-center text-center">
              <Droplet className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">
                {data.balanco_hidrico.umidade_solo_pct}%
              </p>
              <p className="text-xs text-zinc-500">Umidade Solo (3-9cm)</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-center text-center">
              <Wind className="w-6 h-6 text-zinc-400 mb-2" />
              <p className="text-2xl font-bold text-white">{data.balanco_hidrico.et0_hoje}mm</p>
              <p className="text-xs text-zinc-500">ET₀ (Evaporação)</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-center text-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
              <p className="text-2xl font-bold text-white">
                {data.balanco_hidrico.deficit_hidrico}mm
              </p>
              <p className="text-xs text-zinc-500">Déficit Hídrico</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-primary/30 relative overflow-hidden bg-[#001005]">
            <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">🤖 Consultor IA</h3>
            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {data.recomendacao_ia}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-6">Previsão 7 Dias</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {data.previsao_7_dias.map((prev: any, i: number) => (
                <div
                  key={i}
                  className={`min-w-[120px] border p-4 rounded-2xl text-center shrink-0 ${prev.irrigar ? 'bg-red-950/20 border-red-900/50' : 'bg-black border-white/5'}`}
                >
                  <p className="text-sm font-bold text-zinc-300 mb-3">{prev.data}</p>
                  {prev.irrigar ? (
                    <Droplet className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  )}
                  <p className="text-xs text-zinc-500 mt-2">Chuva: {prev.chuva_prevista}mm</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-600 text-center flex items-center justify-center gap-1 mt-4">
            <Info className="w-3 h-3" /> Fonte: Open-Meteo — dados reais de satélite.
          </p>
        </div>
      )}
    </div>
  )
}
