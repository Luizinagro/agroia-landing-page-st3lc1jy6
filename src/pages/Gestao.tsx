import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, MapPin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SEO } from '@/components/SEO'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Propriedade {
  id: string
  nome: string
  cultura_principal: string
  latitude: number
  longitude: number
  created_at: string
}

export default function Gestao() {
  const { user } = useAuth() as any
  const [propriedades, setPropriedades] = useState<Propriedade[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProp, setNewProp] = useState({
    nome: '',
    cultura_principal: '',
    latitude: '',
    longitude: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPropriedades = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('propriedades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao buscar propriedades')
    } else {
      setPropriedades(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPropriedades()
  }, [user])

  const handleAddPropriedade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSubmitting(true)

    const lat = parseFloat(newProp.latitude)
    const lng = parseFloat(newProp.longitude)

    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
      toast.error('Coordenada inválida')
      setIsSubmitting(false)
      return
    }

    const { data, error } = await supabase
      .from('propriedades')
      .insert({
        user_id: user.id,
        nome: newProp.nome,
        cultura_principal: newProp.cultura_principal,
        latitude: lat,
        longitude: lng,
      })
      .select()

    if (error) {
      toast.error('Erro ao cadastrar propriedade')
    } else {
      toast.success('Propriedade cadastrada com sucesso!')
      setIsDialogOpen(false)
      setNewProp({ nome: '', cultura_principal: '', latitude: '', longitude: '' })
      if (data) {
        setPropriedades([data[0], ...propriedades])
      }
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Tem certeza que deseja excluir esta propriedade? Todos os dados associados poderão ser afetados.',
      )
    )
      return

    const { error } = await supabase.from('propriedades').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao excluir propriedade')
    } else {
      toast.success('Propriedade excluída com sucesso')
      setPropriedades(propriedades.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <SEO
        title="Gestão de Propriedades"
        description="Gerencie suas propriedades e áreas de plantio."
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Propriedades</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre e gerencie suas áreas para monitoramento.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-primary text-black hover:bg-primary/90 font-bold shadow-[0_0_15px_rgba(29,185,84,0.3)]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Propriedade
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-primary/20 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Propriedade</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Insira os dados da nova área de plantio ou pastagem.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPropriedade} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Propriedade</Label>
                <Input
                  id="nome"
                  required
                  className="bg-black border-white/10"
                  placeholder="Ex: Fazenda Boa Vista"
                  value={newProp.nome}
                  onChange={(e) => setNewProp({ ...newProp, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cultura">Cultura Principal</Label>
                <Select
                  required
                  value={newProp.cultura_principal}
                  onValueChange={(val) => setNewProp({ ...newProp, cultura_principal: val })}
                >
                  <SelectTrigger className="bg-black border-white/10">
                    <SelectValue placeholder="Selecione a cultura" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10">
                    <SelectItem value="Soja">Soja</SelectItem>
                    <SelectItem value="Milho">Milho</SelectItem>
                    <SelectItem value="Trigo">Trigo</SelectItem>
                    <SelectItem value="Algodão">Algodão</SelectItem>
                    <SelectItem value="Café">Café</SelectItem>
                    <SelectItem value="Cana-de-açúcar">Cana-de-açúcar</SelectItem>
                    <SelectItem value="Pecuária">Pecuária</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    required
                    type="number"
                    step="any"
                    className="bg-black border-white/10"
                    placeholder="Ex: -24.95"
                    value={newProp.latitude}
                    onChange={(e) => setNewProp({ ...newProp, latitude: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    required
                    type="number"
                    step="any"
                    className="bg-black border-white/10"
                    placeholder="Ex: -53.45"
                    value={newProp.longitude}
                    onChange={(e) => setNewProp({ ...newProp, longitude: e.target.value })}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-primary text-black hover:bg-primary/90"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Propriedade
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : propriedades.length === 0 ? (
        <div className="bg-black/40 border border-primary/20 rounded-2xl p-12 text-center flex flex-col items-center">
          <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma propriedade cadastrada</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Cadastre suas propriedades para obter análises de satélite, dados climáticos e
            recomendações de inteligência artificial.
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
          >
            Cadastrar Primeira Propriedade
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propriedades.map((prop) => (
            <Card
              key={prop.id}
              className="bg-black border-white/10 hover:border-primary/50 transition-colors group"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-white">{prop.nome}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(prop.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-primary font-medium">
                  Cultura: {prop.cultura_principal}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">
                    {prop.latitude && prop.longitude ? (
                      <>
                        Lat: {prop.latitude} <br /> Lng: {prop.longitude}
                      </>
                    ) : (
                      <span className="text-red-400 font-medium">
                        Coordenadas pendentes. Por favor, atualize.
                      </span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
