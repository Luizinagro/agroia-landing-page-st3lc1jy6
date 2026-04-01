import { ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-up'
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver()

  return (
    <div
      ref={ref}
      className={cn('opacity-0', isIntersecting && `animate-${animation}`, className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
