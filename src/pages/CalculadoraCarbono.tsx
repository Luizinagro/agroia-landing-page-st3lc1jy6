import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Leaf, Loader2, CheckCircle2, TrendingUp, Info, DollarSign } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'

const PRATICAS = [
  'Plantio Direto',
  'Rotação de Culturas',
  'Cobertura do Solo',
  'Redução de Defensivos Sintéticos',
  'Integração Lavoura-Pecuária-Floresta (ILPF)',
]

export default function CalculadoraCarbono() {
  const { hasFeature, loading: planLoading } = useSubscription()
  const [area, setArea] = useState(100)
  const [cultura, setCultura] = useState('Soja')
  const [bioma, setBioma] = useState('Cerrado')
  const [estado, setEstado] = useState('MT')
  const [praticas, setPraticas] = useState<string[]>([])
  const [anos, setAnos] = useState([3])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  if (planLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )

  if (!hasFeature('calculadora-carbono')) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center w-full animate-fade-in">
        <div className="max-w-2xl w-full text-center space-y-8 glass-panel p-10 rounded-[2rem] border border-primary/20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(29,185,84,0.3)]">
            <Leaf className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Descubra quanto dinheiro extra sua fazenda pode gerar vendendo créditos de carbono para
            o mundo 🌍
          </h1>
          <p className="text-[#A0A0A0] text-lg">
            Esta funcionalidade exclusiva simula seu potencial financeiro, aponta as melhores
            práticas e guia você no mercado de carbono global.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(29,185,84,0.4)]"
          >
            <Link to="/planos">Ver Planos e Fazer Upgrade →</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSimular = async () => {
    setLoading(true)
    try {
      const { data: res, error } = await supabase.functions.invoke('calculadora-carbono', {
        body: {
          area_hectares: area,
          cultura,
          praticas_sustentaveis: praticas,
          anos_pratica: anos[0],
          bioma,
          estado,
        },
      })
      if (error || !res.success) throw new Error(res?.error || error?.message)
      setData(res.data)
      toast.success('Simulação de carbono concluída!')
    } catch (e) {
      console.error(e)
      toast.error('Serviço temporariamente indisponível. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in w-full">
      <SEO
        title="Calculadora de Carbono"
        description="Simule o potencial de créditos de carbono."
      />

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Leaf className="w-8 h-8 text-primary" />
            Potencial de Carbono
          </h1>
          <p className="text-[#A0A0A0] mt-2">
            Converta sustentabilidade em uma nova fonte de receita.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-panel p-6 rounded-[2rem] space-y-6">
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Área Produtiva (hectares)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Bioma</label>
            <select
              value={bioma}
              onChange={(e) => setBioma(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
            >
              <option>Cerrado</option>
              <option>Amazônia</option>
              <option>Mata Atlântica</option>
              <option>Pampa</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Práticas Implementadas</label>
            <div className="space-y-3 mt-3">
              {PRATICAS.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox
                    id={p}
                    checked={praticas.includes(p)}
                    onCheckedChange={(c) => {
                      if (c) setPraticas([...praticas, p])
                      else setPraticas(praticas.filter((x) => x !== p))
                    }}
                  />
                  <label
                    htmlFor={p}
                    className="text-sm font-medium leading-none text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {p}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-4">
              Anos Praticando ({anos[0]} anos)
            </label>
            <Slider value={anos} onValueChange={setAnos} max={20} step={1} className="py-2" />
          </div>
          <Button
            onClick={handleSimular}
            disabled={loading}
            className="w-full h-[50px] bg-primary text-black font-bold rounded-xl shadow-[0_0_15px_rgba(29,185,84,0.3)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simular Potencial'}
          </Button>
        </div>

        {data && (
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#0a2e16] to-black border border-primary/30 p-8 rounded-[2rem] flex flex-col justify-center shadow-[0_0_30px_rgba(29,185,84,0.15)]">
                <p className="text-primary font-bold uppercase tracking-wider text-xs mb-2">
                  Sequestro Estimado
                </p>
                <p className="text-4xl font-black text-white">
                  {data.potencial_sequestro?.toneladas_co2_ano}{' '}
                  <span className="text-xl text-zinc-400 font-normal">tCO₂/ano</span>
                </p>
                <div className="mt-4 pt-4 border-t border-primary/20 flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Score Sustentabilidade</span>
                  <span className="text-primary font-bold">{data.score_sustentabilidade}/100</span>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-center">
                <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Receita Projetada
                </p>
                <p className="text-4xl font-black text-white">
                  R$ {data.receita_carbono?.receita_anual_brl?.toLocaleString('pt-BR')}{' '}
                  <span className="text-xl text-zinc-500 font-normal">/ano</span>
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Em 5 anos</span>
                  <span className="text-white font-bold">
                    R$ {data.receita_carbono?.receita_5anos_brl?.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem]">
              <h3 className="font-bold text-white text-xl mb-6">Próximos Passos no Mercado</h3>
              <div className="space-y-4">
                {data.passos_para_comecar?.map((passo: string, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-zinc-300 pt-1">{passo}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.praticas_recomendadas?.map((pratica: any, i: number) => (
                <div key={i} className="bg-black/50 border border-white/5 p-6 rounded-2xl">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> {pratica.pratica}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-4">{pratica.descricao}</p>
                  <div className="flex justify-between text-xs font-mono text-zinc-500 bg-white/5 p-2 rounded-lg">
                    <span>Impacto: +{pratica.impacto_co2_ton_ha_ano} tCO₂</span>
                    <span>Payback: {pratica.payback_anos} anos</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-600 text-center flex items-center justify-center gap-1 mt-4">
              <Info className="w-3 h-3" /> Valores estimativos. Cotação do carbono atualizada em
              tempo real via mercado voluntário.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
