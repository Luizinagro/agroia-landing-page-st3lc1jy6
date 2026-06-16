import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const Label = ({ children, className = '' }: any) => (
  <label className={`text-sm font-medium leading-none text-zinc-300 ${className}`}>
    {children}
  </label>
)

export function ModalEntradaInsumo({ insumo, open, onOpenChange, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    quantidade: '',
    data: new Date().toISOString().split('T')[0],
    fornecedor: '',
    nota_fiscal: '',
    preco_unitario: insumo?.preco_unitario || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.quantidade)
      return toast({ title: 'Preencha a quantidade', variant: 'destructive' })

    setLoading(true)
    const { data, error } = await supabase.functions.invoke('gestao-insumos', {
      body: { action: 'entrada_estoque', insumo_id: insumo.id, ...formData },
    })

    setLoading(false)
    if (error || !data?.success) {
      toast({
        title: 'Serviço temporariamente indisponível. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Entrada registrada com sucesso!' })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Entrada (Compra) - {insumo?.nome}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Quantidade * ({insumo?.unidade})</Label>
              <Input
                required
                type="number"
                step="any"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                required
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Preço Unitário R$</Label>
              <Input
                type="number"
                step="any"
                value={formData.preco_unitario}
                onChange={(e) => setFormData({ ...formData, preco_unitario: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Input
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Nota Fiscal</Label>
              <Input
                value={formData.nota_fiscal}
                onChange={(e) => setFormData({ ...formData, nota_fiscal: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Registrar Entrada
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
