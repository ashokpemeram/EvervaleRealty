import { createElement } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { ArrowUpRight, MapPinIcon, ShieldIcon, SupportIcon, TrendingIcon } from '../components/Icons'

const serviceImages = {
  plots:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85',
  farmland:
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=85',
  location:
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85',
  documents:
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85',
  support:
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
  guidance:
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=85',
}

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
      <path d="M8 11h.01M16 11h.01" />
    </svg>
  )
}

function LeafIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 3.5C12.5 3.7 6.4 7.3 5 13.3c-.7 3.1 1.2 6.2 4.3 7.1 6 1.8 10.2-4.8 11.2-16.9Z" />
      <path d="M3.5 20.5c3.6-4.4 7.4-7.4 12.1-10.2" />
    </svg>
  )
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5M8 12h8M8 16h6" />
    </svg>
  )
}

function PeopleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 5.8M18 20v-1a6 6 0 0 0-2.4-4.8" />
    </svg>
  )
}

function HandshakeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 11 4-4 4 3M21 11l-4-4-4 3" />
      <path d="m7 10 4.7 4.1a2 2 0 0 0 2.7-.1l2.6-2.5M3 11l4.7 4.7a2 2 0 0 0 2.8 0l.4-.4M21 11l-4.4 4.4a2 2 0 0 1-2.8 0l-.3-.3" />
      <path d="m6.2 14.2 2.3 2.3a2 2 0 0 0 2.8 0M8.5 16.5l1.2 1.2a2 2 0 0 0 2.8 0" />
    </svg>
  )
}

const services = [
  {
    title: 'Open Plots',
    description: 'TUDA and DTCP approved residential and commercial plots in prime and developing locations around Tirupati and Srikalahasti.',
    cta: 'View plots',
    image: serviceImages.plots,
    icon: HomeIcon,
    to: '/projects',
  },
  {
    title: 'Farmlands',
    description: 'Own a piece of green land. We bring you carefully selected farmlands for agricultural use and long-term investment.',
    cta: 'Explore farmlands',
    image: serviceImages.farmland,
    icon: LeafIcon,
    to: '/projects',
  },
  {
    title: 'Prime Locations',
    description: 'Properties near key locations — including temples, hospitals, educational institutions and major roads in Tirupati & Srikalahasti.',
    cta: 'Explore locations',
    image: serviceImages.location,
    icon: MapPinIcon,
    to: '/projects',
  },
  {
    title: 'Verified Documentation',
    description: 'We provide clear property details, approvals and documentation information for a safe and transparent purchase.',
    cta: 'Check details',
    image: serviceImages.documents,
    icon: DocumentIcon,
    to: '/contact',
  },
  {
    title: 'End-to-End Support',
    description: 'From site visit to registration, our team guides you at every step of your land buying journey.',
    cta: 'Talk to us',
    image: serviceImages.support,
    icon: PeopleIcon,
    to: '/contact',
  },
  {
    title: 'Investment Guidance',
    description: 'Get expert advice on location potential, market trends and future value — to help you make the right decision.',
    cta: 'Get guidance',
    image: serviceImages.guidance,
    icon: TrendingIcon,
    to: '/contact',
  },
]

const trustPoints = [
  { label: 'Trusted Properties', icon: ShieldIcon },
  { label: 'Prime Locations', icon: MapPinIcon },
  { label: 'Transparent Pricing', icon: HandshakeIcon },
  { label: 'Dedicated Support', icon: SupportIcon },
]

function ServiceCard({ service, index }) {
  const Icon = service.icon

  return (
    <article
      className="service-card reveal group overflow-hidden rounded-[10px] border border-[#e7eaf0] bg-white"
      style={{ transitionDelay: `${index * 90}ms` }}
      data-animate
    >
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src={service.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading={index > 2 ? 'lazy' : 'eager'}
        />
      </div>
      <div className="relative flex min-h-[254px] flex-col px-6 pb-6 pt-9 sm:min-h-[244px]">
        <div className="absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#f8dfa0] text-navy shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-[22px] font-semibold leading-tight text-navy">{service.title}</h2>
        <p className="mt-3 text-[15px] leading-[1.6] text-navy/60">{service.description}</p>
        <Link
          to={service.to}
          className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-xs font-bold uppercase tracking-[0.08em] text-navy transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          {service.cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

export default function Services() {
  useScrollReveal()

  return (
    <main className="bg-[#f7f8fa] pb-12 pt-[50px] text-navy sm:pb-16">
      <section className="service-hero relative isolate overflow-hidden px-6 py-5 text-center sm:py-20 lg:py-[74px]">
        <div className="service-hero-wash absolute inset-0 -z-10" />
        <div className="absolute left-[-1.25rem] top-12 -z-10 h-28 w-28 rotate-[-15deg] rounded-full bg-[#7c9a32]/20 blur-sm sm:left-8 sm:h-36 sm:w-36" />
        <MapPinIcon className="absolute -right-2 bottom-10 -z-10 h-32 w-32 rotate-[8deg] text-[#e4c57d]/35 sm:right-8 sm:h-40 sm:w-40" />
        <div className="reveal mx-auto max-w-3xl" data-animate>
          <div className="flex items-center justify-center gap-4 text-[#c99518]">
            <span className="h-px w-12 bg-current/70" />
            <p className="text-xs font-bold uppercase tracking-[0.48em] sm:text-sm">Our Services</p>
            <span className="h-px w-12 bg-current/70" />
          </div>
          <h1 className="mt-6 font-serif text-[42px] font-semibold leading-[1.08] tracking-[-0.035em] text-navy sm:text-5xl lg:text-[60px]">
            Your Trusted Partner in <span className="block">Land Investments</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy/80 sm:text-lg">
            From residential plots to farmlands, we offer verified properties, prime locations and complete support — so you can invest in land with confidence and zero guesswork.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-9 sm:px-6 sm:pt-10 lg:px-12">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-7">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        <div className="reveal mt-8 grid overflow-hidden rounded-xl border border-[#e9e7e1] bg-[#fbfaf6] shadow-[0_8px_20px_rgba(11,31,58,0.035)] sm:grid-cols-2 lg:grid-cols-4" data-animate>
          {trustPoints.map(({ label, icon }, index) => (
            <div key={label} className={`flex items-center gap-4 px-6 py-5 ${index < trustPoints.length - 1 ? 'border-b border-[#e9e7e1] lg:border-b-0 lg:border-r' : ''} ${index === 1 ? 'sm:border-b-0' : ''} ${index === 0 ? 'sm:border-r' : ''} ${index === 2 ? 'sm:border-r sm:border-b-0' : ''}`}>
              {createElement(icon, { className: 'h-9 w-9 shrink-0 text-navy' })}
              <p className="text-sm font-semibold leading-tight text-navy">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
