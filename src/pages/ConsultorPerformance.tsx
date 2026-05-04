import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { SEO } from '@/components/SEO'
import { Users, Eye, Link as LinkIcon, Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

export default function ConsultorPerformance() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPerformance() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('satellite_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('views_count', { ascending: false })

      if (!error && data) {
        setLinks(data.filter((d) => d.views_count > 0))
      }
      setLoading(false)
    }
    fetchPerformance()
  }, [])

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans text-white w-full animate-fade-in">
      <SEO
        title="Performance de Consultores"
        description="Acompanhe os acessos aos links compartilhados."
      />

      <main className="flex-1 container py-8 mx-auto space-y-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Performance de Consultores
            </h1>
            <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
              Acompanhe o engajamento dos seus agrônomos com as análises compartilhadas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black border border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total de Visualizações
              </CardTitle>
              <Eye className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {links.reduce((acc, curr) => acc + (curr.views_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black border border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Links Ativos</CardTitle>
              <LinkIcon className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{links.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black border border-white/10">
          <CardHeader>
            <CardTitle>Links Compartilhados Mais Acessados</CardTitle>
            <CardDescription className="text-zinc-400">
              Relação de análises de satélite e quantidade de visualizações externas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-zinc-500 animate-pulse">
                Carregando dados...
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                Nenhum link compartilhado foi acessado ainda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-zinc-300">Data da Análise</TableHead>
                      <TableHead className="text-zinc-300">Coordenadas</TableHead>
                      <TableHead className="text-zinc-300">NDVI</TableHead>
                      <TableHead className="text-right text-zinc-300">Visualizações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          {format(new Date(link.analysis_date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          {link.latitude}, {link.longitude}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              link.ndvi_value < 0.4
                                ? 'text-red-500'
                                : link.ndvi_value <= 0.6
                                  ? 'text-yellow-500'
                                  : 'text-green-500'
                            }
                          >
                            {link.ndvi_value}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {link.views_count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
