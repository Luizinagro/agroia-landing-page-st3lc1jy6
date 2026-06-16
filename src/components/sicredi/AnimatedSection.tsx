import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export const AnimatedSection = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8')
          entry.target.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={cn('opacity-0 translate-y-8 transition-all duration-700 ease-out', className)}
      id={id}
    >
      {children}
    </section>
  )
}
