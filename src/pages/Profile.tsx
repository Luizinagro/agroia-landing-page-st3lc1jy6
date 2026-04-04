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
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans">
      <main className="flex-1 container py-8 mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Meu Perfil
            </h1>
            <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
              Gerencie suas informações pessoais, configurações de conta e acompanhe o histórico de
              pedidos na loja.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="font-bold flex items-center gap-2 whitespace-nowrap bg-red-600 hover:bg-red-700 text-white shrink-0"
          >
            <LogOut className="h-4 w-4" />
            Fazer Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-[#050505] border-[#1DB954]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#FFFFFF] font-bold">
                <UserIcon className="h-5 w-5 text-[#1DB954]" />
                Dados Pessoais
              </CardTitle>
              <CardDescription className="text-[#E0E0E0] font-medium">
                Atualize suas informações de contato e endereço para entregas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#FFFFFF] font-semibold">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#FFFFFF] font-semibold">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-[#000000] border-[#1DB954]/20 text-[#E0E0E0] opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#FFFFFF] font-semibold">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#FFFFFF] font-semibold">
                    Endereço de Entrega
                  </Label>
                  <Input
                    id="address"
                    className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
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
                className="btn-agro-primary font-bold"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-[#050505] border-[#1DB954]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#FFFFFF] font-bold">
                <Calendar className="h-5 w-5 text-[#1DB954]" />
                Assinatura
              </CardTitle>
              <CardDescription className="text-[#E0E0E0] font-medium">
                Detalhes do seu plano atual.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label className="text-[#1DB954] text-xs uppercase tracking-wider font-bold">
                  Plano Ativo
                </Label>
                <div className="text-2xl font-bold text-[#FFFFFF]">{planName}</div>
              </div>
              {trialExpiresAt && (
                <div className="space-y-1 p-3 bg-[#000000] rounded-lg border border-[#1DB954]/20">
                  <Label className="text-[#1DB954] text-xs uppercase tracking-wider font-bold">
                    Expiração do Trial
                  </Label>
                  <div className="text-sm font-medium text-[#FFFFFF]">
                    {format(new Date(trialExpiresAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#1DB954]/50 text-[#FFFFFF] hover:bg-[#1DB954]/10 hover:text-[#1DB954] font-bold"
                onClick={() => navigate('/planos')}
              >
                Gerenciar Plano
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-[#050505] border-[#1DB954]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#FFFFFF] font-bold">
              <Package className="h-5 w-5 text-[#1DB954]" />
              Histórico de Pedidos
            </CardTitle>
            <CardDescription className="text-[#E0E0E0] font-medium">
              Acompanhe suas compras recentes na Loja de Insumos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#000000] border border-[#1DB954]/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-[#1DB954]/50" />
                </div>
                <p className="text-[#E0E0E0] font-medium">Nenhum pedido encontrado.</p>
                <Button
                  variant="link"
                  className="text-[#1DB954] font-bold"
                  onClick={() => navigate('/loja')}
                >
                  Visitar a Loja de Insumos
                </Button>
              </div>
            ) : (
              <div className="rounded-md border border-[#1DB954]/20 overflow-hidden bg-[#000000]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#050505]">
                      <TableRow className="border-[#1DB954]/20 hover:bg-transparent">
                        <TableHead className="font-bold text-[#E0E0E0]">Data</TableHead>
                        <TableHead className="font-bold text-[#E0E0E0]">Produtos</TableHead>
                        <TableHead className="font-bold text-[#E0E0E0] text-right">
                          Valor Total
                        </TableHead>
                        <TableHead className="font-bold text-[#E0E0E0] text-center">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="border-[#1DB954]/10 hover:bg-[#1DB954]/5 transition-colors"
                        >
                          <TableCell className="whitespace-nowrap font-medium text-[#FFFFFF]">
                            {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="max-w-[200px] sm:max-w-[300px] truncate text-[#E0E0E0] font-medium">
                            {order.order_items
                              ?.map((item: any) => `${item.quantity}x ${item.products?.name}`)
                              .join(', ')}
                          </TableCell>
                          <TableCell className="text-right font-bold text-[#FFFFFF]">
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
      </main>
    </div>
  )
}
