import { Button } from '@/components/ui/button'
import { Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PlanCard({ plan, isAnnual, isCurrent, updating, onUpgrade }: any) {
  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly
  const originalPrice = isAnnual && plan.priceMonthly > 0 ? plan.priceMonthly : null
  const priceLabel = price === 0 ? plan.priceLabel : `R$ ${price}`
  const btnText = isCurrent ? 'Seu Plano Atual' : plan.btnText

  return (
    <div
      className={cn(
        'relative flex flex-col p-6 md:p-8 rounded-[2rem] transition-all duration-300',
        plan.highlighted
          ? 'bg-zinc-900 border-2 border-primary shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)] z-10 scale-[1.02]'
          : 'bg-black border border-white/10 hover:border-white/20',
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-[0_0_15px_rgba(34,197,94,0.5)]">
          {plan.badge}
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
      <p className="text-zinc-400 text-sm font-medium mb-6 min-h-[40px]">{plan.description}</p>

      <div className="flex items-baseline gap-2 mb-8 text-primary">
        {originalPrice && (
          <span className="text-xl text-zinc-500 line-through">R$ {originalPrice}</span>
        )}
        <span className="text-4xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          {priceLabel}
        </span>
        {plan.period && <span className="font-bold text-sm text-zinc-500">{plan.period}</span>}
      </div>

      <div className="flex-1 space-y-6 mb-8 border-t border-white/5 pt-6">
        <ul className="space-y-3">
          {plan.permissionsAllowed.map((f: string, j: number) => (
            <li key={`allow-${j}`} className="flex items-start gap-3 text-sm text-zinc-300">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="leading-tight">{f}</span>
            </li>
          ))}
          {plan.permissionsDenied?.map((f: string, j: number) => (
            <li key={`deny-${j}`} className="flex items-start gap-3 text-sm text-zinc-500">
              <X className="w-4 h-4 text-red-500/70 shrink-0 mt-0.5" />
              <span className="leading-tight">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        size="lg"
        variant={plan.highlighted ? 'default' : 'secondary'}
        className={cn(
          'w-full font-bold shadow-lg transition-all rounded-full',
          isCurrent
            ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800 cursor-not-allowed'
            : plan.highlighted
              ? 'bg-primary text-black hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'
              : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105',
        )}
        disabled={isCurrent || updating !== null}
        onClick={() => onUpgrade(plan)}
      >
        {updating === plan.name ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
        ) : null}
        {btnText}
      </Button>
    </div>
  )
}
