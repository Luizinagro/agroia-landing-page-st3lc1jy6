import { cn } from '@/lib/utils'
import logoImg from '@/assets/adobe-express-file-a4f11.png'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src={logoImg}
        alt="Agro IA Logo"
        className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
      />
      <span className="font-bold text-2xl tracking-tight text-white uppercase">
        AGRO<span className="text-green-500 ml-1">IA</span>
      </span>
    </div>
  )
}
