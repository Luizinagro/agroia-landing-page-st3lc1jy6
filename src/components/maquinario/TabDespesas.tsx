import { useState, useEffect } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function TabDespesas({ maquinaId }: { maquinaId: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    descricao: '',
    categoria: 'Peças',
    valor: '',
    data: new Date().toISOString().split('T')[0],
  })

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await invokeMaquinario({
        action: 'listar_despesas',
        maquina_id: maquinaId,
        ano: new Date().getFullYear(),
      })
      setData(res)
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
      await invokeMaquinario({ action: 'adicionar_despesa', maquina_id: maquinaId, ...form })
      toast.success('Despesa adicionada')
      setForm({
        descricao: '',
        categoria: 'Peças',
        valor: '',
        data: new Date().toISOString().split('T')[0],
      })
      fetch()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  if (loading)
    return <div className="p-4 text-center text-zinc-500 animate-pulse">Carregando despesas...</div>

  const cores: any = {
    Combustível: 'bg-red-500',
    Peças: 'bg-blue-500',
    Lubrificantes: 'bg-amber-500',
    'Mão de obra': 'bg-purple-500',
    Outros: 'bg-zinc-500',
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <h3 className="text-lg font-bold mb-3">
          Total do Ano: <span className="text-red-400">R$ {data?.total_periodo?.toFixed(2)}</span>
        </h3>
        <div className="flex w-full h-3 rounded-full overflow-hidden mb-3 bg-zinc-800">
          {Object.entries(data?.por_categoria || {}).map(([cat, val]: any) => (
            <div
              key={cat}
              style={{ width: `${(val / (data.total_periodo || 1)) * 100}%` }}
              className={cores[cat] || 'bg-primary'}
              title={`${cat}: R$ ${val}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(data?.por_categoria || {}).map(([cat, val]: any) => (
            <div key={cat} className="flex items-center gap-1.5 text-zinc-300">
              <span className={`w-2.5 h-2.5 rounded-full ${cores[cat] || 'bg-primary'}`}></span>
              {cat}: R$ {val.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 items-end bg-zinc-900/50 p-4 rounded-xl border border-zinc-800"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-zinc-400 mb-1 block">Descrição</label>
          <Input
            required
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="bg-black border-zinc-800 h-9"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Categoria</label>
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="h-9 px-3 bg-black border border-zinc-800 rounded-md text-sm text-white"
          >
            <option>Combustível</option>
            <option>Peças</option>
            <option>Lubrificantes</option>
            <option>Mão de obra</option>
            <option>Outros</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Valor (R$)</label>
          <Input
            type="number"
            step="0.01"
            required
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            className="bg-black border-zinc-800 w-28 h-9"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Data</label>
          <Input
            type="date"
            required
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            className="bg-black border-zinc-800 w-32 h-9"
          />
        </div>
        <Button type="submit" className="h-9">
          Salvar
        </Button>
      </form>

      <div className="space-y-2">
        {data?.despesas?.length === 0 ? (
          <p className="text-center text-zinc-500 py-4">Nenhuma despesa registrada neste ano.</p>
        ) : null}
        {data?.despesas?.map((d: any) => (
          <div
            key={d.id}
            className="flex justify-between items-center p-3 bg-black border border-zinc-800 rounded-lg text-sm hover:border-zinc-700 transition-colors"
          >
            <div>
              <p className="font-semibold text-zinc-200">{d.descricao}</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                {d.categoria} • {new Date(d.data).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="font-bold text-red-400">-R$ {d.valor}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
