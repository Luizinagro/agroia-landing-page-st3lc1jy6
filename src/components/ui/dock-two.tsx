import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface DockProps {
  className?: string
  items: {
    icon: LucideIcon
    label: string
    onClick?: () => void
    isActive?: boolean
    disabled?: boolean
    className?: string
  }[]
}

interface DockIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
  isActive?: boolean
  disabled?: boolean
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, className, isActive, disabled }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.1, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={onClick}
        className={cn(
          'relative group p-2.5 md:p-3 rounded-xl',
          'transition-all duration-300 flex-shrink-0',
          isActive
            ? 'bg-primary/20 text-primary border border-primary/30 shadow-[inset_0_0_10px_rgba(29,185,84,0.2)]'
            : 'text-[#A0A0A0] hover:bg-white/5 hover:text-white border border-transparent',
          disabled &&
            'opacity-40 grayscale cursor-not-allowed hover:bg-transparent hover:text-[#A0A0A0]',
          className,
        )}
      >
        <Icon className="w-5 h-5" />
        <span
          className={cn(
            'absolute -top-10 left-1/2 -translate-x-1/2',
            'px-3 py-1.5 rounded-lg text-xs font-medium',
            'bg-black/95 border border-primary/20 text-white backdrop-blur-xl',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-200 whitespace-nowrap pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.6)]',
            disabled && 'group-hover:opacity-0',
          )}
        >
          {label}
        </span>
      </motion.button>
    )
  },
)
DockIconButton.displayName = 'DockIconButton'

const Dock = React.forwardRef<HTMLDivElement, DockProps>(({ items, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full flex items-center justify-center pointer-events-none', className)}
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        className={cn(
          'flex items-center gap-1 md:gap-2 p-2 rounded-2xl pointer-events-auto',
          'backdrop-blur-xl border shadow-[0_0_30px_rgba(0,0,0,0.5)]',
          'bg-[#0a0a0a]/80 border-primary/20',
          'hover:shadow-[0_0_40px_rgba(29,185,84,0.15)] transition-shadow duration-500',
          'overflow-x-auto max-w-[95vw] hide-scrollbar',
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        )}
      >
        {items.map((item) => (
          <DockIconButton key={item.label} {...item} />
        ))}
      </motion.div>
    </div>
  )
})
Dock.displayName = 'Dock'

export { Dock }
