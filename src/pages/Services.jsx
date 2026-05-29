import useScrollReveal from '../hooks/useScrollReveal'
import {
  ExchangeIcon,
  PortfolioIcon,
  ShieldIcon,
  TrendingIcon,
} from '../components/Icons'

const solutions = [
  {
    title: 'Property Buying',
    description:
      'Navigate the luxury market with bespoke acquisition strategies aligned to your legacy.',
    icon: TrendingIcon,
  },
  {
    title: 'Property Selling',
    description:
      'Our editorial-grade marketing transforms your property into a narrative that commands premiums.',
    icon: ExchangeIcon,
  },
  {
    title: 'Rental Services',
    description:
      'Exclusive access to high-end residential and commercial leasing with tailored management.',
    icon: PortfolioIcon,
  },
]

const approach = [
  {
    title: 'Architectural Curation',
    description:
      'Every property in our portfolio is selected based on design merit, light orientation, and structural integrity.',
  },
  {
    title: 'Data-Driven Insight',
    description:
      'We combine aesthetic alignment with rigorous market data to ensure investments are sound and future-proof.',
  },
  {
    title: 'Discreet Representation',
    description:
      'Privacy is our highest currency. We manage high-stakes negotiations with absolute confidentiality.',
  },
]

export default function Services() {
  useScrollReveal()

  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:px-12">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Precision Services
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Precision In Every <span className="text-gold">Perspective.</span>
            </h1>
            <p className="mt-5 text-sm text-navy/70">
              We design every engagement to deliver measurable returns and
              architectural integrity across acquisition, divestment, and
              management.
            </p>
          </div>
          <div className="reveal" data-animate>
            <div className="overflow-hidden rounded-4xl bg-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80"
                alt="Modern white villa"
                className="h-[320px] w-full object-cover md:h-[360px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Curated Real Estate Solutions
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Curated Real Estate Solutions
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-navy/60">
              We provide a comprehensive suite of services designed for the
              discerning client, where architectural integrity meets market
              intelligence.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solutions.map((solution, index) => (
              <div
                key={solution.title}
                className="reveal rounded-card bg-ivory p-8 text-center shadow-soft"
                style={{ transitionDelay: `${index * 120}ms` }}
                data-animate
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <solution.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-navy">
                  {solution.title}
                </h3>
                <p className="mt-3 text-sm text-navy/60">
                  {solution.description}
                </p>
                <button className="mt-6 text-xs font-semibold tracking-[0.3em] text-gold">
                  LEARN MORE
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr,1fr] lg:px-12">
          <div className="reveal relative" data-animate>
            <div className="overflow-hidden rounded-4xl shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
                alt="Luxury interior boardroom"
                className="h-[380px] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 right-6 rounded-3xl bg-navy px-6 py-5 text-white shadow-card">
              <p className="text-2xl font-semibold text-gold">15+</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Years Experience
              </p>
            </div>
          </div>
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Our Approach
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Beyond Transactions</h2>
            <div className="mt-8 space-y-6">
              {approach.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 border-b border-navy/10 pb-6"
                >
                  <ShieldIcon className="mt-1 h-6 w-6 text-gold" />
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
    </div>
  )
}
