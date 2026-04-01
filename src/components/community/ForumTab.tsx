import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Users, ArrowRight, User } from 'lucide-react'

const forumTopics = [
  {
    id: 1,
    category: 'Soja',
    title: 'Melhores práticas para plantio direto na palha',
    author: 'João Silva',
    replies: 24,
    date: 'Hoje, 08:30',
  },
  {
    id: 2,
    category: 'Milho',
    title: 'Controle da cigarrinha: o que funcionou nesta safra?',
    author: 'Carlos Mendes',
    replies: 56,
    date: 'Ontem, 14:15',
  },
  {
    id: 3,
    category: 'Pecuária',
    title: 'Suplementação de bezerros no período seco',
    author: 'Ana Costa',
    replies: 12,
    date: '2 dias atrás',
  },
  {
    id: 4,
    category: 'Fiscal',
    title: 'Dúvidas sobre o novo modelo de NFe do Produtor',
    author: 'Roberto Almeida',
    replies: 89,
    date: '1 semana atrás',
  },
]

export function ForumTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {forumTopics.map((topic) => (
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
                {topic.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {topic.date}
              </span>
            </div>
            <CardTitle className="text-lg group-hover:text-[#1a3c34] transition-colors">
              {topic.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Avatar className="w-6 h-6">
                <AvatarImage src={`https://img.usecurling.com/ppl/thumbnail?seed=${topic.id}`} />
                <AvatarFallback>
                  <User className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <span>{topic.author}</span>
              <span className="flex items-center gap-1 ml-auto">
                <Users className="w-4 h-4" /> {topic.replies} respostas
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
  )
}
