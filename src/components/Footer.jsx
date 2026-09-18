import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstagramIcon, LinkedinIcon, XIcon, FacebookIcon } from './Icons'
import { api } from '../services/api'

export default function Footer() {
  const [socials, setSocials] = useState({
    linkedin: 'https://linkedin.com/company/evervalerealty',
    instagram: 'https://instagram.com/evervalerealty',
    twitter: 'https://twitter.com/evervalerealty',
    facebook: 'https://facebook.com/evervalerealty'
  })

  useEffect(() => {
    let active = true
    const fetchContactSettings = async () => {
      try {
        const settings = await api.getContactSettings()
        if (active && settings) {
          setSocials({
            linkedin: settings.linkedin || '',
            instagram: settings.instagram || '',
            twitter: settings.twitter || '',
            facebook: settings.facebook || ''
          })
        }
      } catch (error) {
        console.error('Error fetching contact settings in Footer:', error)
      }
    }
    fetchContactSettings()
    return () => {
      active = false
    }
  }, [])

  const activeLinks = [
    { label: 'LinkedIn', href: socials.linkedin, icon: LinkedinIcon },
    { label: 'Instagram', href: socials.instagram, icon: InstagramIcon },
    { label: 'X', href: socials.twitter, icon: XIcon },
    { label: 'Facebook', href: socials.facebook, icon: FacebookIcon },
  ].filter(link => link.href)

  return (
    <footer className="overflow-hidden bg-navy font-sans text-white">
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.35fr_0.8fr_0.9fr] lg:gap-16 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <h3 className="text-lg font-semibold tracking-[0.2em] text-gold font-serif">
            EVERVALE REALTY
          </h3>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-white/70">
            Evervale Realty LLP is Andhra Pradesh&apos;s trusted land advisory firm — helping families and investors make confident, informed land decisions across Tirupati, Srikalahasti, and beyond.
          </p>
          <div className="mt-6 flex gap-3">
            {activeLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-gold hover:text-gold"
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="relative border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-xs font-semibold tracking-[0.24em] text-gold">EXPLORE</p>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li>
              <Link className="transition-colors hover:text-gold" to="/projects">Our Projects</Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-gold" to="/about">About</Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-gold" to="/Services">Services</Link>
            </li>
          </ul>
        </div>
        <div className="relative border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-xs font-semibold tracking-[0.24em] text-gold">MAKE YOUR MOVE</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Get clear, practical guidance before you invest in your next property.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center border-b border-gold pb-1 text-xs font-semibold tracking-[0.2em] text-white transition-colors hover:text-gold"
          >
            TALK TO AN EXPERT
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-white/60 md:flex-row md:items-center lg:px-12">
          <p>© 2026 Evervale Realty LLP. All rights reserved.</p>
          <p>Tirupati & Srikalahasti | Verified Plots & Farmlands | Property. Powered.</p>
        </div>
      </div>
    </footer>
  )
}
