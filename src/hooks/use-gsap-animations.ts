import { useEffect } from 'react'

declare global {
  interface Window {
    gsap: any
    ScrollTrigger: any
  }
}

export function useGsapAnimations(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const loadGSAP = async () => {
      if (typeof window === 'undefined') return

      if (!window.gsap) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
          script.onload = () => resolve()
          document.head.appendChild(script)
        })
      }

      if (!window.ScrollTrigger) {
        await new Promise<void>((resolve) => {
          const script2 = document.createElement('script')
          script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
          script2.onload = () => resolve()
          document.head.appendChild(script2)
        })
      }

      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger)
        initAnimations()
      }
    }

    const initAnimations = () => {
      if (!ref.current) return
      const gsap = window.gsap

      const elements = ref.current.querySelectorAll('.gsap-grow')
      elements.forEach((el: any) => {
        gsap.fromTo(
          el,
          { scaleY: 0, opacity: 0, transformOrigin: 'bottom center' },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          },
        )
      })

      const staggers = ref.current.querySelectorAll('.gsap-stagger-container')
      staggers.forEach((container: any) => {
        gsap.fromTo(
          container.querySelectorAll('.gsap-stagger-item'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
            },
          },
        )
      })

      const parallaxHero = ref.current.querySelector('.gsap-parallax-hero')
      if (parallaxHero) {
        gsap.to(parallaxHero, {
          y: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }

    const timeout = setTimeout(() => {
      loadGSAP()
    }, 100)

    return () => {
      clearTimeout(timeout)
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t: any) => t.kill())
      }
    }
  }, [ref])
}
