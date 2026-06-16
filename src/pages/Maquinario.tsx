import { useEffect, useState } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Tractor, AlertTriangle, CheckCircle, MapPin, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { SEO } from '@/components/SEO'
import { MachineRegistrationModal } from '@/components/maquinario/MachineRegistrationModal'
import { MachineDetailModal } from '@/components/maquinario/MachineDetailModal'
import { Link } from 'react-router-dom'

export default function MaquinarioPage() {
  const [frota, setFrota] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regOpen, setRegOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState<string>('')
  const [hasPropriedades, setHasPropriedades] = useState<boolean | null>(null)

  useEffect(() => {
    import('@/lib/supabase/client').then(async ({ supabase }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { count } = await supabase
          .from('propriedades')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        setHasPropriedades((count || 0) > 0)
      }
    })
  }, [])

  const fetchFrota = async () => {
    setLoading(true)
    try {
      const res = await invokeMaquinario({ action: 'resumo_frota' })
      setFrota(res)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFrota()
  }, [])

  const openDetail = (id: string, nome: string) => {
    setDetailId(id)
    setDetailName(nome)
  }

  return (
    <div className="min-h-screen animate-fade-in text-white max-w-7xl mx-auto space-y-8">
      <SEO title="Maquinário" description="Gestão de frota, manutenções e despesas agrícolas" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Gestão de Maquinário
          </h1>
          <p className="text-zinc-400 mt-2 text-lg font-medium">
            Acompanhe horímetros, manutenções e documentos da frota.
          </p>
        </div>
        <Button
          onClick={() => setRegOpen(true)}
          className="bg-primary text-black font-bold hover:bg-primary/90 rounded-full shadow-[0_0_15px_rgba(29,185,84,0.3)] px-6"
        >
          <Plus className="w-5 h-5 mr-2" /> Cadastrar Máquina
        </Button>
      </div>

      {hasPropriedades === false && (
        <div className="bg-primary/10 border border-primary/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-primary mr-3 shrink-0" />
            <p className="text-white font-medium text-sm">
              Cadastre sua propriedade para dados personalizados da sua região 📍
            </p>
          </div>
          <Button
            asChild
            className="whitespace-nowrap w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_15px_rgba(29,185,84,0.3)]"
          >
            <Link to="/perfil">Cadastrar agora</Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frota?.maquinas?.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-black rounded-3xl border border-primary/20 shadow-[0_0_15px_rgba(29,185,84,0.05)]">
              <Tractor className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Frota Vazia</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                Cadastre seus tratores, colheitadeiras e implementos para começar a gerenciar
                manutenções e custos.
              </p>
              <Button
                onClick={() => setRegOpen(true)}
                variant="outline"
                className="mt-6 rounded-full border-primary/50 text-white hover:bg-primary/10"
              >
                Adicionar Primeira Máquina
              </Button>
            </div>
          ) : (
            frota?.maquinas?.map((m: any) => (
              <Card
                key={m.id}
                className="bg-black border border-primary/30 hover:border-primary transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(29,185,84,0.15)] rounded-2xl overflow-hidden group"
                onClick={() => openDetail(m.id, m.nome)}
              >
                <CardHeader className="bg-zinc-900/50 border-b border-white/5 pb-4">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span className="font-bold truncate pr-2">{m.nome}</span>
                    <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                      {m.tipo}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-zinc-500 mb-1">Horímetro</p>
                      <p className="font-bold text-lg text-white">
                        {m.horimetro_atual}{' '}
                        <span className="text-xs text-zinc-500 font-normal">h</span>
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-zinc-500 mb-1">Despesas no Ano</p>
                      <p className="font-bold text-lg text-red-400 truncate">
                        R$ {m.total_gasto_ano}
                      </p>
                    </div>
                  </div>

                  {m.documentos_vencendo > 0 ? (
                    <div className="flex items-center gap-2.5 text-sm text-amber-500 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl font-medium">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      {m.documentos_vencendo} documento(s) com atenção
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-sm text-green-500 bg-green-500/10 border border-green-500/20 p-3 rounded-xl font-medium">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      Documentação em dia
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      className="w-full text-zinc-400 hover:text-white hover:bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors rounded-xl"
                    >
                      <Wrench className="w-4 h-4 mr-2" /> Gerenciar Máquina
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <MachineRegistrationModal open={regOpen} onOpenChange={setRegOpen} onSuccess={fetchFrota} />
      <MachineDetailModal
        open={!!detailId}
        machineId={detailId}
        machineName={detailName}
        onOpenChange={(v: boolean) => {
          if (!v) {
            setDetailId(null)
            fetchFrota()
          }
        }}
      />
    </div>
  )
}
