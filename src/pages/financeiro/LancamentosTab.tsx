import { useEffect, useState } from 'react'
import { financeiroApi } from '@/services/gestao-financeira'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, Plus, Loader2 } from 'lucide-react'

export default function LancamentosTab({ refreshKey }: { refreshKey: number }) {
  const [tipo, setTipo] = useState('despesa')
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = () => {
    financeiroApi.invoke('listar_lancamentos', { tipo }).then((d) => setLancamentos(d.lancamentos))
  }
  useEffect(() => {
    load()
  }, [tipo, refreshKey])

  const handlePagar = async (id: string) => {
    try {
      await financeiroApi.invoke('pagar_lancamento', { id })
      toast({ title: 'Sucesso', description: 'Status atualizado!' })
      load()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.target)
    try {
      await financeiroApi.invoke('criar_lancamento', Object.fromEntries(fd))
      toast({ title: 'Lançamento criado com sucesso' })
      setOpen(false)
      load()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={tipo} onValueChange={setTipo} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="despesa">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="receita">Contas a Receber</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Criar Lançamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <input
                  name="descricao"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    name="tipo"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2"
                  >
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <select
                    name="categoria"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2"
                  >
                    <option value="Insumos">Insumos</option>
                    <option value="Maquinário">Maquinário</option>
                    <option value="Mão de obra">Mão de obra</option>
                    <option value="Venda de grãos">Venda de grãos</option>
                    <option value="Arrendamento">Arrendamento</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Valor R$</label>
                  <input
                    name="valor"
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Vencimento</label>
                  <input
                    name="vencimento"
                    type="date"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Safra</label>
                <input
                  name="safra"
                  placeholder="ex: 2025/2026"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2"
                />
              </div>
              <Button disabled={loading} className="w-full" type="submit">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Lançamento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900/50 text-zinc-400 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Vencimento</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            )}
            {lancamentos.map((l: any) => (
              <tr
                key={l.id}
                className="border-t border-zinc-800/50 bg-zinc-950/30 hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  {new Date(l.vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-200">{l.descricao}</td>
                <td className="px-4 py-3 text-zinc-400">{l.categoria}</td>
                <td
                  className={`px-4 py-3 font-medium ${l.tipo === 'receita' ? 'text-green-500' : 'text-red-500'}`}
                >
                  R$ {Number(l.valor).toLocaleString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${l.status === 'pago' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {l.status === 'pendente' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePagar(l.id)}
                      className="text-zinc-400 hover:text-primary hover:bg-primary/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Baixar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
