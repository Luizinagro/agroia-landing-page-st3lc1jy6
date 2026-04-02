import { useEffect, RefObject } from 'react'

export function useGsapAnimations(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!containerRef.current) return

    let ctx: any

    const init = () => {
      if (typeof window === 'undefined') return
      if (!(window as any).gsap || !(window as any).ScrollTrigger) {
        setTimeout(init, 200)
        return
      }

      const gsap = (window as any).gsap
      const ScrollTrigger = (window as any).ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const growElements = gsap.utils.toArray('.gsap-grow')
        growElements.forEach((el: any) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('is-active'),
            once: true,
          })
        })

        const staggerContainers = gsap.utils.toArray('.gsap-stagger-container')
        staggerContainers.forEach((container: any) => {
          const items = container.querySelectorAll('.gsap-stagger-item')
          ScrollTrigger.create({
            trigger: container,
            start: 'top 85%',
            onEnter: () => {
              items.forEach((item: HTMLElement, i: number) => {
                item.style.animationDelay = `${i * 0.1}s`
                item.classList.add('is-active')
              })
            },
            once: true,
          })
        })

        const parallaxHero = gsap.utils.toArray('.gsap-parallax-hero')
        parallaxHero.forEach((hero: any) => {
          gsap.to(hero, {
            y: 50,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        })
      }, containerRef)
    }

    init()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [containerRef])
}
