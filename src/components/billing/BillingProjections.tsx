import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, Sprout, Coins, HandCoins } from 'lucide-react'

export function BillingProjections() {
  const [hectares, setHectares] = useState<string>('50')

  const projections = useMemo(() => {
    const ha = parseFloat(hectares) || 0
    return {
      revenue: ha * 4500,
      costs: ha * 1800,
      roi: ha * 2700,
    }
  }, [hectares])

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="space-y-8 animate-in fade-in-up duration-500">
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-agro-yellow/20 text-agro-yellow rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Calculadora de Projeções</CardTitle>
              <CardDescription className="text-white/60">
                Simule seus ganhos e custos baseados no tamanho da sua área de plantio.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-3">
            <Label htmlFor="hectares" className="text-lg">
              Quantos hectares?
            </Label>
            <div className="relative">
              <Input
                id="hectares"
                type="number"
                value={hectares}
                onChange={(e) => setHectares(e.target.value)}
                className="bg-white/10 border-white/20 text-white text-xl py-6 pl-4 pr-12 focus-visible:ring-agro-yellow"
                placeholder="Ex: 100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">
                ha
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-5 h-5 text-blue-400" />
              <h4 className="font-medium text-white/80">Receita Esperada</h4>
            </div>
            <p className="text-3xl font-bold">{formatBRL(projections.revenue)}</p>
            <p className="text-sm text-white/50 mt-2">
              Estimativa bruta baseada em médias regionais
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="w-5 h-5 text-orange-400" />
              <h4 className="font-medium text-white/80">Custos de Insumos</h4>
            </div>
            <p className="text-3xl font-bold">{formatBRL(projections.costs)}</p>
            <p className="text-sm text-white/50 mt-2">Sementes, fertilizantes e defensivos</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HandCoins className="w-5 h-5 text-green-400" />
              <h4 className="font-medium text-white/80">ROI Estimado</h4>
            </div>
            <p className="text-3xl font-bold text-green-400">{formatBRL(projections.roi)}</p>
            <p className="text-sm text-white/50 mt-2">Retorno sobre o investimento projetado</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
