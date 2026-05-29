import { Link } from 'react-router-dom'
import { ArrowUpRight } from './Icons'

export default function ServiceCard({
  title,
  description,
  cta,
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  highlight,
  delay,
  to,
}) {
  return (
    <div
      className={`reveal rounded-card border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
        highlight
          ? 'bg-navy text-white border-transparent'
          : 'bg-white text-navy border-white/60'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      data-animate
    >
      <div
        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${
          highlight ? 'bg-gold/15 text-gold' : 'bg-navy/10 text-navy'
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className={`mt-3 text-sm ${highlight ? 'text-white/70' : 'text-navy/70'}`}>
        {description}
      </p>
      {to ? (
        <Link
          to={to}
          className={`mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] ${
            highlight ? 'text-gold' : 'text-navy'
          }`}
        >
          {cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={`mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] ${
            highlight ? 'text-gold' : 'text-navy'
          }`}
        >
          {cta}
          <ArrowUpRight className="h-4 w-4" />
        </span>
      )}
    </div>
  )
}
