import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react'

interface CheckoutDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onConfirm: () => void
}

export function CheckoutDialog({ isOpen, onOpenChange, total, onConfirm }: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onConfirm()
      }, 2000)
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={isProcessing || isSuccess ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a3c34] animate-in slide-in-from-bottom-2">
              Pagamento Aprovado!
            </h3>
            <p className="text-muted-foreground animate-in slide-in-from-bottom-2 delay-75">
              Processando seu pedido seguro...
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#1a3c34]">Finalizar Pagamento</DialogTitle>
              <DialogDescription>
                Pagamento seguro integrado. Valor total:{' '}
                <strong className="text-gray-900">{formatPrice(total)}</strong>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome no Cartão</Label>
                    <Input id="nome" required placeholder="João da Silva" disabled={isProcessing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de Contato</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="joao@fazenda.com"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço de Entrega</Label>
                  <Input
                    id="endereco"
                    required
                    placeholder="Rodovia BR 163, Km 10"
                    disabled={isProcessing}
                  />
                </div>
                <div className="relative p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
                  <div className="absolute top-4 right-4 text-gray-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card">Número do Cartão</Label>
                    <Input
                      id="card"
                      required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="bg-white font-mono"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validade">Validade</Label>
                      <Input
                        id="validade"
                        required
                        placeholder="MM/AA"
                        maxLength={5}
                        className="bg-white font-mono"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        required
                        placeholder="123"
                        maxLength={4}
                        className="bg-white font-mono"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4 flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando...' : `Pagar ${formatPrice(total)}`}
                  {!isProcessing && <Lock className="w-4 h-4 ml-2 opacity-70" />}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
