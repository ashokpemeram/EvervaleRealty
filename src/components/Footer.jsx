import { Link } from 'react-router-dom'
import { InstagramIcon, LinkedinIcon, XIcon } from './Icons'

const socialLinks = [
  { label: 'LinkedIn', href: '#', icon: LinkedinIcon },
  { label: 'Instagram', href: '#', icon: InstagramIcon },
  { label: 'X', href: '#', icon: XIcon },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div>
          <h3 className="text-lg font-semibold tracking-[0.2em]">
            EVERVALE REALTY
          </h3>
          <p className="mt-4 text-sm text-white/70">
            A private real estate advisory specializing in off-market luxury
            acquisitions and portfolio stewardship.
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-gold hover:text-gold"
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.2em]">EXPLORE ASSETS</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <Link to="/services">New Acquisitions</Link>
            </li>
            <li>
              <Link to="/services">Asset Management</Link>
            </li>
            <li>
              <a href="#">Private Listings</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.2em]">THE FIRM</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <Link to="/about">Our Story</Link>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.2em]">GOVERNANCE</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Compliance</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-white/60 md:flex-row md:items-center lg:px-12">
          <p>© 2026 Evervale Realty. All rights reserved.</p>
          <p>Private Office | Global Portfolio | Verified Listings</p>
        </div>
      </div>
    </footer>
  )
}
