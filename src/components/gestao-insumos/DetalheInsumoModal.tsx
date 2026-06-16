import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import { ModalEntradaInsumo } from './ModalEntradaInsumo'
import { ModalSaidaInsumo } from './ModalSaidaInsumo'

export function DetalheInsumoModal({ insumo, open, onOpenChange, onRefresh }: any) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [entradaOpen, setEntradaOpen] = useState(false)
  const [saidaOpen, setSaidaOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && insumo) fetchHistory()
  }, [open, insumo])

  const fetchHistory = async () => {
    setLoading(true)
    const { data, error } = await supabase.functions.invoke('gestao-insumos', {
      body: { action: 'historico_movimentacoes', insumo_id: insumo.id, limit: 20 },
    })
    setLoading(false)
    if (error || !data?.success) {
      toast({
        title: 'Serviço temporariamente indisponível. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      setHistory(data.data || [])
    }
  }

  const handleSuccess = () => {
    fetchHistory()
    onRefresh()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="bg-zinc-950 border-zinc-800 text-white w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl text-white">{insumo?.nome}</SheetTitle>
            <SheetDescription className="text-zinc-400">
              Gerencie entradas, saídas e histórico.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Estoque Atual</p>
                <p className="text-3xl font-bold text-white">
                  {insumo?.estoque_atual}{' '}
                  <span className="text-lg font-normal text-zinc-400">{insumo?.unidade}</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setEntradaOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white h-12 text-md"
              >
                <ArrowUpRight className="mr-2 h-5 w-5" /> Entrada (Compra)
              </Button>
              <Button
                onClick={() => setSaidaOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white h-12 text-md"
              >
                <ArrowDownRight className="mr-2 h-5 w-5" /> Saída (Aplicação)
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-200">Movimentações Recentes</h3>
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nenhuma movimentação registrada.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((mov) => (
                    <div
                      key={mov.id}
                      className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${mov.tipo === 'entrada' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}
                        >
                          {mov.tipo === 'entrada' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize text-zinc-200">{mov.tipo}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(mov.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${mov.tipo === 'entrada' ? 'text-green-400' : 'text-orange-400'}`}
                        >
                          {mov.tipo === 'entrada' ? '+' : '-'}
                          {mov.quantidade} {insumo?.unidade}
                        </p>
                        {mov.tipo === 'saida' && mov.talhao && (
                          <p className="text-xs text-zinc-500">Talhão: {mov.talhao}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {entradaOpen && (
        <ModalEntradaInsumo
          insumo={insumo}
          open={entradaOpen}
          onOpenChange={setEntradaOpen}
          onSuccess={handleSuccess}
        />
      )}
      {saidaOpen && (
        <ModalSaidaInsumo
          insumo={insumo}
          open={saidaOpen}
          onOpenChange={setSaidaOpen}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
