import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { toast } from 'sonner'

export function MachineRegistrationModal({ open, onOpenChange, onSuccess }: any) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Trator',
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    horimetro_atual: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await invokeMaquinario({
        action: 'criar_maquina',
        ...formData,
        ano: formData.ano ? Number(formData.ano) : null,
        horimetro_atual: formData.horimetro_atual ? Number(formData.horimetro_atual) : 0,
      })
      toast.success('Máquina cadastrada com sucesso!')
      onSuccess()
      onOpenChange(false)
      setFormData({
        nome: '',
        tipo: 'Trator',
        marca: '',
        modelo: '',
        ano: '',
        placa: '',
        horimetro_atual: '',
      })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-primary/20 text-white">
        <DialogHeader>
          <DialogTitle>Cadastrar Máquina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            required
            placeholder="Nome ou Identificação"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="bg-black border-zinc-800"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="h-10 px-3 bg-black border border-zinc-800 rounded-md text-sm w-full"
            >
              <option>Trator</option>
              <option>Colheitadeira</option>
              <option>Pulverizador</option>
              <option>Implemento</option>
              <option>Veículo</option>
            </select>
            <Input
              placeholder="Marca"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              className="bg-black border-zinc-800"
            />
            <Input
              placeholder="Modelo"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              className="bg-black border-zinc-800"
            />
            <Input
              placeholder="Ano"
              type="number"
              value={formData.ano}
              onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
              className="bg-black border-zinc-800"
            />
            <Input
              placeholder="Placa (opcional)"
              value={formData.placa}
              onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
              className="bg-black border-zinc-800"
            />
            <Input
              placeholder="Horímetro Inicial"
              type="number"
              value={formData.horimetro_atual}
              onChange={(e) => setFormData({ ...formData, horimetro_atual: e.target.value })}
              className="bg-black border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Máquina'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
