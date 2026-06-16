import { useState, useEffect } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

export function TabDocumentos({ maquinaId }: { maquinaId: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    tipo: 'Seguro',
    descricao: '',
    vencimento: '',
    seguradora: '',
    numero_apolice: '',
  })

  const fetch = async () => {
    setLoading(true)
    try {
      setData(await invokeMaquinario({ action: 'listar_documentos', maquina_id: maquinaId }))
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
      await invokeMaquinario({ action: 'criar_documento', maquina_id: maquinaId, ...form })
      toast.success('Documento salvo com sucesso')
      setForm({ tipo: 'Seguro', descricao: '', vencimento: '', seguradora: '', numero_apolice: '' })
      fetch()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const deletar = async (id: string) => {
    if (!confirm('Deseja excluir este documento?')) return
    try {
      await invokeMaquinario({ action: 'deletar_documento', id })
      fetch()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  if (loading)
    return (
      <div className="p-4 text-center text-zinc-500 animate-pulse">Carregando documentos...</div>
    )

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800"
      >
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="h-9 px-3 bg-black border border-zinc-800 rounded-md text-sm text-white w-32"
            >
              <option>Seguro</option>
              <option>CRLV</option>
              <option>Licença</option>
              <option>Outro</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-zinc-400 mb-1 block">Descrição</label>
            <Input
              required
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="bg-black border-zinc-800 h-9"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Vencimento</label>
            <Input
              type="date"
              required
              value={form.vencimento}
              onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
              className="bg-black border-zinc-800 w-36 h-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1">
            <Input
              placeholder="Seguradora/Emissor (Opcional)"
              value={form.seguradora}
              onChange={(e) => setForm({ ...form, seguradora: e.target.value })}
              className="bg-black border-zinc-800 h-9"
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Nº Apólice/Registro (Opcional)"
              value={form.numero_apolice}
              onChange={(e) => setForm({ ...form, numero_apolice: e.target.value })}
              className="bg-black border-zinc-800 h-9"
            />
          </div>
          <Button type="submit" className="h-9">
            Adicionar Documento
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        {data.length === 0 && (
          <p className="text-center text-zinc-500 py-4">Nenhum documento registrado.</p>
        )}
        {data.map((d: any) => (
          <div
            key={d.id}
            className={`flex justify-between items-center p-3 bg-black border rounded-lg transition-colors ${d.status_doc === 'vencido' ? 'border-red-500/40' : d.status_doc === 'urgente' ? 'border-orange-500/40' : 'border-zinc-800'}`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-zinc-200">{d.tipo}</span>
                {d.status_doc === 'vencido' && (
                  <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Vencido
                  </span>
                )}
                {d.status_doc === 'urgente' && (
                  <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Vence em 7 dias
                  </span>
                )}
                {d.status_doc === 'atencao' && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Vence em 30 dias
                  </span>
                )}
                {d.status_doc === 'ok' && (
                  <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Em dia
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">{d.descricao}</p>
              <p className="text-xs text-zinc-500 mt-1">
                Vence:{' '}
                <strong className={d.status_doc === 'ok' ? 'text-zinc-300' : 'text-zinc-200'}>
                  {new Date(d.vencimento).toLocaleDateString('pt-BR')}
                </strong>{' '}
                {d.seguradora ? `• ${d.seguradora}` : ''}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deletar(d.id)}
              className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
