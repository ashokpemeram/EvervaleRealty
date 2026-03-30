import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]')
    if (!elements.length) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReduced || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
