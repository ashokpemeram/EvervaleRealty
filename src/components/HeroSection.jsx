import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const heroImage =
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=2000&q=80'

export default function HeroSection() {
  const heroRef = useRef(null)

  useEffect(() => {
    const element = heroRef.current
    if (!element) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (prefersReduced || isMobile) {
      element.style.setProperty('--hero-offset', '0px')
      return
    }

    const handleScroll = () => {
      const offset = Math.min(window.scrollY * 0.2, 70)
      element.style.setProperty('--hero-offset', `${offset}px`)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div
        ref={heroRef}
        className="hero-parallax absolute inset-0"
        style={{ backgroundImage: `url(${heroImage})` }}
        role="img"
        aria-label="Modern luxury villa at night"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/40 to-navy/90" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pt-28 pb-20 text-white lg:px-12">
        <p className="reveal w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.4em]" data-animate>
          PROPERTY. POWERED.
        </p>
        <div className="reveal" data-animate>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
            Find Your <span className="text-gold">Dream</span>
            <br />
            Portfolio
          </h1>
        </div>
        <p
          className="reveal max-w-2xl text-base text-white/80 md:text-lg"
          data-animate
        >
          Experience the Evervale advantage. We combine high-performance data
          with an old-world approach to luxury real estate acquisitions.
        </p>
        <div className="reveal flex flex-col gap-4 sm:flex-row" data-animate>
          <a
            href="#acquisitions"
            className="rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-[0.2em] text-navy transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/80"
          >
            EXPLORE PROPERTIES
          </a>
          <Link
            to="/about"
            className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/80"
          >
            OUR STORY
          </Link>
        </div>
      </div>
    </section>
  )
}
