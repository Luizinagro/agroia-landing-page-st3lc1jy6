/* Button Component primitives - A component that displays a button - from shadcn/ui (exposes Button, buttonVariants) */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-medium ring-offset-background transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(29,185,84,0.4)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#1DB954] text-[#000000] hover:opacity-100',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-[#1DB954] text-[#1DB954] bg-transparent hover:bg-[#1DB954]/10',
        secondary: 'bg-[#000000] border border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10',
        ghost:
          'text-foreground hover:bg-white/5 hover:text-[#1DB954] hover:shadow-none hover:scale-100',
        link: 'text-[#1DB954] underline-offset-4 hover:underline hover:shadow-none hover:scale-100',
      },
      size: {
        default: 'px-[1.5rem] py-[0.75rem] h-auto',
        sm: 'h-9 rounded-[12px] px-3',
        lg: 'h-11 rounded-[12px] px-8',
        icon: 'h-10 w-10 rounded-[12px]',
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
