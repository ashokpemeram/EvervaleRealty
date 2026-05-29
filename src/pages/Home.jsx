import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import ServiceCard from '../components/ServiceCard'
import PropertyCard from '../components/PropertyCard'
import TestimonialCard from '../components/TestimonialCard'
import PlotPlanViewer from '../components/PlotPlanViewer'
import useScrollReveal from '../hooks/useScrollReveal'
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

const properties = [
  {
    name: 'Evervale Oakridge Estates',
    location: 'Austin Hills, TX',
    price: 'From $450K',
    tag: 'VENTURE PLOTS',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    details: { totalPlots: 8, area: '80\' x 120\' - 120\' x 160\'' },
    plots: [
      {
        id: 'oak-plot-1',
        number: 'Plot 1',
        dimensions: "80' x 120'",
        area: '9,600 sq ft',
        price: '$450K',
        status: 'available',
        x: 100,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-2',
        number: 'Plot 2',
        dimensions: "80' x 120'",
        area: '9,600 sq ft',
        price: '$465K',
        status: 'available',
        x: 190,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-3',
        number: 'Plot 3',
        dimensions: "90' x 130'",
        area: '11,700 sq ft',
        price: '$510K',
        status: 'reserved',
        x: 280,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-4',
        number: 'Plot 4',
        dimensions: "90' x 130'",
        area: '11,700 sq ft',
        price: '$495K',
        status: 'available',
        x: 370,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-5',
        number: 'Plot 5',
        dimensions: "100' x 140'",
        area: '14,000 sq ft',
        price: '$580K',
        status: 'sold',
        x: 100,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-6',
        number: 'Plot 6',
        dimensions: "100' x 140'",
        area: '14,000 sq ft',
        price: '$610K',
        status: 'available',
        x: 190,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-7',
        number: 'Plot 7',
        dimensions: "110' x 150'",
        area: '16,500 sq ft',
        price: '$680K',
        status: 'reserved',
        x: 280,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'oak-plot-8',
        number: 'Plot 8',
        dimensions: "120' x 160'",
        area: '19,200 sq ft',
        price: '$750K',
        status: 'sold',
        x: 370,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      }
    ]
  },
  {
    name: 'Evervale Lakeside Estates',
    location: 'Lake Tahoe, NV',
    price: 'From $590K',
    tag: 'VENTURE PLOTS',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    details: { totalPlots: 8, area: '90\' x 130\' - 130\' x 180\'' },
    plots: [
      {
        id: 'lake-plot-1',
        number: 'Plot 1',
        dimensions: "90' x 130'",
        area: '11,700 sq ft',
        price: '$590K',
        status: 'available',
        x: 100,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-2',
        number: 'Plot 2',
        dimensions: "90' x 130'",
        area: '11,700 sq ft',
        price: '$610K',
        status: 'available',
        x: 190,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-3',
        number: 'Plot 3',
        dimensions: "100' x 140'",
        area: '14,000 sq ft',
        price: '$650K',
        status: 'reserved',
        x: 280,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-4',
        number: 'Plot 4',
        dimensions: "100' x 140'",
        area: '14,000 sq ft',
        price: '$630K',
        status: 'available',
        x: 370,
        y: 80,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-5',
        number: 'Plot 5',
        dimensions: "110' x 150'",
        area: '16,500 sq ft',
        price: '$720K',
        status: 'sold',
        x: 100,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-6',
        number: 'Plot 6',
        dimensions: "110' x 150'",
        area: '16,500 sq ft',
        price: '$740K',
        status: 'available',
        x: 190,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-7',
        number: 'Plot 7',
        dimensions: "120' x 160'",
        area: '19,200 sq ft',
        price: '$810K',
        status: 'reserved',
        x: 280,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      },
      {
        id: 'lake-plot-8',
        number: 'Plot 8',
        dimensions: "130' x 180'",
        area: '23,400 sq ft',
        price: '$890K',
        status: 'sold',
        x: 370,
        y: 200,
        width: 80,
        height: 60,
        zoning: 'Residential Land',
        verification: 'Approved'
      }
    ]
  },
  {
    name: 'Summit Glasshouse',
    location: 'Aspen, CO',
    price: '$12.2M',
    tag: 'NEW ACQUISITION',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    details: { beds: 6, baths: 7, area: '8,750 sq ft' },
  },
  {
    name: 'Regent Crescent',
    location: 'Tribeca, NY',
    price: '$8.1M',
    tag: 'NEW ACQUISITION',
    image:
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
    details: { beds: 3, baths: 4, area: '4,200 sq ft' },
  },
]

const testimonials = [
  {
    quote:
      'Evervale delivered a rare off-market asset with a closing cadence that felt effortless.',
    name: 'Celia Monroe',
    role: 'Principal Investor',
  },
  {
    quote:
      'Their verification process rivals institutional due diligence. We never compromise.',
    name: 'Dylan Park',
    role: 'Private Office Lead',
  },
  {
    quote:
      'The team blends modern analytics with a bespoke client experience. Impeccable.',
    name: 'Anika Shah',
    role: 'Portfolio Director',
  },
]

export default function Home() {
  useScrollReveal()
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedVenture, setSelectedVenture] = useState(null)

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
              to="/services"
              className="reveal text-xs font-semibold tracking-[0.3em] text-navy/70"
              data-animate
            >
              VIEW ALL ASSETS
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {properties.map((property, index) => (
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
            {testimonials.map((testimonial, index) => (
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
