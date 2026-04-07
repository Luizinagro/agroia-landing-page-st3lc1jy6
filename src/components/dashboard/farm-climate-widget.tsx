import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Cloud, Droplets, Wind, ThermometerSun, MapPin, Loader2, Plus, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function FarmClimateWidget() {
  const { user } = useAuth() as any
  const { toast } = useToast()

  const [properties, setProperties] = useState<any[]>([])
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [climateData, setClimateData] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [nome, setNome] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [cultura, setCultura] = useState('')

  useEffect(() => {
    if (user) fetchProperties()
  }, [user])

  const fetchProperties = async () => {
    const { data } = await supabase
      .from('propriedades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      setProperties(data)
      setSelectedProperty(data[0])
    }
  }

  useEffect(() => {
    if (!selectedProperty) return

    fetchClimateData(selectedProperty)

    // Auto-update every 30 minutes
    const interval = setInterval(
      () => {
        fetchClimateData(selectedProperty)
      },
      30 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [selectedProperty])

  const fetchClimateData = async (prop: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('buscar-dados-inmet', {
        body: { latitude: prop.latitude, longitude: prop.longitude, propriedade_id: prop.id },
      })

      if (error) throw error
      if (!data?.success) throw new Error(data?.error || 'Erro desconhecido na API do INMET.')

      setClimateData(data.data)
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao buscar clima',
        description:
          err.message || 'Falha na comunicação com a API do INMET. Tente novamente mais tarde.',
        variant: 'destructive',
      })
      setClimateData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('propriedades')
        .insert({
          user_id: user.id,
          nome,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          cultura_principal: cultura,
        })
        .select()
        .single()

      if (error) throw error

      setProperties([data, ...properties])
      setSelectedProperty(data)
      setIsAdding(false)
      setNome('')
      setLatitude('')
      setLongitude('')
      setCultura('')

      toast({
        title: 'Propriedade Adicionada',
        description: 'Buscando dados climáticos em tempo real...',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#1DB954]/50 via-cyan-500/30 to-[#1DB954]/50 p-[1px] shadow-[0_0_40px_rgba(29,185,84,0.15)] animate-fade-in">
      <div className="rounded-3xl bg-[#050A08] p-6 md:p-8 h-full flex flex-col gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-cyan-400 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-[#1DB954]" />
              Inteligência Climática INMET
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Monitoramento contínuo em tempo real com dados oficiais.
            </p>
          </div>

          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant="outline"
            className={cn(
              'rounded-full border-[#1DB954]/30 font-bold transition-all',
              isAdding
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30'
                : 'bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 hover:text-[#1DB954]',
            )}
          >
            {isAdding ? (
              'Cancelar Cadastro'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Cadastrar Propriedade
              </>
            )}
          </Button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleAddFarm}
            className="bg-black/60 p-6 rounded-2xl border border-white/5 space-y-4 animate-fade-in-down relative z-10 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-300 font-semibold">Nome da Propriedade</Label>
                <Input
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-black/50 border-white/10 text-white focus:border-[#1DB954] h-12 rounded-xl"
                  placeholder="Ex: Fazenda Boa Vista"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 font-semibold">Cultura Principal</Label>
                <Input
                  required
                  value={cultura}
                  onChange={(e) => setCultura(e.target.value)}
                  className="bg-black/50 border-white/10 text-white focus:border-[#1DB954] h-12 rounded-xl"
                  placeholder="Ex: Soja, Milho, Trigo"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 font-semibold">Latitude</Label>
                <Input
                  required
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="bg-black/50 border-white/10 text-white focus:border-[#1DB954] h-12 rounded-xl font-mono"
                  placeholder="-15.7938"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 font-semibold">Longitude</Label>
                <Input
                  required
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="bg-black/50 border-white/10 text-white focus:border-[#1DB954] h-12 rounded-xl font-mono"
                  placeholder="-47.8827"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#1DB954] to-cyan-600 text-black font-extrabold rounded-full px-8 h-12 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5 mr-2" />
                )}
                Salvar Fazenda e Monitorar
              </Button>
            </div>
          </form>
        )}

        {!isAdding && properties.length === 0 && (
          <div className="text-center py-16 px-4 bg-black/40 rounded-2xl border border-white/5 relative z-10 backdrop-blur-sm">
            <div className="w-20 h-20 bg-[#1DB954]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout className="w-10 h-10 text-[#1DB954]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Nenhuma fazenda monitorada</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              Adicione sua primeira propriedade para iniciar o rastreamento climático e a
              inteligência da sua safra.
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-[#1DB954] text-black hover:bg-[#1DB954]/90 rounded-full px-8 h-12 font-extrabold shadow-[0_0_20px_rgba(29,185,84,0.3)]"
            >
              <Plus className="w-5 h-5 mr-2" /> Cadastrar Minha Fazenda
            </Button>
          </div>
        )}

        {!isAdding && properties.length > 0 && (
          <div className="space-y-6 relative z-10">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
              {properties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className={cn(
                    'px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 snap-center border',
                    selectedProperty?.id === p.id
                      ? 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/50 shadow-[0_0_15px_rgba(29,185,84,0.2)]'
                      : 'bg-black/50 text-gray-400 border-white/10 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <MapPin className="w-3 h-3 inline-block mr-2 opacity-70" />
                  {p.nome}
                </button>
              ))}
            </div>

            {loading && !climateData ? (
              <div className="flex flex-col items-center justify-center py-16 bg-black/50 rounded-2xl border border-[#1DB954]/20 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#1DB954]/20 border-t-[#1DB954] rounded-full animate-spin"></div>
                  <Cloud className="w-6 h-6 text-[#1DB954] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[#1DB954] font-bold mt-6 tracking-wide animate-pulse">
                  Sincronizando radares do INMET...
                </p>
              </div>
            ) : climateData ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
                <div className="bg-black/60 p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all flex flex-col items-center justify-center text-center gap-3 group backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-orange-500/20 transition-colors" />
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <ThermometerSun className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Temperatura
                    </p>
                    <p className="text-4xl font-black text-white tracking-tight">
                      {climateData.temperatura}°
                      <span className="text-xl text-gray-500 font-medium">C</span>
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex flex-col items-center justify-center text-center gap-3 group backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Droplets className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Umidade
                    </p>
                    <p className="text-4xl font-black text-white tracking-tight">
                      {climateData.umidade}
                      <span className="text-xl text-gray-500 font-medium">%</span>
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center text-center gap-3 group backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Cloud className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Precipitação
                    </p>
                    <p className="text-4xl font-black text-white tracking-tight">
                      {climateData.precipitacao}
                      <span className="text-xl text-gray-500 font-medium">mm</span>
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center text-center gap-3 group backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Wind className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Vento
                    </p>
                    <p className="text-4xl font-black text-white tracking-tight">
                      {climateData.vento}
                      <span className="text-xl text-gray-500 font-medium">km/h</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-sm">
                <Cloud className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium text-lg">
                  Nenhum dado climático disponível no momento.
                </p>
                <Button
                  onClick={() => fetchClimateData(selectedProperty)}
                  variant="outline"
                  className="mt-6 border-[#1DB954]/30 text-[#1DB954] hover:bg-[#1DB954]/10 rounded-full"
                >
                  Tentar Nova Sincronização
                </Button>
              </div>
            )}

            {climateData && (
              <div className="flex justify-between items-center px-4 bg-black/30 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
                  </span>
                  <p className="text-xs font-medium text-[#1DB954]">Auto-Sync Ativo (30m)</p>
                </div>
                <p className="text-xs font-medium text-gray-400">
                  Última atualização:{' '}
                  {new Date(climateData.data_atualizacao).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
