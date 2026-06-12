import useScrollReveal from '../hooks/useScrollReveal'
import {
  ExchangeIcon,
  PortfolioIcon,
  ShieldIcon,
  TrendingIcon,
} from '../components/Icons'

const solutions = [
  {
    title: 'Open Plots',
    description:
      'TUDA and DTCP approved residential and commercial plots in high-growth locations across Tirupati and Srikalahasti. Every plot comes with legal clarity and transparent pricing.',
    icon: TrendingIcon,
  },
  {
    title: 'Farmland Investments',
    description:
      'Customized farmland parcels with drip irrigation setup, plantation planning, and government-recognized Pattadhar Passbook.',
    icon: PortfolioIcon,
  },
  {
    title: 'Large Land Parcels',
    description:
      'Looking for 10, 20, or 50 acres? We handle large-scale land transactions across Tirupati and beyond with complete legal support.',
    icon: ExchangeIcon,
  },
  {
    title: 'Advisory & Legal Guidance',
    description:
      'Completely free consultation to understand your budget and goals, with trusted legal experts for title verification.',
    icon: ShieldIcon,
  },
]

const approach = [
  {
    title: 'We Advise Before We Sell',
    description:
      'Your clarity always comes before our commission. Always. We tell you where NOT to invest just as clearly as where to invest.',
  },
  {
    title: 'Deep local knowledge',
    description:
      'Tirupati, Srikalahasti, and beyond — we know which corridors are rising, where infrastructure is coming, and which ones to avoid.',
  },
  {
    title: 'End-to-End Protection',
    description:
      'Clear titles, expert lawyers, and zero documentation stress. Your investment is safe from the first handshake to registration.',
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
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl font-serif text-navy">
              Everything You Need to Invest in Land — <span className="text-gold font-sans font-bold">With Zero Guesswork</span>
            </h1>
            <p className="mt-5 text-sm text-navy/70 leading-relaxed">
              We reject more properties than we accept. If it does not meet our standard, we walk away — even if it costs us a deal. Your investment is protected at every step.
            </p>
          </div>
          <div className="reveal" data-animate>
            <div className="overflow-hidden rounded-4xl bg-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
                alt="Green open plots landscape"
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
              Curated Land Solutions
            </p>
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">
              Curated Land Investment Solutions
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-navy/60 leading-relaxed">
              We provide a comprehensive suite of advisory and development services across Tirupati and Srikalahasti, ensuring legal protection and maximum growth potential.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {solutions.map((solution, index) => (
              <div
                key={solution.title}
                className="reveal rounded-card bg-ivory p-8 text-center shadow-soft flex flex-col justify-between"
                style={{ transitionDelay: `${index * 120}ms` }}
                data-animate
              >
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                    <solution.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-navy">
                    {solution.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-navy/60">
                    {solution.description}
                  </p>
                </div>
                <button className="mt-6 text-[10px] font-bold tracking-[0.3em] text-gold uppercase hover:text-gold/80 transition-colors">
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
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
                alt="Scenic green mountains and land"
                className="h-[380px] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 right-6 rounded-3xl bg-navy px-6 py-5 text-white shadow-card border border-white/10">
              <p className="text-2xl font-semibold text-gold">10+</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Years Experience
              </p>
            </div>
          </div>
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Our Principles
            </p>
            <h2 className="mt-3 text-3xl font-semibold font-serif text-navy">Beyond Transactions</h2>
            <div className="mt-8 space-y-6">
              {approach.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 border-b border-navy/10 pb-6"
                >
                  <ShieldIcon className="mt-1 h-6 w-6 text-gold shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-navy/60 leading-relaxed">
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
