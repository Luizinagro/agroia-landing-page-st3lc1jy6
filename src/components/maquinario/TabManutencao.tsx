import { useState, useEffect } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

export function TabManutencao({ maquinaId }: { maquinaId: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ descricao: '', tipo_gatilho: 'horas', valor_gatilho: '' })

  const fetch = async () => {
    setLoading(true)
    try {
      setData(await invokeMaquinario({ action: 'listar_manutencao', maquina_id: maquinaId }))
    } catch (e: any) {
      toast.error(e.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [maquinaId])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const payload = {
        action: 'criar_manutencao',
        maquina_id: maquinaId,
        descricao: form.descricao,
        tipo_gatilho: form.tipo_gatilho,
        [form.tipo_gatilho === 'data' ? 'data_gatilho' : 'horas_gatilho']: form.valor_gatilho,
      }
      await invokeMaquinario(payload)
      toast.success('Manutenção agendada com sucesso')
      setForm({ descricao: '', tipo_gatilho: 'horas', valor_gatilho: '' })
      fetch()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const concluir = async (id: string) => {
    const custo = prompt('Custo realizado (R$) - Opcional:')
    if (custo === null) return
    try {
      await invokeMaquinario({
        action: 'concluir_manutencao',
        id,
        custo_realizado: Number(custo) || 0,
      })
      toast.success('Manutenção concluída!')
      fetch()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  if (loading)
    return (
      <div className="p-4 text-center text-zinc-500 animate-pulse">Carregando manutenções...</div>
    )

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 items-end bg-zinc-900/50 p-4 rounded-xl border border-zinc-800"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-zinc-400 mb-1 block">Descrição da Manutenção</label>
          <Input
            required
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="bg-black border-zinc-800 h-9"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Tipo de Alerta</label>
          <select
            value={form.tipo_gatilho}
            onChange={(e) => setForm({ ...form, tipo_gatilho: e.target.value, valor_gatilho: '' })}
            className="h-9 px-3 bg-black border border-zinc-800 rounded-md text-sm text-white"
          >
            <option value="horas">Por Horímetro</option>
            <option value="data">Por Data</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Previsão</label>
          <Input
            required
            type={form.tipo_gatilho === 'data' ? 'date' : 'number'}
            placeholder={form.tipo_gatilho === 'horas' ? 'Ex: 1250' : ''}
            value={form.valor_gatilho}
            onChange={(e) => setForm({ ...form, valor_gatilho: e.target.value })}
            className="bg-black border-zinc-800 w-36 h-9"
          />
        </div>
        <Button type="submit" className="h-9">
          Agendar
        </Button>
      </form>

      <div className="space-y-2">
        {data.length === 0 && (
          <p className="text-center text-zinc-500 py-4">Nenhuma manutenção registrada.</p>
        )}
        {data.map((m: any) => {
          const isAtrasado =
            m.status === 'agendado' && m.data_gatilho && new Date(m.data_gatilho) < new Date()
          return (
            <div
              key={m.id}
              className={`flex justify-between items-center p-4 bg-black border rounded-xl transition-colors ${isAtrasado ? 'border-red-500/40' : m.status === 'realizado' ? 'border-green-500/20 opacity-80' : 'border-zinc-800 hover:border-zinc-700'}`}
            >
              <div>
                <p className="font-semibold text-zinc-200 flex items-center gap-2">
                  {m.descricao}
                  {isAtrasado && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      Atrasado
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-400 mt-1.5">
                  {m.tipo_gatilho === 'data'
                    ? `Previsão: ${new Date(m.data_gatilho).toLocaleDateString('pt-BR')}`
                    : `Agendado para: ${m.horas_gatilho}h`}
                </p>
                {m.status === 'realizado' && (
                  <p className="text-xs text-green-400 mt-1">
                    Realizada em {new Date(m.data_realizada).toLocaleDateString('pt-BR')}{' '}
                    {m.custo_realizado ? `— R$ ${m.custo_realizado}` : ''}
                  </p>
                )}
              </div>
              <div>
                {m.status === 'agendado' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => concluir(m.id)}
                    className="border-primary/50 text-primary hover:bg-primary hover:text-black"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Concluir
                  </Button>
                ) : (
                  <span className="text-green-500/80 flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Finalizado
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
