import { cn } from '@/lib/utils'
import logoImg from '@/assets/adobe-express-file-a4f11.png'

export function LogoText({ className }: { className?: string }) {
  return (
    <span
      className={cn('font-bold text-[26px] tracking-tight uppercase', className)}
      style={{ fontFamily: 'ui-rounded, "Nunito", "Varela Round", system-ui, sans-serif' }}
    >
      <span className="text-white">AGRO</span>
      <span className="text-primary">IA</span>
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <img src={logoImg} alt="Agro IA Logo" className="h-[72px] w-[72px] object-contain -mr-4" />
      <LogoText />
    </div>
  )
}
