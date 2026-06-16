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

export function ModalSaidaInsumo({ insumo, open, onOpenChange, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    quantidade: '',
    data: new Date().toISOString().split('T')[0],
    talhao: '',
    cultura: '',
    safra: '',
    tipo_aplicacao: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.quantidade)
      return toast({ title: 'Preencha a quantidade', variant: 'destructive' })
    if (Number(formData.quantidade) > Number(insumo?.estoque_atual)) {
      return toast({ title: 'Quantidade maior que o estoque atual', variant: 'destructive' })
    }

    setLoading(true)
    const { data, error } = await supabase.functions.invoke('gestao-insumos', {
      body: { action: 'saida_estoque', insumo_id: insumo.id, ...formData },
    })

    setLoading(false)
    if (error || !data?.success) {
      toast({
        title: 'Serviço temporariamente indisponível. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Saída registrada com sucesso!' })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Saída (Aplicação) - {insumo?.nome}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Quantidade * ({insumo?.unidade}) - Máx: {insumo?.estoque_atual}
              </Label>
              <Input
                required
                type="number"
                step="any"
                max={insumo?.estoque_atual}
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
              <Label>Talhão</Label>
              <Input
                value={formData.talhao}
                onChange={(e) => setFormData({ ...formData, talhao: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Cultura</Label>
              <Input
                value={formData.cultura}
                onChange={(e) => setFormData({ ...formData, cultura: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Safra</Label>
              <Input
                value={formData.safra}
                onChange={(e) => setFormData({ ...formData, safra: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Aplicação</Label>
              <Input
                value={formData.tipo_aplicacao}
                onChange={(e) => setFormData({ ...formData, tipo_aplicacao: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
                placeholder="Ex: Pulverização"
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
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Registrar Saída
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
