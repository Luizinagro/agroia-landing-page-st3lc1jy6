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

export function ModalCriarInsumo({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    unidade: '',
    estoque_atual: '',
    estoque_minimo: '',
    preco_unitario: '',
    fornecedor: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.categoria || !formData.unidade) {
      return toast({ title: 'Preencha os campos obrigatórios (*)', variant: 'destructive' })
    }

    setLoading(true)
    const { data, error } = await supabase.functions.invoke('gestao-insumos', {
      body: { action: 'criar_insumo', ...formData },
    })

    setLoading(false)
    if (error || !data?.success) {
      toast({
        title: 'Serviço temporariamente indisponível. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Insumo cadastrado com sucesso!' })
      onSuccess()
      onOpenChange(false)
      setFormData({
        nome: '',
        categoria: '',
        unidade: '',
        estoque_atual: '',
        estoque_minimo: '',
        preco_unitario: '',
        fornecedor: '',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Novo Insumo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nome *</Label>
              <Input
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="Fertilizante">Fertilizante</option>
                <option value="Defensivo">Defensivo</option>
                <option value="Semente">Semente</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Unidade *</Label>
              <select
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="L">Litros (L)</option>
                <option value="kg">Quilos (kg)</option>
                <option value="sc">Sacas (sc)</option>
                <option value="ton">Toneladas (ton)</option>
                <option value="un">Unidades (un)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Estoque Atual</Label>
              <Input
                type="number"
                step="any"
                value={formData.estoque_atual}
                onChange={(e) => setFormData({ ...formData, estoque_atual: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Estoque Mínimo</Label>
              <Input
                type="number"
                step="any"
                value={formData.estoque_minimo}
                onChange={(e) => setFormData({ ...formData, estoque_minimo: e.target.value })}
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
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Salvar Insumo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
