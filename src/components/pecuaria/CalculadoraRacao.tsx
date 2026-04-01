import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDatabase } from '@/contexts/DatabaseContext'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ShieldCheck } from 'lucide-react'
import { checkRateLimit, logSystemEvent } from '@/lib/security'
import { useAuth } from '@/contexts/AuthContext'

const calcSchema = z.object({
  animalType: z.string().min(1, 'Selecione um tipo'),
  weight: z.coerce
    .number()
    .positive('O peso deve ser maior que zero.')
    .max(2000, 'Valor excede o limite (2000kg).'),
  phase: z.string().min(1, 'Selecione a fase'),
})

type CalcFormValues = z.infer<typeof calcSchema>

export function CalculadoraRacao() {
  const { addAnimal, loading } = useDatabase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<CalcFormValues>({
    resolver: zodResolver(calcSchema),
    defaultValues: {
      animalType: 'bovino',
      weight: 450,
      phase: 'terminacao',
    },
    mode: 'onChange',
  })

  const { animalType, weight, phase } = form.watch()
  const isValid = form.formState.isValid

  const feedResults = useMemo(() => {
    if (!weight || weight <= 0 || weight > 2000) return null
    const quantity =
      animalType === 'bovino' ? (weight * 0.02 * 30).toFixed(0) : (weight * 0.03 * 30).toFixed(0)
    const cost = (parseFloat(quantity) * 1.5).toFixed(2)
    const brand = animalType === 'bovino' ? 'Yara' : 'BASF'
    return { quantity, cost, brand }
  }, [animalType, weight, phase])

  const handleSave = async () => {
    if (!feedResults || !isValid) return

    // API Rate Limiting (10 reqs / min)
    const userId = user?.id || 'anonymous'
    const canSave = checkRateLimit('api_save_animal', userId, 10, 60 * 1000)

    if (!canSave) {
      toast({
        title: 'Ação Bloqueada',
        description: 'Muitas requisições. Por favor, aguarde um momento antes de tentar novamente.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      await addAnimal({
        tipo: animalType,
        peso: weight,
        fase: phase,
        racao_recomendada: feedResults.brand,
        custo_mensal: parseFloat(feedResults.cost),
      })
      toast({ title: 'Sucesso', description: 'Dados salvos com segurança na sua propriedade.' })
    } catch (e) {
      logSystemEvent('DB_ERROR', 'Falha ao salvar animal na base', userId)
      toast({
        title: 'Erro',
        description: 'Ocorreu um problema ao salvar os dados.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-[#1a3c34]/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-[#1a3c34] flex items-center gap-2">
          Calculadora de Ração <ShieldCheck className="w-5 h-5 text-[#f4d03f]" />
        </CardTitle>
        <CardDescription>
          Determine a estratégia de alimentação com validação rigorosa de dados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="animalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Animal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-[#1a3c34]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bovino">Bovino</SelectItem>
                      <SelectItem value="ovino">Ovino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[#1a3c34] bg-[#f4d03f]/40 px-2 py-1 rounded text-xs mt-1 inline-block" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso Atual (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="focus-visible:ring-[#1a3c34]" />
                  </FormControl>
                  <FormMessage className="text-[#1a3c34] bg-[#f4d03f]/40 px-2 py-1 rounded text-xs mt-1 inline-block" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fase de Produção</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-[#1a3c34]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cria">Cria</SelectItem>
                      <SelectItem value="recria">Recria</SelectItem>
                      <SelectItem value="terminacao">Terminação</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[#1a3c34] bg-[#f4d03f]/40 px-2 py-1 rounded text-xs mt-1 inline-block" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {feedResults && isValid && (
          <div className="mt-8 p-6 bg-[#1a3c34]/5 rounded-xl border border-[#1a3c34]/10 animate-in fade-in duration-300">
            <h4 className="text-lg font-semibold text-[#1a3c34] mb-4">Resultado da Análise</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-subtle border border-border">
                <p className="text-sm text-muted-foreground mb-1">Marca Recomendada</p>
                <p className="text-2xl font-bold text-[#1a3c34]">{feedResults.brand}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-subtle border border-border">
                <p className="text-sm text-muted-foreground mb-1">Quantidade Mensal</p>
                <p className="text-2xl font-bold text-[#1a3c34]">{feedResults.quantity} kg</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-subtle border border-border">
                <p className="text-sm text-muted-foreground mb-1">Custo Estimado</p>
                <p className="text-2xl font-bold text-[#1a3c34]">R$ {feedResults.cost}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[#1a3c34]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90 shadow-sm border-none font-semibold">
                  Validação Concluída
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Dados íntegros prontos para persistência.
                </span>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving || loading}
                className="bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 shadow-md"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#f4d03f]" /> : null}
                Persistir com Segurança
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
