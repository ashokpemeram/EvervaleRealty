import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { MailIcon, MapPinIcon, PhoneIcon, InstagramIcon, LinkedinIcon, XIcon, FacebookIcon } from '../components/Icons'
import { api } from '../services/api'

export default function Contact() {
  useScrollReveal()
  const location = useLocation()

  // Dynamic Contact state synced with backend API
  const [contact, setContact] = useState({
    address: '428 Penthouse Plaza, Art District, NY 10012',
    phone: '+1 (212) 555-0198',
    email: 'concierge@evervale.com',
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
          setContact({
            address: settings.address || '',
            phone: settings.phone || '',
            email: settings.email || '',
            linkedin: settings.linkedin || 'https://linkedin.com/company/evervalerealty',
            instagram: settings.instagram || 'https://instagram.com/evervalerealty',
            twitter: settings.twitter || 'https://twitter.com/evervalerealty',
            facebook: settings.facebook || 'https://facebook.com/evervalerealty'
          })
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error)
      }
    }
    fetchContactSettings()
    return () => {
      active = false
    }
  }, [])

  const ventureName = location.state?.ventureName || ''
  const plotNumber = location.state?.plotNumber || ''
  const plotPrice = location.state?.plotPrice || ''

  // Controlled Form States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredContact, setPreferredContact] = useState('WhatsApp')
  const [message, setMessage] = useState(() => {
    return (ventureName && plotNumber)
      ? `I am interested in acquiring ${plotNumber} at ${ventureName} (listed at ${plotPrice}). Please coordinate a private briefing with my office.`
      : ''
  })
  const [success, setSuccess] = useState(false)

  // Submit and save lead inquiry to backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newInquiry = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      contact: preferredContact,
      message
    }

    try {
      await api.createInquiry(newInquiry)
      setSuccess(true)
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      alert('Failed to submit inquiry. Please try again.')
    }
  }

  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:px-12 font-sans">
          <div className="reveal" data-animate>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Honest Land Advisory
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl font-serif text-navy">
              LET'S TALK — <span className="text-gold font-sans font-bold">IT'S FREE.</span>
            </h1>
          </div>
          <div className="reveal text-sm text-navy/60 leading-relaxed font-sans" data-animate>
            <p>
              One honest conversation can change everything. Most people spend months researching land and still feel confused. We help you make confident land decisions with zero guesswork.
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
                    <p>{contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Phone
                    </p>
                    <p>{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Email
                    </p>
                    <p>{contact.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Connect With Us
                </p>
                <div className="mt-3 flex gap-3 text-gold">
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 hover:border-white hover:text-white"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                  {contact.instagram && (
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 hover:border-white hover:text-white"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  )}
                  {contact.twitter && (
                    <a
                      href={contact.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 hover:border-white hover:text-white"
                      aria-label="X"
                    >
                      <XIcon className="h-4 w-4" />
                    </a>
                  )}
                  {contact.facebook && (
                    <a
                      href={contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 hover:border-white hover:text-white"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                  )}
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
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in select-none">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold mb-6">
                  {/* Big Checkmark */}
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-navy font-semibold">Consultation Request Submitted</h3>
                <p className="text-sm text-navy/60 max-w-sm mt-3 leading-relaxed">
                  Thank you! Our land advisory team has received your inquiry. A partner will reach out to you shortly to guide you.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 rounded-full border border-navy/20 px-6 py-2.5 text-xs font-semibold tracking-widest text-navy hover:bg-navy hover:text-white transition-all duration-300 uppercase"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Inquiry Submission</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-navy/50 font-bold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-navy/50 font-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-navy/50 font-bold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (000) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-navy/50 font-bold">
                        Preferred Contact
                      </label>
                      <select
                        value={preferredContact}
                        onChange={(e) => setPreferredContact(e.target.value)}
                        className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none cursor-pointer"
                      >
                        <option>WhatsApp</option>
                        <option>Phone Call</option>
                        <option>Email</option>
                        <option>In-Person Visit</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-navy/50 font-bold">
                      Your Message
                    </label>
                    <textarea
                      rows="5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your property or project..."
                      className="w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-[0.2em] text-navy transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 uppercase"
                  >
                    INQUIRY SUBMISSION
                  </button>
                </form>
              </>
            )}
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
