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
      'TUDA and DTCP approved residential and commercial plots in prime and developing locations around Tirupati and Srikalahasti.',
    cta: 'VIEW PLOTS',
    icon: TrendingIcon,
    // to: '/services',
  },
  {
    title: 'Farmlands',
    description:
      'Own a piece of green land. We bring you carefully selected farmlands for agricultural use and long-term investment.',
    cta: 'EXPLORE FARMLANDS',
    icon: PortfolioIcon,
    // to: '/services',
  },
  // {
  //   title: 'Prime Locations',
  //   description:
  //     'Properties near key locations — including temples, hospitals, educational institutions and major roads in Tirupati & Srikalahasti.',
  //   cta: 'EXPLORE LOCATIONS',
  //   icon: ExchangeIcon,
  //   to: '/services',
  // },
  {
    title: 'Verified Documentation',
    description:
      'We provide clear property details, approvals and documentation information for a safe and transparent purchase.',
    cta: 'CHECK DETAILS',
    icon: LockIcon,
    // to: '/services',
  },
  // {
  //   title: 'End-to-End Support',
  //   description:
  //     'From site visit to registration, our team guides you at every step of your land buying journey.',
  //   cta: 'TALK TO US',
  //   icon: SupportIcon,
  //   to: '/services',
  // },
  // {
  //   title: 'Investment Guidance',
  //   description:
  //     'Get expert advice on location potential, market trends and future value — to help you make the right decision.',
  //   cta: 'GET GUIDANCE',
  //   icon: TrendingIcon,
  //   to: '/services',
  // },
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
           <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="reveal" data-animate>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                Our Services
              </p>
              <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">Your Trusted Partner in Land Investments </h2>
              <p className="text-sm text-navy/60 mt-1 max-w-xl">
                From residential plots to farmlands, we offer verified properties, prime locations, transparent information, and complete support—so you can invest in land with confidence.
              </p>
            </div>
            <Link
              to="/services"
              className="reveal text-xs font-semibold tracking-[0.3em] text-navy/70 border-b border-gold pb-1"
              data-animate
            >
              EXPLORE ALL SERVICES
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            {Array.isArray(homeProperties) && homeProperties.length > 0 ? (
              homeProperties.map((property, index) => (
                <PropertyCard
                  key={property.name}
                  {...property}
                  delay={index * 120}
                  onViewPlots={() => handleViewPlots(property)}
                />
              ))
            ) : (
              <div className="col-span-full border border-dashed border-navy/20 p-12 text-center rounded-3xl max-w-md mx-auto w-full">
                <p className="text-xs font-bold uppercase tracking-widest text-navy/60">No Active Projects</p>
                <p className="text-[10px] text-navy/40 mt-1">Operational ventures are currently unavailable.</p>
              </div>
            )}
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
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">Exceptional Results Start with One Honest Conversation </h2>
            <p className="mt-3 text-sm text-navy/60 leading-relaxed">
              Most buyers spend months second-guessing land deals in regional markets. We replace speculation with complete clarity in a single, strategy-focused discussion.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Tell Us Your Vision</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    Share your target budget, timeline, and long-term investment goals. We offer transparent guidance with zero sales pressure, zero agendas, and zero obligation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Get Unfiltered Local Market Insights</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    Powered by deep on-the-ground presence across Tirupati, Srikalahasti, and surrounding growth corridors, we show you which micro-markets deliver verified ROI—and which ones to skip.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-navy/10 pb-6">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Secure a Fully Vetted Property</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    Skip the guesswork. Every parcel we curate undergoes rigorous background checks for clear legal titles, accurate pricing, and long-term value appreciation.
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold font-sans">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-semibold">You Buy With Complete Confidence.</h3>
                  <p className="mt-2 text-sm text-navy/60 leading-relaxed">
                    No hidden surprises. No last-minute complications. Just the quiet, solid confidence of knowing you made the right decision.
                  </p>
                </div>
              </div> */}
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
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">Real experiences. Genuine guidance. Confident investments.</h2>
            <p className="mt-3 text-sm text-navy/60">
              “Evervale Realty made the entire land-buying process simple and transparent. Their team explained everything clearly and helped us make a confident decision.”
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Array.isArray(testimonials) && testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.name}
                  {...testimonial}
                  delay={index * 120}
                />
              ))
            ) : (
              <div className="col-span-full border border-dashed border-navy/20 p-12 text-center rounded-3xl max-w-md mx-auto w-full">
                <p className="text-xs font-bold uppercase tracking-widest text-navy/60">No Testimonials Available</p>
                <p className="text-[10px] text-navy/40 mt-1">Client reviews are currently unavailable.</p>
              </div>
            )}
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
