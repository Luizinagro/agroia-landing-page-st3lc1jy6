import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useCart, Product } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Plus, Minus, Trash2, Tag, ArrowRight, PackageSearch } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { useNavigate } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { items, addItem, removeItem, updateQuantity, total } = useCart()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        if (data) setProducts(data)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: 'Adicionado ao carrinho',
      description: `${product.name} foi adicionado ao seu carrinho.`,
      duration: 3000,
    })
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-green-50/50 p-6 rounded-2xl border border-green-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-900 flex items-center gap-2">
            <Tag className="h-8 w-8 text-green-600" />
            Loja de Insumos
          </h1>
          <p className="text-green-800/80 mt-1 max-w-xl">
            Adquira rações, fertilizantes, sementes e defensivos com qualidade garantida para
            impulsionar a sua produção rural.
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="relative bg-white text-green-800 hover:bg-green-50 border border-green-200 shadow-sm"
            >
              <ShoppingCart className="mr-2 h-5 w-5 text-green-600" />
              Meu Carrinho
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col w-full sm:max-w-md border-l-0 shadow-2xl">
            <SheetHeader className="px-1 py-2 border-b">
              <SheetTitle className="flex items-center gap-2 text-xl text-green-900">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Seu Carrinho
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 -mx-6 px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-muted-foreground mt-20">
                  <div className="bg-muted p-4 rounded-full">
                    <ShoppingCart className="h-10 w-10 opacity-40" />
                  </div>
                  <p>Seu carrinho está vazio no momento.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                    }
                  >
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 bg-background border p-3 rounded-xl shadow-sm"
                    >
                      <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0 border">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                            Sem Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 text-foreground leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-sm font-bold text-green-700 mt-1">
                          R$ {item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-muted rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none rounded-l-md hover:bg-black/5"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none rounded-r-md hover:bg-black/5"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {items.length > 0 && (
              <SheetFooter className="border-t pt-5 pb-2 px-1">
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between font-bold text-lg text-foreground">
                    <span>Total Estimado</span>
                    <span className="text-green-700">R$ {total.toFixed(2)}</span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold text-md"
                    onClick={() => {
                      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                      navigate('/checkout')
                    }}
                  >
                    Finalizar Compra
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse border-border/40 shadow-sm">
              <div className="h-48 bg-muted/80 rounded-t-xl" />
              <CardContent className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
                <div className="h-6 bg-muted rounded w-1/3 pt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card"
            >
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
                  <Badge className="absolute top-3 left-3 bg-white/95 text-green-800 hover:bg-white border-none shadow-sm capitalize font-medium">
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
                <div className="text-2xl font-bold text-green-700 pt-1">
                  R$ {product.price.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {product.description}
                </p>
                <div>
                  {product.stock > 0 && product.stock <= 10 && (
                    <p className="text-xs text-amber-600 font-medium bg-amber-50 inline-block px-2 py-1 rounded">
                      Restam apenas {product.stock} em estoque
                    </p>
                  )}
                  {product.stock > 10 && (
                    <p className="text-xs text-green-600 font-medium">Em estoque</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 mt-auto">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm group-hover:shadow transition-all"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </Button>
              </CardFooter>
            </Card>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-muted/30 rounded-2xl border border-dashed text-center px-4">
              <PackageSearch className="h-16 w-16 text-muted-foreground opacity-40 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground max-w-md">
                Não há insumos cadastrados na loja no momento. Volte mais tarde para conferir as
                novidades.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
