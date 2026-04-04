import { cn } from '@/lib/utils'
import logoImg from '@/assets/2026-04-04t05-11-30-104z_logo_2d_moderno_para_agro_ia_design_criativo_s_m-3e5f5.png'

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Agro IA Logo"
      className={cn('h-8 w-8 object-contain rounded-md', className)}
    />
  )
}

export function LogoText({ className }: { className?: string }) {
  return (
    <span className={cn('font-bold tracking-tight', className)}>
      <span className="text-white">AGRO</span>
      <span className="text-primary">IA</span>
    </span>
  )
}
