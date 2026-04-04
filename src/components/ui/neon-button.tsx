import * as React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface NeonLinkProps extends LinkProps {
  className?: string
}

export const NeonLink = React.forwardRef<HTMLAnchorElement, NeonLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:-translate-y-0.5',
          className,
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    )
  },
)
NeonLink.displayName = 'NeonLink'

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:-translate-y-0.5',
          className,
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    )
  },
)
NeonButton.displayName = 'NeonButton'
