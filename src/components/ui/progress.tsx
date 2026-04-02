/* Progress Component - A component that displays a progress bar - from shadcn/ui (exposes Progress) */
import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => setWidth(value || 0), 50)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-[#1DB954]/20', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-[#1DB954] transition-all ease-out"
        style={{ width: `${width}%`, transitionDuration: '2000ms' }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
