import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
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

export function CartSheet({ canBuy, planLoading }: { canBuy: boolean; planLoading: boolean }) {
  const { items, updateQuantity, removeItem, total } = useCart()
  const navigate = useNavigate()
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="relative bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold border-none shadow-md transition-all"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Meu Carrinho
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md border-l-0 shadow-2xl bg-slate-50">
        <SheetHeader className="px-1 py-2 border-b border-green-100">
          <SheetTitle className="flex items-center gap-2 text-xl text-green-900">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-muted-foreground mt-20">
              <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                <ShoppingCart className="h-10 w-10 opacity-70" />
              </div>
              <p>Seu carrinho está vazio.</p>
              <Button
                variant="outline"
                className="mt-4 border-green-200 text-green-800 hover:bg-green-50"
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
                  className="flex items-start gap-3 bg-white border border-green-50 p-3 rounded-xl shadow-sm"
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
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
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
                        className="h-7 w-7 text-red-500 hover:bg-red-50 ml-auto"
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
          <SheetFooter className="border-t border-green-100 pt-5 pb-2 px-1">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between font-bold text-lg text-foreground">
                <span>Total Estimado</span>
                <span className="text-green-700">R$ {total.toFixed(2)}</span>
              </div>
              {!planLoading && !canBuy && (
                <div className="text-center text-sm text-red-600 font-medium bg-red-50 p-2 rounded-md">
                  Upgrade necessário para comprar
                </div>
              )}
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold text-md"
                disabled={!planLoading && !canBuy}
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
  )
}
