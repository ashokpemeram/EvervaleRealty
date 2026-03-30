import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

const baseLink =
  'text-sm font-medium tracking-wide transition-colors duration-300 ease-out'

export default function Navbar({ isHome }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const showSolid = !isHome || scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        showSolid
          ? 'bg-white/95 text-navy shadow-soft backdrop-blur'
          : 'bg-transparent text-white'
      }`}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-12"
        aria-label="Primary"
      >
        <Link
          to="/"
          className="text-sm font-semibold tracking-[0.2em] md:text-lg md:tracking-[0.25em]"
        >
          EVERVALE REALTY
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? 'text-gold'
                    : showSolid
                    ? 'text-navy/80 hover:text-navy'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`md:hidden rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/80 ${
              showSolid
                ? 'border-navy/20 text-navy'
                : 'border-white/40 text-white'
            }`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            MENU
          </button>
          <Link
            to="/contact"
            className={`hidden rounded-full px-5 py-2 text-xs font-semibold tracking-[0.2em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/80 md:inline-flex ${
              showSolid
                ? 'bg-gold text-navy hover:shadow-card'
                : 'bg-gold text-navy hover:shadow-card'
            }`}
          >
            CONTACT US
          </Link>
        </div>
      </nav>
      <div
        id="mobile-nav"
        className={`md:hidden ${menuOpen ? 'block' : 'hidden'} border-t ${
          showSolid
            ? 'border-navy/10 bg-white/95 text-navy'
            : 'border-white/10 bg-navy/90 text-white'
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? 'text-gold' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-2 inline-flex w-fit rounded-full bg-gold px-5 py-2 text-xs font-semibold tracking-[0.2em] text-navy"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </header>
  )
}
