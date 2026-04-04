import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type Lead = {
  id: string
  nome: string
  status: string
  valor_estimado: number
}

const COLUMNS = ['Novo', 'Em Negociação', 'Fechado ganho', 'Perdido']

export function CrmPipeline() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('crm_leads' as any)
      .select('id, nome, status, valor_estimado')

    if (error) {
      toast.error('Erro ao carregar leads para o pipeline')
    } else {
      const normalized = (data || []).map((l: any) => ({
        ...l,
        status: l.status === 'Convertido' ? 'Fechado ganho' : l.status || 'Novo',
      }))
      setLeads(normalized)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const moveLead = async (leadId: string, newStatus: string) => {
    const originalLeads = [...leads]
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))

    const { error } = await supabase
      .from('crm_leads' as any)
      .update({ status: newStatus })
      .eq('id', leadId)

    if (error) {
      toast.error('Erro ao mover lead')
      setLeads(originalLeads)
    } else {
      toast.success(`Lead movido para ${newStatus}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => l.status === col)
        return (
          <div key={col} className="flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-semibold text-white/90">{col}</h3>
              <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                {colLeads.length}
              </Badge>
            </div>
            <div className="flex-1 bg-black/40 border border-primary/20 rounded-xl p-3 min-h-[500px] flex flex-col gap-3">
              {colLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className="bg-black/80 border-primary/30 hover:border-primary/60 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="font-medium text-white">{lead.nome}</div>
                    <div className="text-sm text-primary mt-2 font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(lead.valor_estimado || 0)}
                    </div>
                    <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                      {COLUMNS.filter((c) => c !== col).map((targetCol) => (
                        <button
                          key={targetCol}
                          onClick={() => moveLead(lead.id, targetCol)}
                          className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2 py-1 rounded transition-colors"
                        >
                          Mover p/ {targetCol}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {colLeads.length === 0 && (
                <div className="text-center text-white/30 text-sm py-8 border-2 border-dashed border-primary/20 rounded-lg h-32 flex items-center justify-center">
                  Nenhum lead
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
