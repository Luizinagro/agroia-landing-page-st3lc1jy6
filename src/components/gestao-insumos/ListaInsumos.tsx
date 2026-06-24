import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Search, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { ModalCriarInsumo } from './ModalCriarInsumo'
import { DetalheInsumoModal } from './DetalheInsumoModal'

export function ListaInsumos({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number
  onRefresh: () => void
}) {
  const [insumos, setInsumos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [criarOpen, setCriarOpen] = useState(false)
  const [selectedInsumo, setSelectedInsumo] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchInsumos()
  }, [refreshKey, filter])

  const fetchInsumos = async () => {
    setLoading(true)
    const body: any = { action: 'listar_insumos' }
    if (filter !== 'Todos') body.categoria = filter

    const { data, error } = await supabase.functions.invoke('gestao-insumos', { body })

    if (error || !data?.success) {
      toast({
        title: 'Serviço temporariamente indisponível. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      setInsumos(data.data.insumos || [])
    }
    setLoading(false)
  }

  const filteredInsumos = insumos.filter((i) =>
    i.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteInsumo = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (
      !confirm(
        'Tem certeza que deseja excluir este insumo? Todos os dados associados poderão ser afetados.',
      )
    )
      return

    setLoading(true)
    const { error } = await supabase.from('insumos_cadastro').delete().eq('id', id)
    if (error) {
      toast({ title: 'Erro ao excluir insumo', variant: 'destructive' })
    } else {
      toast({ title: 'Insumo excluído com sucesso' })
      onRefresh()
    }
    setLoading(false)
  }

  const getStatus = (estoque: number, minimo: number) => {
    if (estoque === 0) return { label: 'Zerado 🔴', color: 'text-red-400 bg-red-400/10' }
    if (estoque <= minimo)
      return { label: 'Estoque Baixo ⚠️', color: 'text-amber-400 bg-amber-400/10' }
    return { label: 'Em dia ✅', color: 'text-green-400 bg-green-400/10' }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Buscar insumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex h-10 w-full sm:w-[160px] items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Todos">Todos</option>
            <option value="Fertilizante">Fertilizante</option>
            <option value="Defensivo">Defensivo</option>
            <option value="Semente">Semente</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <Button onClick={() => setCriarOpen(true)} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" /> Novo Insumo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInsumos.map((insumo) => {
            const status = getStatus(Number(insumo.estoque_atual), Number(insumo.estoque_minimo))
            return (
              <div
                key={insumo.id}
                onClick={() => setSelectedInsumo(insumo)}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-colors cursor-pointer flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-white truncate">{insumo.nome}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${status.color}`}
                    >
                      {status.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-400/10 shrink-0"
                      onClick={(e) => handleDeleteInsumo(insumo.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-zinc-400">{insumo.categoria}</div>
                <div className="mt-2 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-zinc-500">Estoque</p>
                    <p className="text-lg font-bold text-white">
                      {insumo.estoque_atual}{' '}
                      <span className="text-sm text-zinc-400 font-normal">{insumo.unidade}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Mínimo</p>
                    <p className="text-sm text-zinc-300">
                      {insumo.estoque_minimo} {insumo.unidade}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          {filteredInsumos.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500">
              Nenhum insumo encontrado.
            </div>
          )}
        </div>
      )}

      <ModalCriarInsumo open={criarOpen} onOpenChange={setCriarOpen} onSuccess={onRefresh} />

      {selectedInsumo && (
        <DetalheInsumoModal
          insumo={selectedInsumo}
          open={!!selectedInsumo}
          onOpenChange={(open: boolean) => !open && setSelectedInsumo(null)}
          onRefresh={() => {
            onRefresh()
            setSelectedInsumo(null)
          }}
        />
      )}
    </div>
  )
}
