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
import { Sprout, Sun, Tractor, Factory, Store, Plus, Calendar, User, Activity } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
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

  // Form state
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

    // Reset form
    setEtapa('Plantio')
    setData('')
    setResponsavel('')
    setStatus('Pendente')
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 animate-fade-in-up">
      <SEO
        title="Rastreabilidade | AgroIA"
        description="Acompanhe a jornada completa da sua produção com transparência."
      />

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-slate-900/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            Rastreabilidade
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Acompanhe o ciclo de vida da sua produção em tempo real com registros imutáveis.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 border-none">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a1120] border border-slate-800 text-slate-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-emerald-400">
                Registrar Nova Etapa
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Insira os dados da nova fase na jornada do seu produto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="etapa" className="text-slate-300">
                  Etapa Produtiva
                </Label>
                <Select value={etapa} onValueChange={(v) => setEtapa(v as Etapa)}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 focus:ring-emerald-500 text-white">
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="Plantio">Plantio</SelectItem>
                    <SelectItem value="Crescimento">Crescimento</SelectItem>
                    <SelectItem value="Colheita">Colheita</SelectItem>
                    <SelectItem value="Processamento">Processamento</SelectItem>
                    <SelectItem value="Venda">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data" className="text-slate-300">
                  Data de Registro
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 focus-visible:ring-emerald-500 text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-slate-300">
                  Responsável Técnico
                </Label>
                <Input
                  id="responsavel"
                  placeholder="Nome do responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 focus-visible:ring-emerald-500 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-300">
                  Status Atual
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 focus:ring-emerald-500 text-white">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
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
                className="hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
              >
                Salvar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative border-l-2 border-emerald-500/30 ml-4 md:ml-8 space-y-10 pb-12 pt-4">
        {items.map((item, index) => {
          const Icon = ICONS[item.etapa]
          const isActive = item.status !== 'Pendente'

          return (
            <div
              key={item.id}
              className="relative pl-8 md:pl-12 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[21px] top-6 bg-[#060d1a] border-2 rounded-full p-2.5 z-10 transition-all duration-500
                ${
                  isActive
                    ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'border-slate-700 shadow-none'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>

              {/* Card */}
              <Card
                className={`bg-[#0a1120]/80 backdrop-blur-xl border-white/5 overflow-hidden transition-all duration-300
                ${isActive ? 'hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]' : 'opacity-70'}
              `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-blue-500" />
                )}
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <h3
                        className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}
                      >
                        {item.etapa}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-md border border-white/5">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {item.data}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-md border border-white/5">
                          <User className="w-4 h-4 text-emerald-400" />
                          {item.responsavel}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${STATUS_COLORS[item.status]}`}
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
