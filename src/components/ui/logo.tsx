import { cn } from '@/lib/utils'
import logoImg from '@/assets/adobe-express-file-a4f11.png'

export function LogoText({ className }: { className?: string }) {
  return (
    <span className={cn('font-black text-[20px] tracking-tight uppercase', className)}>
      <span className="text-white">AGRO</span>
      <span className="text-primary">IA</span>
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <img
        src={logoImg}
        alt="Agro IA Logo"
        className="h-[72px] w-[72px] object-contain drop-shadow-[0_0_12px_rgba(0,255,102,0.5)] -mr-4"
      />
      <LogoText />
    </div>
  )
}
