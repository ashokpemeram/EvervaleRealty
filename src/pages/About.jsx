import useScrollReveal from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'
import { PortfolioIcon } from '../components/Icons'

const stats = [
  {
    value: '100%',
    label: 'Verified Plots',
  },
  {
    value: '500+',
    label: 'Happy Families',
    highlight: true,
  },
  {
    value: '2',
    label: 'High-Growth Corridors',
  },
  {
    value: '100%',
    label: 'Legal Clearance',
  },
]

const commitments = [
  {
    title: 'We Advise Before We Sell',
    description:
      'Your clarity always comes before our commission. Always.',
  },
  {
    title: 'Deep Local Knowledge',
    description:
      'Tirupati, Srikalahasti, and beyond — we know which corridors are rising and where infrastructure is coming.',
  },
  {
    title: 'End-to-End Protection',
    description:
      'Clear titles, expert lawyers, and zero documentation stress. Your investment is safe at every step.',
  },
]

const partners = [
  {
    name: 'Yasodha Neelam',
    role: 'Founder & Managing Partner',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Ganesh',
    role: 'Co-Founder',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
]

export default function About() {
  useScrollReveal()

  return (
    <div className="bg-ivory">
      <section className="bg-white pt-28 pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-12">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              The Evervale Story
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl font-serif text-navy">
              We Started Evervale Realty So Your Land Investment Never Becomes Your Biggest Regret
            </h1>
          </div>
          <div className="reveal text-sm text-navy/60 leading-relaxed space-y-4 font-sans" data-animate>
            <p>
              There is a moment that every real estate professional in Andhra Pradesh has seen — and most choose to ignore. It is the moment a family realizes they made the wrong decision.
            </p>
            <p>
              They saved for years. A government employee, a school teacher, a small shop owner. Someone who woke up before sunrise every single day and sacrificed so they could build something real — something they could pass to their children. And then they trusted the wrong person.
            </p>
            <p>
              They bought land in the wrong location, or paid an inflated price, or discovered legal complications. We have seen this. We cannot unsee it.
            </p>
            <p className="font-semibold text-gold text-base">
              No family that trusts us will ever regret their land investment.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl px-6 lg:px-12">
          <div className="reveal overflow-hidden rounded-4xl shadow-soft" data-animate>
            <img
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80"
              alt="Modern luxury villa overlooking a pool"
              className="h-[360px] w-full object-cover md:h-[420px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`reveal rounded-card px-6 py-6 text-white transition-all duration-300 ${
                stat.highlight
                  ? 'bg-gold text-navy shadow-card'
                  : 'bg-white/10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              data-animate
            >
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p
                className={`mt-2 text-xs uppercase tracking-[0.2em] ${
                  stat.highlight ? 'text-navy/80' : 'text-white/70'
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.95fr,1.05fr] lg:px-12">
          <div className="reveal relative" data-animate>
            <div className="overflow-hidden rounded-4xl shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80"
                alt="Architectural interior with sculptural light"
                className="h-[360px] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 right-8 rounded-3xl bg-navy p-6 text-white shadow-card">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">
                The Vision
              </p>
              <p className="mt-3 text-sm text-white/80">
                Elevating global portfolios through intentional design and
                performance.
              </p>
            </div>
          </div>
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Property. Powered.
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Property. Powered.</h2>
            <p className="mt-3 text-sm text-navy/60">
              Our private office approach is grounded in research, data, and
              elevated client service.
            </p>
            <div className="mt-8 space-y-6">
              {commitments.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 border-b border-navy/10 pb-6"
                >
                  <PortfolioIcon className="mt-1 h-6 w-6 text-gold" />
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-navy/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Evervale Team
            </p>
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">
              The People Behind Every Promise
            </h2>
            <p className="mt-2 text-sm text-navy/60 max-w-2xl">
              When you invest with Evervale Realty, you are working directly with people who have staked their reputation on every property they recommend.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="reveal rounded-card bg-ivory p-8 shadow-soft flex flex-col justify-between"
                style={{ transitionDelay: `${index * 120}ms` }}
                data-animate
              >
                <div>
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="h-64 w-full rounded-3xl object-cover"
                    loading="lazy"
                  />
                  <h3 className="mt-5 text-xl font-semibold text-navy">
                    {partner.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mt-1">
                    {partner.role}
                  </p>
                  <p className="text-sm text-navy/60 mt-4 leading-relaxed">
                    {partner.name === 'Yasodha Neelam' 
                      ? 'Yasodha leads Evervale Realty with a vision of absolute transparency. With deep expertise in AP land registrations and legal frameworks, she ensures every plot and farmland layout is 100% compliant and secure.'
                      : 'Ganesh brings extensive on-ground market intelligence across Tirupati and Srikalahasti. He personally hand-selects every property, analyzing infrastructure growth and connectivity corridors.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div
            className="reveal relative overflow-hidden rounded-4xl bg-navy px-8 py-12 text-white shadow-card"
            data-animate
          >
            <div className="absolute inset-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80"
                alt="Mountain lake"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                  Begin Your Journey
                </p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Begin your Evervale journey today.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-[0.2em] text-navy"
                >
                  BOOK A BRIEFING
                </Link>
                <Link
                  to="/services"
                  className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold tracking-[0.2em]"
                >
                  VIEW SERVICES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
