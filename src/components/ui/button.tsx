/* Button Component primitives - A component that displays a button - from shadcn/ui (exposes Button, buttonVariants) */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#1DB954] text-[#000000] hover:bg-[#1aa34a]',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-[#1DB954] text-[#1DB954] bg-transparent hover:bg-[#1DB954]/10',
        secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
        ghost:
          'text-white hover:bg-white/10 hover:text-[#1DB954] hover:shadow-none hover:scale-100',
        link: 'text-[#1DB954] underline-offset-4 hover:underline hover:shadow-none hover:scale-100',
      },
      size: {
        default: 'px-6 py-3 h-auto',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
