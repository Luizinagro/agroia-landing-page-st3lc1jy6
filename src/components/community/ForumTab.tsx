import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Users, ArrowRight, User, Plus, Edit2, Trash2 } from 'lucide-react'
import { useDatabase, Post } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function ForumTab() {
  const { comunidadePosts, loading, addPost, updatePost, deletePost } = useDatabase()
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [conteudo, setConteudo] = useState('')
  const { toast } = useToast()

  const resetForm = () => {
    setTitulo('')
    setCategoria('')
    setConteudo('')
    setEditId(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (p: Post) => {
    setTitulo(p.titulo)
    setCategoria(p.categoria)
    setConteudo(p.conteudo)
    setEditId(p.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await updatePost(editId, { titulo, categoria, conteudo })
        toast({ title: 'Sucesso', description: 'Tópico atualizado!' })
      } else {
        await addPost({ titulo, categoria, conteudo, data: new Date().toLocaleDateString('pt-BR') })
        toast({ title: 'Sucesso', description: 'Tópico criado com sucesso!' })
      }
      setIsOpen(false)
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar tópico.', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este tópico?')) {
      await deletePost(id)
      toast({ title: 'Excluído', description: 'Tópico removido com sucesso.' })
    }
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
            <Button
              onClick={handleOpenNew}
              className="bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Tópico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#1a3c34]">
                {editId ? 'Editar Tópico' : 'Criar Novo Tópico'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Input required value={conteudo} onChange={(e) => setConteudo(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-[#1a3c34] text-[#f4d03f] font-bold">
                  Publicar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {comunidadePosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-[#1a3c34]/10 shadow-sm">
          Nenhum tópico encontrado. Seja o primeiro a publicar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comunidadePosts.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-md transition-shadow duration-200 border-[#1a3c34]/10 group flex flex-col"
            >
              <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="outline"
                    className="border-[#1a3c34] text-[#1a3c34] font-medium bg-[#f4d03f]/20"
                  >
                    {topic.categoria}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground flex items-center mr-2">
                      <Clock className="w-3 h-3 mr-1" /> {topic.data}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-blue-50"
                      onClick={() => handleOpenEdit(topic)}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-red-50"
                      onClick={() => handleDelete(topic.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-[#1a3c34] transition-colors">
                  {topic.titulo}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{topic.conteudo}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground border-t pt-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${topic.id}`}
                    />
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span>Produtor Autor</span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Users className="w-4 h-4" /> 0
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="ghost"
                  className="w-full text-[#1a3c34] hover:bg-[#1a3c34]/5 justify-between group-hover:bg-[#1a3c34]/5"
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
