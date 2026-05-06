import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Tractor, Wrench, Loader2, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

export function Maquinario() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState('')
  const [horas, setHoras] = useState('')

  useEffect(() => {
    if (user) fetchItems()
  }, [user])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('maquinario' as any)
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) setItems(data)
    setLoading(false)
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !horas) return

    const horasUso = Number(horas)
    const proxManut = horasUso + 250 // Estimativa base de 250h

    const { error } = await supabase.from('maquinario' as any).insert({
      user_id: user?.id,
      nome,
      horas_uso: horasUso,
      proxima_manutencao_horas: proxManut,
    })

    if (!error) {
      setNome('')
      setHoras('')
      fetchItems()
      toast({ title: 'Equipamento registrado com sucesso!' })
    }
  }

  const deleteItem = async (id: string) => {
    await supabase
      .from('maquinario' as any)
      .delete()
      .eq('id', id)
    fetchItems()
  }

  const registrarManutencao = async (id: string, horasAtuais: number) => {
    await supabase
      .from('maquinario' as any)
      .update({
        horas_uso: horasAtuais,
        proxima_manutencao_horas: horasAtuais + 250,
      })
      .eq('id', id)
    toast({ title: 'Manutenção registrada!' })
    fetchItems()
  }

  return (
    <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Central de Maquinário</h2>

      <form onSubmit={addItem} className="flex gap-4 mb-6 flex-wrap md:flex-nowrap">
        <Input
          placeholder="Nome do trator / equipamento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="flex-1 bg-black/50"
        />
        <Input
          type="number"
          placeholder="Horas de Uso"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
          className="w-40 bg-black/50"
        />
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-black w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Inserir
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 && (
            <p className="text-zinc-500 col-span-full">Nenhum maquinário cadastrado.</p>
          )}
          {items.map((item) => {
            const horasFaltantes = (item.proxima_manutencao_horas || 0) - (item.horas_uso || 0)
            const alerta = horasFaltantes <= 50

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${alerta ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-black/40'} flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`${alerta ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/10 text-primary'} p-2 rounded-lg`}
                  >
                    <Tractor className="w-5 h-5" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="h-8 w-8 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-bold text-white text-lg">{item.nome}</h3>

                <div className="flex justify-between items-end mt-4 mb-4">
                  <div>
                    <p className="text-xs text-zinc-400">Horas Totais</p>
                    <p className="font-medium text-white">{item.horas_uso}h</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Próx. Manutenção</p>
                    <p className={`font-bold ${alerta ? 'text-amber-500' : 'text-emerald-400'}`}>
                      Faltam {horasFaltantes}h
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => registrarManutencao(item.id, item.horas_uso)}
                  className="w-full bg-transparent border-white/20 hover:bg-white/10"
                >
                  <Wrench className="w-4 h-4 mr-2" /> Registrar Manutenção
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
