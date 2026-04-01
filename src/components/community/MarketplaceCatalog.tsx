import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Info } from 'lucide-react'
import { useDatabase, Produto } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { checkRateLimit, logSystemEvent } from '@/lib/security'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function MarketplaceCatalog({ onAddToCart }: { onAddToCart: (p: Produto) => void }) {
  const { produtos, loading } = useDatabase()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = (product: Produto) => {
    const userId = user?.id || 'anonymous'
    const canAdd = checkRateLimit('api_add_cart', userId, 10, 60 * 1000)
    if (!canAdd) {
      toast({
        title: 'Ação Bloqueada',
        description: 'Muitas requisições. Aguarde um minuto para adicionar mais itens.',
        variant: 'destructive',
      })
      logSystemEvent('RATE_LIMIT', `Abuso detectado no carrinho pelo usuário`, userId)
      return
    }
    onAddToCart(product)
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    )
  }

  return (
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
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.markup_10pct && (
              <Badge className="absolute top-3 right-3 bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f] font-bold border-none shadow-sm shadow-black/10">
                Preço Dinâmico
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-[#1a3c34]">{product.nome}</CardTitle>
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
                        <p className="text-sm">
                          Acréscimo automático e transparente da plataforma AgroIA.
                        </p>
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
              className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 shadow-sm transition-colors group-hover:shadow-md"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
