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
    title: 'Open Plots',
    description:
      'TUDA and DTCP approved residential and commercial plots in high-growth locations across Tirupati and Srikalahasti.',
    cta: 'VIEW PLOTS',
    icon: TrendingIcon,
    to: '/services',
  },
  {
    title: 'Farmlands',
    description:
      'Customized farmland parcels with drip irrigation setup, plantation planning, and government-recognized Pattadhar Passbook.',
    cta: 'EXPLORE FARMLANDS',
    icon: PortfolioIcon,
    highlight: true,
    to: '/services',
  },
  {
    title: 'Large Parcels',
    description:
      'We handle large-scale land transactions (10 to 50 acres) across Tirupati and beyond with complete legal and title verification support.',
    cta: 'ADVISORY SERVICES',
    icon: ExchangeIcon,
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
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">Everything You Need to Invest in Land — With Zero Guesswork</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy/60 leading-relaxed">
              Every plot and farmland layout in our portfolio has been personally verified for legal clarity, growth potential, and transparent pricing.
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
                Featured Projects
              </p>
              <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">Properties We Stand Behind</h2>
              <p className="text-sm text-navy/60 mt-1 max-w-xl">
                Every project listed here has been personally verified by our team for legal clarity, growth potential, and fair pricing.
              </p>
            </div>
            <Link
              to="/projects"
              className="reveal text-xs font-semibold tracking-[0.3em] text-navy/70 border-b border-gold pb-1"
              data-animate
            >
              VIEW ALL PROJECTS
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
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.0fr,1.0fr] lg:px-12">
          <div
            className="reveal relative overflow-hidden rounded-4xl bg-navy p-8 text-white shadow-soft flex flex-col justify-between"
            data-animate
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                Dream Protected
              </p>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <ShieldIcon className="h-10 w-10 text-gold" />
                <p className="mt-6 text-base font-semibold uppercase tracking-[0.2em] text-white/80">
                  YOUR TRUST. OUR REPUTATION.
                </p>
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                Evervale Realty was born from one non-negotiable belief: No family that trusts us will ever regret their land investment.
              </p>
            </div>
          </div>
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              How We Work
            </p>
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">One Honest Conversation Can Change Everything</h2>
            <p className="mt-3 text-sm text-navy/60 leading-relaxed">
              Most people spend months researching land and still feel confused. Our clients feel confident in one conversation.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-semibold">You Talk. We Listen.</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    Tell us your budget, your timeline, what you're hoping to achieve. There is no judgment here. No pressure. No agenda.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-semibold">We Give You the Honest Truth.</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    Based on deep on-ground knowledge of Tirupati, Srikalahasti, and beyond, we tell you exactly which locations have real growth potential — and which ones to avoid.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-semibold">We Show You the Right Property.</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    Every property we present has been personally verified by our team for legal clarity, fair pricing, and genuine appreciation potential.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-semibold">You Buy With Complete Confidence.</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    No hidden surprises. No last-minute complications. Just the quiet, solid confidence of knowing you made the right decision.
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
              Client Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">They Trusted Us With Their Life Savings. Here Is What They Say.</h2>
            <p className="mt-3 text-sm text-navy/60">
              Real families. Real investments. Real results.
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
          <div className="reveal max-w-3xl" data-animate>
            <h2 className="text-3xl font-semibold font-serif">
              Stop Guessing. Start Knowing.
            </h2>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              One free conversation with our experts will give you more clarity than months of research on your own. Tell us your budget. Tell us your goals. We will tell you exactly where to invest — and why.
            </p>
            <p className="mt-2 text-xs italic text-gold">
              Plots at Suchithra Gardens are selling fast. Prices increase as inventory reduces. Speak to us today.
            </p>
          </div>
          <Link
            to="/contact"
            className="reveal rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-[0.2em] text-navy transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/80 whitespace-nowrap"
            data-animate
          >
            LET'S TALK — IT'S FREE
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
