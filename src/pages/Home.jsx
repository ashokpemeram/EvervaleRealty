import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import ServiceCard from '../components/ServiceCard'
import PropertyCard from '../components/PropertyCard'
import TestimonialCard from '../components/TestimonialCard'
import PlotPlanViewer from '../components/PlotPlanViewer'
import useScrollReveal from '../hooks/useScrollReveal'
import { api } from '../services/api'
import {
  ExchangeIcon,
  LockIcon,
  PortfolioIcon,
  ShieldIcon,
  SupportIcon,
  TrendingIcon,
} from '../components/Icons'

const services = [
  {
    title: 'Acquire',
    description:
      'Off-market sourcing and data-led screening to secure rare, high-performing assets.',
    cta: 'VIEW LISTINGS',
    icon: TrendingIcon,
    to: '/services',
  },
  {
    title: 'Divest',
    description:
      'Precision exit strategy with valuation intelligence built for generational capital.',
    cta: 'VALUATION REPORT',
    icon: ExchangeIcon,
    highlight: true,
    to: '/services',
  },
  {
    title: 'Manage',
    description:
      'Portfolio stewardship that blends hospitality-grade operations with ROI rigor.',
    cta: 'EXPLORE PORTFOLIO',
    icon: PortfolioIcon,
    to: '/services',
  },
]

export default function Home() {
  const [properties, setProperties] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedVenture, setSelectedVenture] = useState(null)
  useScrollReveal([properties, testimonials])

  const homeProperties = Array.isArray(properties)
    ? properties.filter(p => p.showOnHome).slice(0, 4)
    : []

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const [propertiesData, testimonialsData] = await Promise.all([
          api.getProperties(),
          api.getTestimonials()
        ])
        if (active) {
          setProperties(propertiesData)
          setTestimonials(testimonialsData)
        }
      } catch (error) {
        console.error('Error fetching Home page data:', error)
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [])

  const handleViewPlots = (venture) => {
    setSelectedVenture(venture)
    setIsViewerOpen(true)
  }

  return (
    <div className="bg-ivory">
      <HeroSection />

      <section id="services" className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              The Evervale Suite
            </p>
            <h2 className="mt-3 text-3xl font-semibold">The Evervale Suite</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy/60">
              A refined collection of acquisition, divestment, and stewardship
              services engineered for discerning real estate portfolios.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                {...service}
                delay={index * 120}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="acquisitions" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="reveal" data-animate>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                New Acquisitions
              </p>
              <h2 className="mt-3 text-3xl font-semibold">New Acquisitions</h2>
            </div>
            <Link
              to="/projects"
              className="reveal text-xs font-semibold tracking-[0.3em] text-navy/70"
              data-animate
            >
              VIEW ALL ASSETS
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.isArray(homeProperties) && homeProperties.map((property, index) => (
              <PropertyCard
                key={property.name}
                {...property}
                delay={index * 120}
                onViewPlots={() => handleViewPlots(property)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-12">
          <div
            className="reveal relative overflow-hidden rounded-4xl bg-navy p-8 text-white shadow-soft"
            data-animate
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                Safe Investment
              </p>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <ShieldIcon className="h-10 w-10 text-gold" />
                <p className="mt-6 text-lg font-semibold uppercase tracking-[0.2em] text-white/80">
                  SECURE. SWIFT. DISCREET.
                </p>
              </div>
              <p className="text-sm text-white/70">
                Our security-first mindset ensures every asset is verified,
                protected, and positioned for long-term appreciation.
              </p>
            </div>
          </div>
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              The Evervale Standard
            </p>
            <h2 className="mt-3 text-3xl font-semibold">The Evervale Standard</h2>
            <p className="mt-3 text-sm text-navy/60">
              A private office experience built on verification, discretion, and
              elevated access.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <ShieldIcon className="mt-1 h-6 w-6 text-gold" />
                <div>
                  <h3 className="text-sm font-semibold">
                    Institutional Grade Verification
                  </h3>
                  <p className="mt-2 text-sm text-navy/60">
                    Multi-layer diligence, title assurance, and compliance
                    screening across every market.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <SupportIcon className="mt-1 h-6 w-6 text-gold" />
                <div>
                  <h3 className="text-sm font-semibold">
                    Private Office Support
                  </h3>
                  <p className="mt-2 text-sm text-navy/60">
                    Dedicated advisors, on-demand reporting, and 24/7 concierge
                    coordination.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <LockIcon className="mt-1 h-6 w-6 text-gold" />
                <div>
                  <h3 className="text-sm font-semibold">
                    Closed-Circuit Access
                  </h3>
                  <p className="mt-2 text-sm text-navy/60">
                    Confidential inventory, private previews, and secure bidding
                    protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="reveal text-center" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              The Evervale Network
            </p>
            <h2 className="mt-3 text-3xl font-semibold">The Evervale Network</h2>
            <p className="mt-3 text-sm text-navy/60">
              Trusted by private capital, family offices, and global investors.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Array.isArray(testimonials) && testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                {...testimonial}
                delay={index * 120}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="relative overflow-hidden bg-navy py-16">
        <div className="absolute inset-0 bg-cta-glow" />
        <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 text-white lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="reveal" data-animate>
            <h2 className="text-3xl font-semibold">
              Ready to power your next real estate chapter?
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Secure a private briefing with Evervale for curated access,
              valuation insight, and exclusive acquisitions.
            </p>
          </div>
          <Link
            to="/contact"
            className="reveal rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-[0.2em] text-navy transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/80"
            data-animate
          >
            BOOK A BRIEFING
          </Link>
        </div>
      </section>
      
      <PlotPlanViewer
        venture={selectedVenture}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  )
}
