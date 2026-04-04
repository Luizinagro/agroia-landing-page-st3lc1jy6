import { useState, useEffect } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
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
  Concluído: 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(29,185,84,0.2)]',
  'Em Andamento':
    'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
  Pendente: 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50',
}

const Rastreabilidade = () => {
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchRastreabilidade() {
      if (!user) return

      const { data, error } = await supabase
        .from('rastreabilidade')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: true })

      if (data && data.length > 0) {
        setItems(
          data.map((d) => ({
            id: d.id,
            etapa: d.etapa as Etapa,
            data: new Date(d.data).toISOString().split('T')[0],
            responsavel: d.responsavel || 'A Definir',
            status: (d.status as Status) || 'Pendente',
          })),
        )
      } else {
        // Inicializa com as etapas vazias como padrão se não houver nada
        setItems([
          { id: 'p1', etapa: 'Plantio', data: '---', responsavel: 'A Definir', status: 'Pendente' },
          {
            id: 'p2',
            etapa: 'Crescimento',
            data: '---',
            responsavel: 'A Definir',
            status: 'Pendente',
          },
          {
            id: 'p3',
            etapa: 'Colheita',
            data: '---',
            responsavel: 'A Definir',
            status: 'Pendente',
          },
          {
            id: 'p4',
            etapa: 'Processamento',
            data: '---',
            responsavel: 'A Definir',
            status: 'Pendente',
          },
          { id: 'p5', etapa: 'Venda', data: '---', responsavel: 'A Definir', status: 'Pendente' },
        ])
      }
      setLoading(false)
    }

    fetchRastreabilidade()
  }, [user])

  const [etapa, setEtapa] = useState<Etapa>('Plantio')
  const [data, setData] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [status, setStatus] = useState<Status>('Pendente')

  const handleAdd = async () => {
    if (!data || !responsavel || !user) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, preencha todos os campos para continuar.',
        variant: 'destructive',
      })
      return
    }

    const payload = {
      user_id: user.id,
      etapa,
      data: new Date(data).toISOString(),
      responsavel,
      status,
    }

    const { data: inserted, error } = await supabase
      .from('rastreabilidade')
      .insert(payload)
      .select()
      .single()

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao registrar etapa', variant: 'destructive' })
      return
    }

    setItems((prev) => {
      // Remove placeholders if they exist
      const filtered = prev.filter((p) => !p.id.startsWith('p'))
      return [
        ...filtered,
        {
          id: inserted.id,
          etapa: inserted.etapa as Etapa,
          data: new Date(inserted.data).toISOString().split('T')[0],
          responsavel: inserted.responsavel || '',
          status: inserted.status as Status,
        },
      ].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    })

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

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Logo className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.6)]" />
            Rastreabilidade
          </h1>
          <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
            Acompanhe o ciclo de vida da sua produção em tempo real com registros imutáveis e
            padronizados.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-black shadow-[0_0_15px_rgba(29,185,84,0.4)] border-none font-bold whitespace-nowrap rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-primary/20 text-white sm:max-w-[425px] rounded-[16px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Registrar Nova Etapa
              </DialogTitle>
              <DialogDescription className="text-[#A0A0A0] font-medium">
                Insira os dados da nova fase na jornada do seu produto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="etapa" className="text-white font-semibold">
                  Etapa Produtiva
                </Label>
                <Select value={etapa} onValueChange={(v) => setEtapa(v as Etapa)}>
                  <SelectTrigger className="bg-[#000000] border-primary/20 focus:ring-primary text-white">
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050505] border-primary/20 text-white">
                    <SelectItem value="Plantio">Plantio</SelectItem>
                    <SelectItem value="Crescimento">Crescimento</SelectItem>
                    <SelectItem value="Colheita">Colheita</SelectItem>
                    <SelectItem value="Processamento">Processamento</SelectItem>
                    <SelectItem value="Venda">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data" className="text-white font-semibold">
                  Data de Registro
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="bg-[#000000] border-primary/20 focus-visible:ring-primary text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-white font-semibold">
                  Responsável Técnico
                </Label>
                <Input
                  id="responsavel"
                  placeholder="Nome do responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="bg-[#000000] border-primary/20 focus-visible:ring-primary text-white placeholder:text-[#A0A0A0]/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white font-semibold">
                  Status Atual
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger className="bg-[#000000] border-primary/20 focus:ring-primary text-white">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050505] border-primary/20 text-white">
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
                className="hover:bg-primary/10 text-[#A0A0A0] hover:text-primary font-semibold rounded-full"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_15px_rgba(29,185,84,0.4)] rounded-full"
              >
                Salvar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#050505] rounded-xl border border-dashed border-primary/20">
          <Sprout className="w-12 h-12 text-primary/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum registro</h3>
          <p className="text-[#A0A0A0]">
            Comece a registrar as etapas da sua safra clicando em "Adicionar Etapa".
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8 space-y-10 pb-12 pt-4">
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
                    ? 'border-primary shadow-[0_0_15px_rgba(29,185,84,0.5)]'
                    : 'border-[#333333] shadow-none'
                }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(29,185,84,0.8)]' : 'text-[#555555]'}`}
                  />
                </div>

                {/* Card */}
                <Card
                  className={`glass-card overflow-hidden
                ${isActive ? '' : 'opacity-60 grayscale-[0.5]'}
              `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(29,185,84,0.8)]" />
                  )}
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <h3
                          className={`text-2xl font-extrabold ${isActive ? 'text-white' : 'text-[#A0A0A0]'}`}
                        >
                          {item.etapa}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#A0A0A0] font-medium">
                          <span className="flex items-center gap-1.5 bg-[#000000] px-3 py-1.5 rounded-md border border-primary/20">
                            <Calendar className="w-4 h-4 text-primary" />
                            {item.data}
                          </span>
                          <span className="flex items-center gap-1.5 bg-[#000000] px-3 py-1.5 rounded-md border border-primary/20">
                            <User className="w-4 h-4 text-primary" />
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
      )}
    </div>
  )
}

export default Rastreabilidade
