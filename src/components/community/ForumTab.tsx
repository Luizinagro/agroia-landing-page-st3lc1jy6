import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Users, ArrowRight, User, Plus } from 'lucide-react'
import { useDatabase } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function ForumTab() {
  const { comunidadePosts, loading, addPost } = useDatabase()
  const [isOpen, setIsOpen] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const { toast } = useToast()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await addPost({
      titulo,
      categoria,
      conteudo: '...',
      data: new Date().toLocaleDateString('pt-BR'),
    })
    setIsOpen(false)
    setTitulo('')
    setCategoria('')
    toast({ title: 'Sucesso', description: 'Tópico criado com sucesso!' })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Tópico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Tópico</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Soja, Pecuária"
                />
              </div>
              <Button type="submit" className="w-full bg-[#1a3c34]">
                Publicar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {comunidadePosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border">
          Nenhum tópico encontrado. Seja o primeiro a publicar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comunidadePosts.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-md transition-shadow duration-200 border-[#1a3c34]/10 group"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="outline"
                    className="border-[#1a3c34] text-[#1a3c34] font-medium bg-[#1a3c34]/5"
                  >
                    {topic.categoria}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {topic.data}
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-[#1a3c34] transition-colors">
                  {topic.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${topic.id}`}
                    />
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span>Produtor Anônimo</span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Users className="w-4 h-4" /> 0 respostas
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-[#1a3c34] hover:bg-[#1a3c34]/5 hover:text-[#1a3c34] justify-between group-hover:bg-[#1a3c34]/5"
                >
                  Ver Discussão
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
