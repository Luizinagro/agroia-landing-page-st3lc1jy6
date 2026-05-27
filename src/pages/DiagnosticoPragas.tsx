import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  Bug,
  Camera,
  Upload,
  MapPin,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const CULTURAS = ['Soja', 'Milho', 'Trigo', 'Algodão', 'Café', 'Cana-de-açúcar']

export default function DiagnosticoPragas() {
  const { user } = useAuth() as any
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cultura, setCultura] = useState<string>('')
  const [descricao, setDescricao] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user?.id) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    if (!user?.id) return
    const { data, error } = await supabase
      .from('diagnosticos_pragas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data && !error) {
      setHistory(data)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResult(null)
    }
  }

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          toast.success('Localização capturada com sucesso!')
        },
        (error) => {
          console.error(error)
          toast.warning('Não foi possível obter localização. Prosseguindo sem coordenadas.')
        },
      )
    } else {
      toast.warning('Geolocalização não suportada no seu navegador.')
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        } else {
          reject(new Error('Falha ao converter arquivo'))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Por favor, selecione uma imagem para análise.')
      return
    }
    if (!cultura) {
      toast.error('Por favor, selecione a cultura.')
      return
    }

    try {
      setLoading(true)
      const base64 = await fileToBase64(file)
      const mimeType = file.type

      if (!location && 'geolocation' in navigator) {
        getLocation()
      }

      const { data, error } = await supabase.functions.invoke('diagnostico-praga', {
        body: {
          imagem_base64: base64,
          mime_type: mimeType,
          cultura,
          descricao,
          latitude: location?.lat,
          longitude: location?.lng,
        },
      })

      if (error) throw error

      if (data.success) {
        setResult(data.data)
        toast.success('Análise concluída com sucesso!')
        fetchHistory()
      } else {
        throw new Error(data.error || 'Erro desconhecido')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Falha ao realizar diagnóstico: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity?: string | null) => {
    const s = severity?.toLowerCase() || ''
    if (s.includes('baixa')) return 'bg-green-500/10 text-green-500 border-green-500/20'
    if (s.includes('media') || s.includes('média'))
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    if (s.includes('alta') || s.includes('critica') || s.includes('crítica'))
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bug className="w-8 h-8 text-primary" />
          Diagnóstico de Pragas
        </h1>
        <p className="text-zinc-400">
          Envie uma foto da sua lavoura e receba um diagnóstico imediato com IA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-950/50 border-primary/20 h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Nova Análise</CardTitle>
            <CardDescription>
              Preencha os dados e anexe uma imagem nítida da planta afetada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cultura</Label>
              <Select value={cultura} onValueChange={setCultura}>
                <SelectTrigger className="bg-black/50 border-zinc-800">
                  <SelectValue placeholder="Selecione a cultura..." />
                </SelectTrigger>
                <SelectContent>
                  {CULTURAS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Localização (Opcional)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={getLocation}
                  className="h-8 px-2 text-xs"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {location ? 'Atualizar Local' : 'Capturar Local'}
                </Button>
              </div>
              {location && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Lat: {location.lat.toFixed(4)}, Lng:{' '}
                  {location.lng.toFixed(4)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descrição / Sintomas (Opcional)</Label>
              <Textarea
                placeholder="Descreva o que você está observando na planta..."
                className="bg-black/50 border-zinc-800 resize-none"
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem da Planta</Label>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10 hover:text-primary"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Tirar Foto
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10 hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Galeria
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>

                {preview && (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
              onClick={handleSubmit}
              disabled={loading || !file || !cultura}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando Imagem...
                </>
              ) : (
                'Analisar com IA'
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {result && (
            <Card className="bg-zinc-950/80 border-primary shadow-[0_0_15px_rgba(29,185,84,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-primary flex items-center gap-2">
                      <Bug className="w-5 h-5" />
                      {result.diagnostico?.identificado || 'Análise Concluída'}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      {result.diagnostico?.nome_cientifico && (
                        <span className="italic">{result.diagnostico.nome_cientifico}</span>
                      )}
                    </CardDescription>
                  </div>
                  {result.severidade?.nivel && (
                    <Badge variant="outline" className={getSeverityColor(result.severidade.nivel)}>
                      Severidade {result.severidade.nivel}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {result.diagnostico?.descricao}
                  </p>
                </div>

                {result.tratamento && (
                  <div className="bg-black/40 rounded-lg p-4 border border-white/5 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-white">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Tratamento Recomendado
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500 block">Produto</span>
                        <span className="text-zinc-200">
                          {result.tratamento.produto_recomendado || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Dose</span>
                        <span className="text-zinc-200">{result.tratamento.dose || '-'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-zinc-500 block">Modo de Aplicação</span>
                        <span className="text-zinc-200">
                          {result.tratamento.modo_aplicacao || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {result.prevencao && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-white">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Ações Preventivas
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
                      {result.prevencao.acoes?.map((acao: string, i: number) => (
                        <li key={i}>{acao}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-white/5 pt-4">
                <Button
                  variant="outline"
                  className="w-full border-zinc-800 text-zinc-300 hover:text-white"
                  onClick={() => {
                    setResult(null)
                    setFile(null)
                    setPreview(null)
                    setDescricao('')
                  }}
                >
                  Fazer Nova Análise
                </Button>
              </CardFooter>
            </Card>
          )}

          {!result && history.length > 0 && (
            <Card className="bg-zinc-950/50 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Análises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-black/40 border border-white/5 flex justify-between items-center cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => setResult(item.analise_completa)}
                    >
                      <div>
                        <p className="font-medium text-sm text-zinc-200">
                          {item.praga_identificada || 'Análise'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')} • {item.cultura}
                        </p>
                      </div>
                      <Badge variant="outline" className={getSeverityColor(item.severidade)}>
                        {item.severidade || 'Concluído'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!result && history.length === 0 && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-zinc-950/30 rounded-xl border border-dashed border-white/10">
              <Info className="w-12 h-12 text-zinc-600 mb-4" />
              <p className="text-zinc-400 max-w-sm">
                Seu histórico de diagnósticos aparecerá aqui. Envie a primeira imagem para começar a
                identificar pragas e doenças na sua lavoura.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
