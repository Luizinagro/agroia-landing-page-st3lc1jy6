import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { ShoppingCart, Info, Plus, Edit2, Trash2, Tag } from 'lucide-react'
import { useDatabase, Produto } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { checkRateLimit, logSystemEvent } from '@/lib/security'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function MarketplaceCatalog({ onAddToCart }: { onAddToCart: (p: Produto) => void }) {
  const { produtos, loading, addProduto, updateProduto, deleteProduto } = useDatabase()
  const { user } = useAuth()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco_base, setPrecoBase] = useState(0)
  const [estoque, setEstoque] = useState(0)

  const resetForm = () => {
    setNome('')
    setDescricao('')
    setPrecoBase(0)
    setEstoque(0)
    setEditId(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (p: Produto) => {
    setNome(p.nome)
    setDescricao(p.descricao)
    setPrecoBase(p.preco_base)
    setEstoque(p.estoque)
    setEditId(p.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const preco_final = preco_base * 1.1
      if (editId) {
        await updateProduto(editId, { nome, descricao, preco_base, estoque, preco_final })
        toast({ title: 'Sucesso', description: 'Produto atualizado!' })
      } else {
        await addProduto({
          nome,
          descricao,
          preco_base,
          estoque,
          markup_10pct: true,
          preco_final,
          image: `https://img.usecurling.com/p/400/300?q=${encodeURIComponent(nome)}`,
        })
        toast({ title: 'Sucesso', description: 'Produto adicionado ao catálogo!' })
      }
      setIsOpen(false)
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar produto.', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este produto do catálogo?')) {
      await deleteProduto(id)
      toast({ title: 'Excluído', description: 'Produto removido com sucesso.' })
    }
  }

  const handleAddToCart = (product: Produto) => {
    const userId = user?.id || 'anonymous'
    const canAdd = checkRateLimit('api_add_cart', userId, 10, 60 * 1000)
    if (!canAdd) {
      toast({
        title: 'Ação Bloqueada',
        description: 'Muitas requisições. Aguarde um minuto.',
        variant: 'destructive',
      })
      logSystemEvent('RATE_LIMIT', `Abuso detectado no carrinho`, userId)
      return
    }
    onAddToCart(product)
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#1a3c34]/10 shadow-sm animate-in fade-in">
        <div>
          <h2 className="text-xl font-bold text-[#1a3c34] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#f4d03f]" /> Catálogo Ativo
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus produtos e faça negócios rápidos.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenNew}
              className="bg-[#1a3c34] text-[#f4d03f] font-bold hover:bg-[#1a3c34]/90 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#1a3c34]">
                {editId ? 'Editar Produto' : 'Adicionar Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input required value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço Base (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={preco_base}
                    onChange={(e) => setPrecoBase(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estoque Inicial</Label>
                  <Input
                    type="number"
                    required
                    value={estoque}
                    onChange={(e) => setEstoque(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#1a3c34] text-[#f4d03f] font-bold">
                  Salvar no Catálogo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {produtos.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden border-[#1a3c34]/10 hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.nome}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.markup_10pct && (
                <Badge className="absolute top-3 right-3 bg-[#f4d03f] text-[#1a3c34] font-bold shadow-sm">
                  Preço Dinâmico
                </Badge>
              )}
              <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 shadow-sm"
                  onClick={() => handleOpenEdit(product)}
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 shadow-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-[#1a3c34] line-clamp-1">
                  {product.nome}
                </CardTitle>
                <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                  Qtd: {product.estoque}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.descricao}</p>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100/50">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Preço Base</span>
                  <span>{formatPrice(product.preco_base)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-orange-600/90 font-medium">
                  <span className="flex items-center gap-1.5">
                    Markup (10%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-orange-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Acréscimo automático AgroIA.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span>+ {formatPrice(product.preco_final - product.preco_base)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg pt-2.5 mt-2.5 border-t border-gray-200 text-[#1a3c34]">
                  <span>Preço Final</span>
                  <span>{formatPrice(product.preco_final)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 mt-auto">
              <Button
                className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 shadow-sm transition-all duration-200"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Adicionar ao Carrinho
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
