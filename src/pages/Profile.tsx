import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon, Package, Calendar } from 'lucide-react'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.nome || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, created_at, total_price, status,
          order_items (
            quantity, unit_price,
            products ( name )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setOrders(data)
      } else if (error) {
        console.error('Error fetching orders', error)
      }
    }
    fetchOrders()
  }, [user?.id])

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateUser({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ''
    switch (s) {
      case 'pago':
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>
      case 'enviado':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Enviado</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950">Pendente</Badge>
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status || 'Desconhecido'}
          </Badge>
        )
    }
  }

  const planName = user?.plan_active || user?.plano_ativo || user?.plano || 'Básico'
  const trialExpiresAt = user?.trial_expires_at || user?.data_trial_expira

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl animate-fade-in-up mt-16 md:mt-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#1a3c34]">Meu Perfil</h1>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2 shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Fazer Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1a3c34]">
              <UserIcon className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Atualize suas informações de contato e endereço para entregas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-muted/50 text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço de Entrega</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#1a3c34] hover:bg-[#1a3c34]/90 text-white shadow-sm transition-all"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1a3c34]">
              <Calendar className="h-5 w-5" />
              Assinatura
            </CardTitle>
            <CardDescription>Detalhes do seu plano atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Plano Ativo
              </Label>
              <div className="text-2xl font-bold text-[#1a3c34]">{planName}</div>
            </div>
            {trialExpiresAt && (
              <div className="space-y-1 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  Expiração do Trial
                </Label>
                <div className="text-sm font-medium text-foreground">
                  {format(new Date(trialExpiresAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary/50"
              onClick={() => navigate('/planos')}
            >
              Gerenciar Plano
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1a3c34]">
            <Package className="h-5 w-5" />
            Histórico de Pedidos
          </CardTitle>
          <CardDescription>Acompanhe suas compras recentes na Loja de Insumos.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Nenhum pedido encontrado.</p>
              <Button variant="link" className="text-[#1a3c34]" onClick={() => navigate('/loja')}>
                Visitar a Loja de Insumos
              </Button>
            </div>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold">Produtos</TableHead>
                      <TableHead className="font-semibold text-right">Valor Total</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-secondary/10 transition-colors">
                        <TableCell className="whitespace-nowrap font-medium text-foreground/80">
                          {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="max-w-[200px] sm:max-w-[300px] truncate text-muted-foreground">
                          {order.order_items
                            ?.map((item: any) => `${item.quantity}x ${item.products?.name}`)
                            .join(', ')}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(order.total_price)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(order.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
