import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus } from 'lucide-react'

interface Invoice {
  id: string
  date: string
  value: number
  status: 'Emitida' | 'Pendente'
  client: string
}

const initialInvoices: Invoice[] = [
  {
    id: 'NF-001',
    date: '2023-10-26',
    value: 15000,
    status: 'Emitida',
    client: 'Fazenda Boa Esperança',
  },
  {
    id: 'NF-002',
    date: '2023-10-28',
    value: 8500,
    status: 'Emitida',
    client: 'Agropecuária Vale Verde',
  },
  {
    id: 'NF-003',
    date: '2023-11-02',
    value: 22400,
    status: 'Pendente',
    client: 'Sementes do Sul Ltda',
  },
]

export function BillingInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [isOpen, setIsOpen] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock addition
    const newInv: Invoice = {
      id: `NF-00${invoices.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      value: Math.floor(Math.random() * 20000) + 5000,
      status: 'Emitida',
      client: 'Novo Cliente Gerado',
    }
    setInvoices([newInv, ...invoices])
    setIsOpen(false)
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="space-y-6 animate-in fade-in-up duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Últimas Notas Fiscais</h3>
          <p className="text-white/60 text-sm">Gerencie suas emissões e acompanhe o status.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-agro-yellow text-agro-green hover:bg-agro-yellow/90">
              <Plus className="w-4 h-4 mr-2" />
              Gerar NF-e
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-agro-green text-white border-white/10 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gerar Nova NF-e</DialogTitle>
              <DialogDescription className="text-white/60">
                Preencha os dados para emitir uma nova nota fiscal eletrônica.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGenerate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-white">
                  Cliente
                </Label>
                <Input
                  id="client"
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="products" className="text-white">
                  Produtos
                </Label>
                <Input
                  id="products"
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Ex: Soja em grãos"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qtd" className="text-white">
                    Quantidade
                  </Label>
                  <Input
                    id="qtd"
                    type="number"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="val" className="text-white">
                    Valor (R$)
                  </Label>
                  <Input
                    id="val"
                    type="number"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-agro-yellow text-agro-green hover:bg-agro-yellow/90"
                >
                  Emitir Nota
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {invoices.map((inv) => (
          <Card key={inv.id} className="bg-white/5 border-white/10 text-white overflow-hidden">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <FileText className="w-6 h-6 text-agro-yellow" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{inv.client}</h4>
                  <p className="text-white/60 text-sm">
                    {inv.id} • {new Date(inv.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <span className="font-bold text-lg text-agro-yellow">{formatBRL(inv.value)}</span>
                <Badge
                  variant="outline"
                  className={`border-0 ${inv.status === 'Emitida' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}
                >
                  {inv.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
