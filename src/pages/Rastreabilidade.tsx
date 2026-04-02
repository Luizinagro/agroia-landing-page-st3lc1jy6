import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sprout, Sun, Tractor, Factory, Store, Plus, Calendar, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/ui/logo'

type Status = 'Concluído' | 'Em Andamento' | 'Pendente'
type Etapa = 'Plantio' | 'Crescimento' | 'Colheita' | 'Processamento' | 'Venda'

interface TimelineItem {
  id: string
  etapa: Etapa
  data: string
  responsavel: string
  status: Status
}

const ICONS = {
  Plantio: Sprout,
  Crescimento: Sun,
  Colheita: Tractor,
  Processamento: Factory,
  Venda: Store,
}

const STATUS_COLORS = {
  Concluído:
    'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20 shadow-[0_0_10px_rgba(29,185,84,0.1)]',
  'Em Andamento':
    'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
  Pendente: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

const MOCK_DATA: TimelineItem[] = [
  { id: '1', etapa: 'Plantio', data: '2023-10-15', responsavel: 'João Silva', status: 'Concluído' },
  {
    id: '2',
    etapa: 'Crescimento',
    data: '2023-11-20',
    responsavel: 'Maria Alves',
    status: 'Concluído',
  },
  {
    id: '3',
    etapa: 'Colheita',
    data: '2024-02-10',
    responsavel: 'Carlos Santos',
    status: 'Em Andamento',
  },
  { id: '4', etapa: 'Processamento', data: '---', responsavel: 'A Definir', status: 'Pendente' },
  { id: '5', etapa: 'Venda', data: '---', responsavel: 'A Definir', status: 'Pendente' },
]

const Rastreabilidade = () => {
  const [items, setItems] = useState<TimelineItem[]>(MOCK_DATA)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const [etapa, setEtapa] = useState<Etapa>('Plantio')
  const [data, setData] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [status, setStatus] = useState<Status>('Pendente')

  const handleAdd = () => {
    if (!data || !responsavel) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, preencha todos os campos para continuar.',
        variant: 'destructive',
      })
      return
    }

    const newItem: TimelineItem = {
      id: Math.random().toString(),
      etapa,
      data,
      responsavel,
      status,
    }

    setItems((prev) => [...prev, newItem])
    setIsOpen(false)
    toast({
      title: 'Etapa Adicionada com Sucesso!',
      description: 'A nova etapa foi registrada e sincronizada na linha do tempo.',
    })

    setEtapa('Plantio')
    setData('')
    setResponsavel('')
    setStatus('Pendente')
  }

  return (
    <div className="container mx-auto py-8 space-y-8 bg-[#000000] min-h-screen">
      <SEO
        title="Rastreabilidade | AgroIA"
        description="Monitoramento completo da cadeia produtiva. Registre cada etapa da sua safra com segurança e transparência."
      />

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-[#050505] p-6 rounded-2xl border border-[#1DB954]/20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-3">
            <Logo className="w-8 h-8 text-[#1DB954]" />
            Rastreabilidade
          </h1>
          <p className="text-[#E0E0E0] mt-2 text-lg font-medium">
            Acompanhe o ciclo de vida da sua produção em tempo real com registros imutáveis e
            padronizados.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-agro-primary border-none font-bold whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#050505] border border-[#1DB954]/20 text-[#FFFFFF] sm:max-w-[425px] rounded-[16px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#1DB954]">
                Registrar Nova Etapa
              </DialogTitle>
              <DialogDescription className="text-[#E0E0E0] font-medium">
                Insira os dados da nova fase na jornada do seu produto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="etapa" className="text-[#FFFFFF] font-semibold">
                  Etapa Produtiva
                </Label>
                <Select value={etapa} onValueChange={(v) => setEtapa(v as Etapa)}>
                  <SelectTrigger className="bg-[#000000] border-[#1DB954]/20 focus:ring-[#1DB954] text-[#FFFFFF]">
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050505] border-[#1DB954]/20 text-[#FFFFFF]">
                    <SelectItem value="Plantio">Plantio</SelectItem>
                    <SelectItem value="Crescimento">Crescimento</SelectItem>
                    <SelectItem value="Colheita">Colheita</SelectItem>
                    <SelectItem value="Processamento">Processamento</SelectItem>
                    <SelectItem value="Venda">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data" className="text-[#FFFFFF] font-semibold">
                  Data de Registro
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="bg-[#000000] border-[#1DB954]/20 focus-visible:ring-[#1DB954] text-[#FFFFFF] [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-[#FFFFFF] font-semibold">
                  Responsável Técnico
                </Label>
                <Input
                  id="responsavel"
                  placeholder="Nome do responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="bg-[#000000] border-[#1DB954]/20 focus-visible:ring-[#1DB954] text-[#FFFFFF] placeholder:text-[#E0E0E0]/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#FFFFFF] font-semibold">
                  Status Atual
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger className="bg-[#000000] border-[#1DB954]/20 focus:ring-[#1DB954] text-[#FFFFFF]">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050505] border-[#1DB954]/20 text-[#FFFFFF]">
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#1DB954]/10 text-[#E0E0E0] hover:text-[#1DB954] font-semibold"
              >
                Cancelar
              </Button>
              <Button onClick={handleAdd} className="btn-agro-primary font-bold">
                Salvar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative border-l-2 border-[#1DB954]/30 ml-4 md:ml-8 space-y-10 pb-12 pt-4">
        {items.map((item, index) => {
          const Icon = ICONS[item.etapa]
          const isActive = item.status !== 'Pendente'

          return (
            <div key={item.id} className="relative pl-8 md:pl-12 group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[21px] top-6 bg-[#000000] border-2 rounded-full p-2.5 z-10 transition-all duration-500
                ${
                  isActive
                    ? 'border-[#1DB954] shadow-[0_0_15px_rgba(29,185,84,0.5)]'
                    : 'border-[#333333] shadow-none'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1DB954]' : 'text-[#888888]'}`} />
              </div>

              {/* Card */}
              <Card
                className={`bg-[#050505] border-[#1DB954]/20 overflow-hidden transition-all duration-300
                ${isActive ? 'hover:shadow-[0_0_20px_rgba(29,185,84,0.15)]' : 'opacity-70'}
              `}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1DB954]" />}
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <h3
                        className={`text-2xl font-bold ${isActive ? 'text-[#FFFFFF]' : 'text-[#E0E0E0]'}`}
                      >
                        {item.etapa}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#E0E0E0] font-medium">
                        <span className="flex items-center gap-1.5 bg-[#000000] px-3 py-1.5 rounded-md border border-[#1DB954]/10">
                          <Calendar className="w-4 h-4 text-[#1DB954]" />
                          {item.data}
                        </span>
                        <span className="flex items-center gap-1.5 bg-[#000000] px-3 py-1.5 rounded-md border border-[#1DB954]/10">
                          <User className="w-4 h-4 text-[#1DB954]" />
                          {item.responsavel}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${STATUS_COLORS[item.status]}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Rastreabilidade
