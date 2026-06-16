import { Check, X } from 'lucide-react'
import { COMPARISON_FEATURES } from '@/data/plans-data'
import { cn } from '@/lib/utils'

export function PlanComparison() {
  return (
    <div className="mt-24 max-w-5xl mx-auto overflow-x-auto pb-4">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-4">Compare os Planos</h3>
        <p className="text-zinc-400">Entenda os detalhes de cada pacote antes de escolher.</p>
      </div>
      <table className="w-full text-sm text-left min-w-[800px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 font-semibold text-zinc-300">Recurso</th>
            <th className="p-4 font-semibold text-zinc-300 text-center">Explorador</th>
            <th className="p-4 font-semibold text-zinc-300 text-center">Lavoura</th>
            <th className="p-4 font-semibold text-zinc-300 text-center">Rebanho</th>
            <th className="p-4 font-bold text-primary text-center bg-primary/5 rounded-t-xl">
              Completo
            </th>
            <th className="p-4 font-semibold text-zinc-300 text-center">Cooperativa</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_FEATURES.map((feature, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-zinc-400">{feature.name}</td>
              {feature.values.map((val, j) => (
                <td
                  key={j}
                  className={cn('p-4 text-center text-zinc-300', j === 3 ? 'bg-primary/5' : '')}
                >
                  {typeof val === 'boolean' ? (
                    val ? (
                      <span className="text-lg">✅</span>
                    ) : (
                      <span className="text-lg opacity-50">❌</span>
                    )
                  ) : (
                    <span className={j === 3 ? 'font-medium text-primary' : ''}>{val}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
