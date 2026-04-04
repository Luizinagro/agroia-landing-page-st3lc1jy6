import { useState, useEffect, useMemo } from 'react'
import { Search, Plus, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

type Product = {
  id: string
  name: string
  category: string
  stock: number
  price: number
}

export function CrmInventory() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    category: 'fertilizante',
    stock: '',
    price: '',
  })

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, stock, price')
      .order('created_at', { ascending: false })

    if (!error && data) setItems(data as Product[])
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredItems = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [items, searchTerm],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.stock || !formData.price) {
      return toast({ title: 'Preencha todos os campos!', variant: 'destructive' })
    }

    setIsSubmitting(true)
    const { error } = await supabase.from('products').insert([
      {
        name: formData.name,
        category: formData.category,
        stock: Number(formData.stock),
        price: Number(formData.price),
      },
    ])

    setIsSubmitting(false)
    if (error) {
      return toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }

    toast({ title: 'Insumo adicionado com sucesso!' })
    setIsOpen(false)
    setFormData({ name: '', category: 'fertilizante', stock: '', price: '' })
    fetchItems()
  }

  const getStatusColor = (stock: number) => {
    if (stock <= 10) return 'bg-red-500'
    if (stock <= 50) return 'bg-yellow-500'
    return 'bg-[#1DB954]'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Estoque de Insumos</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Controle total sobre seus insumos. Evite desperdícios.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Insumo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-[#1DB954]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#1DB954]">Cadastrar Novo Insumo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Insumo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/50 border-[#1DB954]/20"
                  placeholder="Ex: Adubo NPK"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger className="bg-black/50 border-[#1DB954]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-[#1DB954]/20 text-white">
                      <SelectItem value="fertilizante">Fertilizante</SelectItem>
                      <SelectItem value="sementes">Sementes</SelectItem>
                      <SelectItem value="defensivos">Defensivos</SelectItem>
                      <SelectItem value="ração">Ração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantidade</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-black/50 border-[#1DB954]/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Valor Unitário (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-black/50 border-[#1DB954]/20"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-black font-bold mt-4"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Salvar Insumo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#050505] border border-[#1DB954]/20 rounded-xl p-3 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#E0E0E0]" />
        <input
          type="text"
          placeholder="Buscar insumos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-[#FFFFFF] w-full placeholder:text-[#E0E0E0]/50 font-medium text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#050505] border border-[#1DB954]/20 rounded-[16px] p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(29,185,84,0.15)]"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(item.stock)}`} />
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                {item.stock <= 50 && (
                  <AlertTriangle
                    className={`w-4 h-4 ${item.stock <= 10 ? 'text-red-500' : 'text-yellow-500'}`}
                  />
                )}
              </div>
              <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">{item.name}</h3>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#E0E0E0] font-semibold mb-1">Em Estoque</p>
                  <p className="text-2xl font-black text-[#FFFFFF]">
                    {item.stock} <span className="text-sm font-medium text-[#E0E0E0]">un.</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#E0E0E0] font-semibold mb-1">Valor Unit.</p>
                  <p className="text-sm font-bold text-[#1DB954]">
                    R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground">
              Nenhum insumo encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
