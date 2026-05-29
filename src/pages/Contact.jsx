import { useLocation } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { MailIcon, MapPinIcon, PhoneIcon } from '../components/Icons'

export default function Contact() {
  useScrollReveal()
  const location = useLocation()
  
  const ventureName = location.state?.ventureName || ''
  const plotNumber = location.state?.plotNumber || ''
  const plotPrice = location.state?.plotPrice || ''

  const prefilledMessage = ventureName && plotNumber
    ? `I am interested in acquiring ${plotNumber} at ${ventureName} (listed at ${plotPrice}). Please coordinate a private briefing with my office.`
    : ''

  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:px-12">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Premium Partnerships
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              LET'S FRAME YOUR <span className="text-gold">VISION.</span>
            </h1>
          </div>
          <div className="reveal text-sm text-navy/70" data-animate>
            <p>
              Experience the gold standard in luxury real estate. From exclusive
              listings to strategic acquisitions, we provide the elite
              architectural perspective your vision deserves.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.9fr,1.1fr] lg:px-12">
          <div className="space-y-6">
            <div
              className="reveal rounded-4xl bg-navy p-6 text-white shadow-soft"
              data-animate
            >
              <h2 className="text-lg font-semibold text-gold">Our Studio</h2>
              <div className="mt-5 space-y-4 text-sm text-white/80">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Office
                    </p>
                    <p>428 Penthouse Plaza, Art District, NY 10012</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Phone
                    </p>
                    <p>+1 (212) 555-0198</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Email
                    </p>
                    <p>concierge@evervale.com</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Connect With Us
                </p>
                <div className="mt-3 flex gap-3 text-gold">
                  <span className="h-8 w-8 rounded-full border border-gold/40" />
                  <span className="h-8 w-8 rounded-full border border-gold/40" />
                  <span className="h-8 w-8 rounded-full border border-gold/40" />
                </div>
              </div>
            </div>
            <div className="reveal overflow-hidden rounded-4xl shadow-soft" data-animate>
              <img
                src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80"
                alt="Luxury building facade"
                className="h-[260px] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div
            className="reveal rounded-4xl bg-white p-8 shadow-soft"
            data-animate
          >
            <h2 className="text-lg font-semibold">Inquiry Submission</h2>
            <form className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-navy/50">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-navy/50">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-navy/50">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (000) 000-0000"
                    className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-navy/50">
                    Preferred Contact
                  </label>
                  <select className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none">
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Private Briefing</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-navy/50">
                  Your Message
                </label>
                <textarea
                  rows="5"
                  defaultValue={prefilledMessage}
                  placeholder="Tell us about your property or project..."
                  className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-[0.2em] text-navy"
              >
                INQUIRY SUBMISSION
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="reveal relative overflow-hidden rounded-4xl shadow-soft" data-animate>
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80"
              alt="City skyline avenue"
              className="h-[360px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-navy/50" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <div className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold tracking-[0.2em] text-navy">
                EVERVALE REALTY HQ
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="h-10 w-10 rounded-full bg-white text-navy">
                +
              </button>
              <button className="h-10 w-10 rounded-full bg-white text-navy">
                -
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
