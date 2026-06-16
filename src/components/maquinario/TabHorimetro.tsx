import { useState, useEffect } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

export function TabHorimetro({ maquinaId }: { maquinaId: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ horas: '', data: new Date().toISOString().split('T')[0] })

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await invokeMaquinario({ action: 'historico_horimetro', maquina_id: maquinaId })
      setData(res.reverse())
    } catch (e: any) {
      toast.error(e.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [maquinaId])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await invokeMaquinario({
        action: 'registrar_horimetro',
        maquina_id: maquinaId,
        ...form,
        horas: Number(form.horas),
      })
      toast.success('Horímetro atualizado')
      setForm({ horas: '', data: new Date().toISOString().split('T')[0] })
      fetch()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const chartConfig = { horas: { label: 'Horas de Uso', color: 'hsl(var(--primary))' } }

  if (loading)
    return (
      <div className="p-4 text-center text-zinc-500 animate-pulse">Carregando histórico...</div>
    )

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-end bg-zinc-900/50 p-4 rounded-xl border border-zinc-800"
      >
        <div className="flex-1">
          <label className="text-xs text-zinc-400 mb-1 block">Leitura atual do Horímetro</label>
          <Input
            required
            type="number"
            step="0.1"
            value={form.horas}
            onChange={(e) => setForm({ ...form, horas: e.target.value })}
            className="bg-black border-zinc-800 h-9"
            placeholder="Ex: 1250"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Data da Leitura</label>
          <Input
            required
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            className="bg-black border-zinc-800 w-36 h-9"
          />
        </div>
        <Button type="submit" className="h-9">
          Registrar
        </Button>
      </form>

      {data.length === 0 && (
        <p className="text-center text-zinc-500 py-4">
          Nenhum registro de horímetro para esta máquina.
        </p>
      )}

      {data.length > 0 && (
        <div className="bg-black p-5 rounded-xl border border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-300 mb-6">Evolução do Uso</h4>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 3" />
              <XAxis
                dataKey="data"
                stroke="#666"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(t) =>
                  new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                }
              />
              <YAxis stroke="#666" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="horas"
                stroke="var(--color-horas)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-horas)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}
