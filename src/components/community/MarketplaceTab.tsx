import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ReceiptText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useToast } from '@/hooks/use-toast'
import { useDatabase, Produto, CartItem } from '@/contexts/DatabaseContext'
import { MarketplaceCatalog } from './MarketplaceCatalog'
import { MarketplaceOrders } from './MarketplaceOrders'
import { CheckoutDialog } from './CheckoutDialog'

export function MarketplaceTab() {
  const { toast } = useToast()
  const { addPedido } = useDatabase()
  const [activeView, setActiveView] = useState('catalog')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const addToCart = (produto: Produto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.produto.id === produto.id)
      if (existing) {
        return prev.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
    toast({
      title: 'Adicionado ao carrinho',
      description: `${produto.nome} foi adicionado com sucesso.`,
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.produto.id === id) {
          const newQtd = Math.max(1, item.quantidade + delta)
          return { ...item, quantidade: newQtd }
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.produto.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + item.produto.preco_final * item.quantidade, 0)
  const frete = cart.length > 0 ? 150 : 0
  const total = subtotal + frete
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantidade, 0)

  const handleConfirmOrder = () => {
    addPedido({
      produtos: cart,
      subtotal,
      frete,
      valor_total: total,
      status: 'Aprovado',
    })
    setCart([])
    setIsCheckoutOpen(false)
    setIsCartOpen(false)
    setActiveView('orders')
    toast({
      title: 'Pedido Confirmado!',
      description: 'Sua compra foi processada e já está nos seus pedidos.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <ToggleGroup
          type="single"
          value={activeView}
          onValueChange={(v) => v && setActiveView(v)}
          className="justify-start"
        >
          <ToggleGroupItem
            value="catalog"
            className="data-[state=on]:bg-[#1a3c34] data-[state=on]:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Catálogo
          </ToggleGroupItem>
          <ToggleGroupItem
            value="orders"
            className="data-[state=on]:bg-[#1a3c34] data-[state=on]:text-white transition-colors"
          >
            <ReceiptText className="w-4 h-4 mr-2" />
            Meus Pedidos
          </ToggleGroupItem>
        </ToggleGroup>

        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="relative border-[#1a3c34]/20 hover:bg-[#1a3c34]/5 text-[#1a3c34] w-full sm:w-auto"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Carrinho
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-3 -right-3 bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f] border-2 border-white">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md flex flex-col bg-white">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="flex items-center gap-2 text-[#1a3c34]">
                <ShoppingCart className="w-5 h-5" /> Seu Carrinho
              </SheetTitle>
            </SheetHeader>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                <p>Seu carrinho está vazio.</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 -mx-6 px-6 py-4">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.produto.id}
                        className="flex gap-4 items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100"
                      >
                        <img
                          src={item.produto.image}
                          alt={item.produto.nome}
                          className="w-16 h-16 object-cover rounded-md shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {item.produto.nome}
                          </h4>
                          <p className="font-bold text-[#1a3c34]">
                            {formatPrice(item.produto.preco_final)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.produto.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-4 text-center">
                              {item.quantidade}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.produto.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.produto.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="pt-4 space-y-4">
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Frete Estimado</span>
                      <span>{formatPrice(frete)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-[#1a3c34] pt-3 mt-1 border-t">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <SheetFooter className="pt-4">
                    <Button
                      className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 h-12 text-base"
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      Ir para Checkout
                    </Button>
                  </SheetFooter>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="min-h-[400px]">
        {activeView === 'catalog' ? (
          <MarketplaceCatalog onAddToCart={addToCart} />
        ) : (
          <MarketplaceOrders />
        )}
      </div>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        total={total}
        onConfirm={handleConfirmOrder}
      />
    </div>
  )
}
