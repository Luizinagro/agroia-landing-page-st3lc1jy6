import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wifi, PlusCircle, Activity } from 'lucide-react'
import { toast } from 'sonner'

export function IotConnection() {
  const [open, setOpen] = useState(false)
  const [sensorId, setSensorId] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    if (!sensorId.trim()) {
      toast.error('Informe o ID ou IP do sensor.')
      return
    }

    setIsConnecting(true)

    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false)
      setOpen(false)
      setSensorId('')
      toast.success('Sensor conectado com sucesso! Dados sincronizados no mapa.')
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm border border-secondary/20 font-semibold transition-all hover:scale-105">
          <Wifi className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Conectar Sensor IoT</span>
          <span className="sm:hidden">Sensor IoT</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary text-xl">
            <Wifi className="w-6 h-6 text-secondary" />
            Adicionar Novo Sensor IoT
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Conecte seus sensores de campo para receber dados em tempo real direto no seu dashboard
            AgroIA.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid gap-3">
            <Label htmlFor="sensor-id" className="text-primary font-bold text-sm">
              ID do Sensor ou Endereço IP
            </Label>
            <Input
              id="sensor-id"
              placeholder="Ex: SENS-8A4F ou 192.168.1.50"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              className="focus-visible:ring-secondary border-primary/20 h-11"
            />
          </div>
          <div className="bg-primary/5 p-4 rounded-lg text-sm text-muted-foreground flex items-start gap-3 border border-primary/10">
            <Activity className="w-5 h-5 text-primary shrink-0" />
            <p className="leading-snug">
              Certifique-se de que o sensor está ligado e conectado à mesma rede ou possui um chip
              4G/GSM ativo com cobertura na propriedade.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isConnecting}>
            Cancelar
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]"
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-r-transparent"></span>
                Conectando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Vincular Sensor
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
