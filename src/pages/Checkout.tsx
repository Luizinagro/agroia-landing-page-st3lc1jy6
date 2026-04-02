import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/lib/supabase/client'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, CheckCircle2, ShoppingCart, MapPin } from 'lucide-react'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (items.length === 0 && !success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
        <div className="bg-muted p-6 rounded-full mb-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Seu Carrinho está Vazio</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Você precisa adicionar produtos ao carrinho antes de prosseguir para o checkout.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/loja')}
          className="bg-green-600 hover:bg-green-700"
        >
          Explorar a Loja
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-900 mb-2">Pedido Confirmado!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Seu pedido foi recebido com sucesso e em breve começará a ser processado. Agradecemos a
          preferência!
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/loja')}
          variant="outline"
          className="border-green-600 text-green-700 hover:bg-green-50"
        >
          Continuar Comprando
        </Button>
      </div>
    )
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      const { data: authData } = await supabase.auth.getUser()
      const currentUser = authData.user

      if (!currentUser) {
        toast({
          title: 'Acesso Restrito',
          description: 'Você precisa estar logado para finalizar a compra.',
          variant: 'destructive',
        })
        navigate('/login')
        return
      }

      if (!address.trim()) {
        toast({
          title: 'Atenção',
          description: 'Informe o endereço de entrega completo.',
          variant: 'destructive',
        })
        return
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          total_price: total,
          status: 'pendente',
          delivery_address: address,
        } as any)
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      setSuccess(true)
      toast({ title: 'Sucesso', description: 'Seu pedido foi realizado!' })
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast({
        title: 'Erro ao confirmar pedido',
        description: 'Ocorreu um problema de comunicação com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl animate-fade-in-up">
      <Button
        variant="ghost"
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/loja')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para a Loja
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-green-900">Finalizar Compra</h1>
        <p className="text-muted-foreground mt-1">
          Revise seu pedido e informe o endereço para entrega.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Endereço de Entrega
              </CardTitle>
              <CardDescription>Para onde devemos enviar seus insumos?</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleConfirmOrder}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      placeholder="Ex: Fazenda Boa Esperança, BR-163 km 45, Zona Rural, Sinop - MT, CEP 78550-000"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Inclua referências para facilitar a entrega rural se necessário.
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="h-12 w-12 bg-muted rounded overflow-hidden flex-shrink-0 border">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground bg-gray-50">
                          Sem img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Qtd: {item.quantity}</p>
                    </div>
                    <div className="font-medium whitespace-nowrap text-right">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span>A combinar</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-green-800 pt-2">
                <span>Total Estimado</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-4 border-t">
              <Button
                form="checkout-form"
                type="submit"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
