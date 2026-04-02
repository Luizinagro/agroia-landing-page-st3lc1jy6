/* Button Component primitives - A component that displays a button - from shadcn/ui (exposes Button, buttonVariants) */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-bold ring-offset-background transition-all duration-300 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#00FF41] text-[#0A0E27] shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:bg-[#00FF41] hover:text-[#0A0E27] hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02]',
        outline:
          'border-2 border-[#00FF41] text-[#00FF41] bg-transparent hover:bg-[#00FF41] hover:text-[#0A0E27]',
        secondary:
          'bg-[#1A1F3A] text-white hover:bg-[#00FF41] hover:text-[#0A0E27] hover:scale-[1.02]',
        ghost:
          'text-foreground hover:text-[#00FF41] hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]',
        link: 'text-[#00FF41] underline-offset-4 hover:underline hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]',
      },
      size: {
        default: 'px-[1.5rem] py-[0.75rem] h-auto',
        sm: 'h-9 rounded-[8px] px-3',
        lg: 'h-11 rounded-[8px] px-8',
        icon: 'h-10 w-10 rounded-[8px]',
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
