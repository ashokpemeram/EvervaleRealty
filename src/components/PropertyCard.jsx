import { AreaIcon, BathIcon, BedIcon } from './Icons'

export default function PropertyCard({
  image,
  tag,
  name,
  location,
  price,
  details,
  delay,
}) {
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
      <div className="space-y-3 p-6">
        <div>
          <h3 className="text-lg font-semibold text-navy">{name}</h3>
          <p className="text-sm text-navy/60">{location}</p>
        </div>
        <p className="text-lg font-semibold text-gold">{price}</p>
        <div className="flex items-center gap-4 text-xs text-navy/70">
          <span className="flex items-center gap-1">
            <BedIcon className="h-4 w-4" />
            {details.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <BathIcon className="h-4 w-4" />
            {details.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <AreaIcon className="h-4 w-4" />
            {details.area}
          </span>
        </div>
      </div>
    </article>
  )
}
