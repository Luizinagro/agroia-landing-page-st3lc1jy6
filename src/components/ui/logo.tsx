import { cn } from '@/lib/utils'
import logoImg from '@/assets/adobe-express-file-a4f11.png'

export function LogoText({ className }: { className?: string }) {
  return (
    <span className={cn('font-black text-2xl tracking-tight text-white uppercase', className)}>
      AGRO<span className="text-[#00ff66]">IA</span>
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src={logoImg}
        alt="Agro IA Logo"
        className="h-12 w-12 object-contain drop-shadow-[0_0_12px_rgba(0,255,102,0.5)]"
      />
      <LogoText />
    </div>
  )
}
