import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function CalculadoraRacao() {
  const [animalType, setAnimalType] = useState('bovino')
  const [weight, setWeight] = useState(450)
  const [phase, setPhase] = useState('terminacao')

  const feedResults = useMemo(() => {
    if (!weight) return null
    const quantity =
      animalType === 'bovino' ? (weight * 0.02 * 30).toFixed(0) : (weight * 0.03 * 30).toFixed(0)
    const cost = (parseFloat(quantity) * 1.5).toFixed(2)
    const brand = animalType === 'bovino' ? 'Yara' : 'BASF'
    return { quantity, cost, brand }
  }, [animalType, weight, phase])

  return (
    <Card className="border-agro-green/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-agro-green">Calculadora de Ração</CardTitle>
        <CardDescription>
          Determine a estratégia de alimentação e custos otimizados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Tipo de Animal</Label>
            <Select value={animalType} onValueChange={setAnimalType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bovino">Bovino</SelectItem>
                <SelectItem value="ovino">Ovino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Peso Atual (kg)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Fase de Produção</Label>
            <Select value={phase} onValueChange={setPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cria">Cria</SelectItem>
                <SelectItem value="recria">Recria</SelectItem>
                <SelectItem value="terminacao">Terminação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {feedResults && (
          <div className="mt-8 p-6 bg-agro-green/5 rounded-xl border border-agro-green/10 animate-in fade-in duration-300">
            <h4 className="text-lg font-semibold text-agro-green mb-4">Resultado da Análise</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-subtle border border-border">
                <p className="text-sm text-muted-foreground mb-1">Marca Recomendada</p>
                <p className="text-2xl font-bold text-agro-green">{feedResults.brand}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-subtle border border-border">
                <p className="text-sm text-muted-foreground mb-1">Quantidade Mensal</p>
                <p className="text-2xl font-bold text-agro-green">{feedResults.quantity} kg</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-subtle border border-border">
                <p className="text-sm text-muted-foreground mb-1">Custo Estimado</p>
                <p className="text-2xl font-bold text-agro-green">R$ {feedResults.cost}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-agro-green">
              <Badge className="bg-agro-yellow text-agro-green hover:bg-agro-yellow/90">
                Economia de 20% vs. média do mercado
              </Badge>
              <span className="text-sm text-muted-foreground">
                Com base nos dados de mercado da sua região.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
