import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export function BillingInvoices() {
  return (
    <div className="space-y-6 animate-in fade-in-up duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Notas Fiscais</h3>
          <p className="text-white/60 text-sm">
            Gerencie suas emissões de NF-e e acompanhe o status.
          </p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
          <div className="p-4 bg-white/5 rounded-full mb-2">
            <FileText className="w-10 h-10 text-white/40" />
          </div>
          <h4 className="font-semibold text-xl text-white/80">
            📋 Emissão de Nota Fiscal — Em breve.
          </h4>
          <p className="text-white/50 text-sm max-w-md">
            Estamos preparando essa integração para você. Em breve, você poderá emitir notas fiscais
            diretamente da plataforma AgroIA com a maior agilidade.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
