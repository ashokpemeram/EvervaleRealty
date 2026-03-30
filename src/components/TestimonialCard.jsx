import { StarIcon } from './Icons'

export default function TestimonialCard({ quote, name, role, delay }) {
  return (
    <div
      className="reveal rounded-card bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
      style={{ transitionDelay: `${delay}ms` }}
      data-animate
    >
      <div className="flex gap-1 text-gold">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} className="h-4 w-4" />
        ))}
      </div>
      <p className="mt-4 text-sm text-navy/70">"{quote}"</p>
      <div className="mt-6">
        <p className="text-sm font-semibold text-navy">{name}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-navy/50">
          {role}
        </p>
      </div>
    </div>
  )
}
