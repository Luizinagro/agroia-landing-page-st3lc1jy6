import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShoppingCart, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useDatabase, Produto } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'

export function MarketplaceTab() {
  const { toast } = useToast()
  const { produtos, loading } = useDatabase()
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleCheckout = (product: Produto) => {
    setSelectedProduct(product)
    setIsCheckoutOpen(true)
  }

  const confirmPurchase = () => {
    toast({
      title: 'Compra Finalizada',
      description: `Seu pedido para ${selectedProduct?.nome} foi processado com sucesso!`,
    })
    setIsCheckoutOpen(false)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden border-[#1a3c34]/10 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image || 'https://img.usecurling.com/p/400/300?q=agribusiness'}
                alt={product.nome}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-[#1a3c34] font-bold backdrop-blur-sm border-none shadow-sm">
                  {product.markup_10pct ? '10% markup' : ''}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-[#1a3c34]">{product.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{product.preco}</p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Compra Segura AgroIA
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 shadow-sm transition-colors"
                onClick={() => handleCheckout(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#1a3c34]">Finalizar Compra</DialogTitle>
            <DialogDescription>
              Revise os detalhes do seu pedido antes de confirmar.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <img
                  src={
                    selectedProduct.image || 'https://img.usecurling.com/p/400/300?q=agribusiness'
                  }
                  alt={selectedProduct.nome}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedProduct.nome}</h4>
                  <p className="text-lg font-bold text-[#1a3c34]">{selectedProduct.preco}</p>
                </div>
              </div>
              <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Pagamento será faturado na sua conta corrente via integração bancária AgroIA.</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmPurchase}
              className="w-full sm:w-auto bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90"
            >
              Confirmar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
