/* Button Component primitives - A component that displays a button - from shadcn/ui (exposes Button, buttonVariants) */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[20px] text-sm font-medium ring-offset-background transition-all duration-400 ease-bounce active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#22C55E] text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:bg-[#16A34A] hover:scale-105 hover:shadow-[0_10px_40px_rgba(34,197,94,0.5)]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105',
        outline:
          'border-2 border-[#8B5CF6] text-[#8B5CF6] bg-transparent hover:bg-[#8B5CF6] hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105',
        ghost:
          'text-foreground hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]',
        link: 'text-[#8B5CF6] underline-offset-4 hover:underline hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-[18px] px-3',
        lg: 'h-11 rounded-[22px] px-8',
        icon: 'h-10 w-10 rounded-[20px]',
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
