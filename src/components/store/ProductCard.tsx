import { Product } from '@/contexts/CartContext'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export function ProductCard({
  product,
  onAddToCart,
  canBuy,
  planLoading,
}: {
  product: Product
  onAddToCart: (p: Product) => void
  canBuy: boolean
  planLoading: boolean
}) {
  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-green-100 bg-white gsap-stagger-item">
      <div className="h-52 w-full bg-muted relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50/50">
            Sem Imagem
          </div>
        )}
        {product.category && (
          <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-none shadow-sm capitalize font-bold">
            {product.category}
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1 shadow-lg">
              Esgotado
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[2.8rem] group-hover:text-green-700 transition-colors">
          {product.name}
        </CardTitle>
        <div className="text-2xl font-bold text-green-700 pt-1">R$ {product.price.toFixed(2)}</div>
      </CardHeader>
      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{product.description}</p>
        <div>
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-amber-600 font-medium bg-amber-50 inline-block px-2 py-1 rounded">
              Restam apenas {product.stock}
            </p>
          )}
          {product.stock > 10 && <p className="text-xs text-green-600 font-medium">Em estoque</p>}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto flex-col gap-2">
        {!planLoading && !canBuy && (
          <div className="w-full text-center text-xs text-red-600 font-medium mb-1">
            Upgrade necessário
          </div>
        )}
        <Button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold shadow-sm transition-all"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0 || (!planLoading && !canBuy)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? 'Indisponível' : canBuy || planLoading ? 'Adicionar' : 'Bloqueado'}
        </Button>
      </CardFooter>
    </Card>
  )
}
