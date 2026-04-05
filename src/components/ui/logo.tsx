import { cn } from '@/lib/utils'

export function LogoText({ className }: { className?: string }) {
  return (
    <span
      className={cn('font-extrabold text-[28px] tracking-tighter uppercase', className)}
      style={{
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <span className="text-white">AGRO</span>
      <span className="text-primary">IA</span>
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <LogoText />
    </div>
  )
}
