import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useDatabase } from '@/contexts/DatabaseContext'
import { PackageSearch } from 'lucide-react'

export function MarketplaceOrders() {
  const { pedidos } = useDatabase()

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 animate-in fade-in duration-500">
        <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
        <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
          Você ainda não realizou nenhuma compra no nosso marketplace integrado.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="whitespace-nowrap font-semibold text-[#1a3c34]">
                Número do Pedido
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-[#1a3c34]">Data</TableHead>
              <TableHead className="font-semibold text-[#1a3c34]">Lista de Produtos</TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-[#1a3c34]">
                Valor Total
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-[#1a3c34]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                  #{pedido.numero_pedido}
                </TableCell>
                <TableCell className="text-gray-500 whitespace-nowrap text-sm">
                  {formatDate(pedido.data)}
                </TableCell>
                <TableCell className="max-w-[250px] sm:max-w-md truncate text-sm text-gray-600">
                  {pedido.produtos.map((p) => `${p.quantidade}x ${p.produto.nome}`).join(', ')}
                </TableCell>
                <TableCell className="font-bold text-[#1a3c34] whitespace-nowrap">
                  {formatPrice(pedido.valor_total)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {pedido.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
