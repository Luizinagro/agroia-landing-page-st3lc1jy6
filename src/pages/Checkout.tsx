import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, ShoppingBag, ArrowLeft, Loader2, Package } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: 'Atenção',
        description: 'Você precisa estar logado para finalizar a compra.',
        variant: 'destructive',
      })
      return
    }
    if (items.length === 0) return

    setLoading(true)
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: total,
          delivery_address: address || null,
          status: 'pendente',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert all items from cart into order_items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) throw itemsError

      // Clear the cart completely (local and supabase)
      await clearCart()

      setSuccess(true)
      toast({
        title: 'Pedido realizado com sucesso!',
        description: 'Sua solicitação de compra foi registrada no sistema.',
      })
    } catch (error) {
      console.error('Error on checkout:', error)
      toast({
        title: 'Erro ao processar',
        description: 'Não foi possível finalizar seu pedido. Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container max-w-2xl mx-auto p-4 md:p-8 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center text-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Pedido Confirmado!
          </h1>
          <p className="text-slate-600 mb-8 max-w-md text-lg">
            Sua intenção de compra foi registrada com sucesso. Em breve a equipe AgroIA entrará em
            contato para organizar o pagamento e a entrega.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="font-medium"
            >
              Ir para Dashboard
            </Button>
            <Button
              onClick={() => navigate('/loja')}
              size="lg"
              className="bg-green-600 hover:bg-green-700 font-medium"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Nova Compra
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate('/loja')}
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground font-medium"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Loja
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Finalizar Compra
            </h1>
            <p className="text-slate-500">
              Confirme seus dados para registrar o pedido no sistema.
            </p>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Package className="h-5 w-5 text-green-600" />
                Dados de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-slate-700 font-medium">
                    Endereço Completo
                  </Label>
                  <Input
                    id="address"
                    placeholder="Ex: Fazenda Boa Vista, Rodovia BR-116 Km 42 - Zona Rural"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                  <p className="text-xs text-slate-500 ml-1">
                    Informe o local exato onde os insumos deverão ser entregues.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-slate-50 border-border shadow-md sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed rounded-lg bg-white">
                  <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex gap-3">
                        <div className="h-12 w-12 bg-white rounded border flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 line-clamp-2 leading-tight pr-4">
                            {item.name}
                          </span>
                          <span className="text-slate-500 mt-1">Qtd: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 whitespace-nowrap">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="bg-slate-200" />

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">A combinar</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-xl pt-2">
                <span className="text-slate-900">Total</span>
                <span className="text-green-700">R$ {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                type="submit"
                form="checkout-form"
                className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md transition-all"
                disabled={items.length === 0 || loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
