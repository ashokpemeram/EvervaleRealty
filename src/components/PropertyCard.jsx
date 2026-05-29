import { AreaIcon, BathIcon, BedIcon } from './Icons'

export default function PropertyCard({
  image,
  tag,
  name,
  location,
  price,
  details,
  delay,
  plots,
  onViewPlots,
}) {
  const isVenture = !!plots

  return (
    <article
      className="reveal group overflow-hidden rounded-card bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
      style={{ transitionDelay: `${delay}ms` }}
      data-animate
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy/90 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-gold">
          {tag}
        </span>
      </div>
      <div className="space-y-3 p-6 flex flex-col justify-between min-h-[170px]">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-navy leading-snug">{name}</h3>
          <p className="text-sm text-navy/60">{location}</p>
        </div>
        
        <div className="flex items-baseline justify-between border-t border-navy/5 pt-3">
          <p className="text-lg font-semibold text-gold">{price}</p>
          {!isVenture && (
            <span className="flex items-center gap-1 text-xs text-navy/70">
              <AreaIcon className="h-4 w-4 text-gold/80" />
              {details.area}
            </span>
          )}
        </div>

        {isVenture ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-navy/70 border-b border-navy/5 pb-2">
              <span>{details.totalPlots} Total Subdivisions</span>
              <span className="font-semibold text-gold">{details.area}</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                onViewPlots?.()
              }}
              className="w-full rounded-2xl bg-gold/10 hover:bg-gold py-2.5 text-center text-xs font-semibold tracking-[0.15em] text-gold hover:text-navy transition-all duration-300 hover:shadow-sm"
            >
              PLOTS PLAN
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs text-navy/70 pt-2">
            <span className="flex items-center gap-1">
              <BedIcon className="h-4 w-4 text-gold/80" />
              {details.beds} Beds
            </span>
            <span className="flex items-center gap-1">
              <BathIcon className="h-4 w-4 text-gold/80" />
              {details.baths} Baths
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

