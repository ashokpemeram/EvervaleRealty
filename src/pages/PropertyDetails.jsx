import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { defaultProperties } from '../services/defaults'
import './PropertyDetails.css'

const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85'

function Icon({ name, size = 18 }) {
  const paths = {
    pin: <><path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" /><circle cx="12" cy="11" r="2" /></>,
    play: <path d="m9 7 7 5-7 5V7Z" fill="currentColor" stroke="none" />,
    photo: <><rect x="3" y="5" width="18" height="15" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m4 17 5-5 3 3 3-3 5 5" /></>,
    down: <><path d="M12 3v11" /><path d="m8 10 4 4 4-4" /><path d="M4 19h16" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    road: <><path d="M8 3 5 21M16 3l3 18M12 5v2m0 3v2m0 3v2" /></>,
    shield: <><path d="M12 3 19 6v5c0 4.5-3 7.6-7 10-4-2.4-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    area: <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4m8-4v4M4 10h16" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function enrichProperty(data) {
  const facings = ['East', 'North', 'West', 'North-East', 'East', 'South', 'North-East', 'West']
  const roads = ['40 ft', '60 ft', '40 ft', '60 ft', '30 ft', '40 ft', '60 ft', '30 ft']
  return {
    ...data,
    image: data?.image || fallbackImage,
    details: data?.details || {},
    projectHighlights: Array.isArray(data?.projectHighlights) ? data.projectHighlights.filter(Boolean) : [],
    locationHighlights: Array.isArray(data?.locationHighlights) ? data.locationHighlights.filter(Boolean) : [],
    locationMapUrl: data?.locationMapUrl || '',
    plots: (Array.isArray(data?.plots) ? data.plots : []).map((plot, index) => ({
      ...plot,
      id: plot.id || `plot-${index + 1}`,
      number: plot.number || `Plot ${index + 1}`,
      status: plot.status || 'available',
      facing: plot.facing || facings[index % facings.length],
      roadWidth: plot.roadWidth || roads[index % roads.length],
    })),
  }
}

const compactPlotNumber = (plot) => String(plot?.number || '').replace(/plot\s*/i, '').trim() || '—'
const displayStatus = (status) => status === 'sold' ? 'Sold' : status === 'reserved' ? 'Reserved' : status === 'hold' ? 'Hold' : 'Available'
const displayPrice = (price) => price && price !== 'Price on Request' ? price : 'On request'

function ProjectPlan({ plots, selectedPlot, onSelect }) {
  const positionedPlots = useMemo(() => {
    const raw = plots.map((plot, index) => ({
      ...plot,
      rawX: Number.isFinite(plot.x) ? plot.x : 90 + (index % 8) * 68,
      rawY: Number.isFinite(plot.y) ? plot.y : 74 + Math.floor(index / 8) * 105,
      rawWidth: plot.width || 58,
      rawHeight: plot.height || 48,
    }))
    const minX = Math.min(...raw.map((plot) => plot.rawX), 70)
    const maxX = Math.max(...raw.map((plot) => plot.rawX + plot.rawWidth), 560)
    const minY = Math.min(...raw.map((plot) => plot.rawY), 65)
    const maxY = Math.max(...raw.map((plot) => plot.rawY + plot.rawHeight), 275)
    const scaleX = 520 / Math.max(maxX - minX, 1)
    const scaleY = 210 / Math.max(maxY - minY, 1)
    return raw.map((plot) => ({
      ...plot,
      x: 92 + (plot.rawX - minX) * scaleX,
      y: 74 + (plot.rawY - minY) * scaleY,
      width: Math.max(42, plot.rawWidth * scaleX),
      height: Math.max(34, plot.rawHeight * scaleY),
    }))
  }, [plots])

  return (
    <div className="project-plan">
      <svg viewBox="0 0 700 390" role="img" aria-label="Interactive project layout. Select any plot.">
        <defs>
          <linearGradient id="lawn" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#dce9b8" /><stop offset="1" stopColor="#9db66b" /></linearGradient>
          <pattern id="plan-pattern" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 18 18 0" stroke="#fff" strokeWidth=".65" opacity=".14" /></pattern>
        </defs>
        <rect x="20" y="18" width="660" height="350" rx="8" fill="url(#lawn)" /><rect x="20" y="18" width="660" height="350" rx="8" fill="url(#plan-pattern)" />
        {Array.from({ length: 42 }).map((_, index) => <circle key={index} cx={38 + (index % 10) * 66 + (index % 2 ? 5 : 0)} cy={index < 20 ? 38 + Math.floor(index / 10) * 290 : 65 + (index % 7) * 42} r={index % 3 ? 4 : 6} fill={index % 2 ? '#477a34' : '#6d913e'} opacity=".55" />)}
        <path d="M38 52h624v39H38zM38 292h624v46H38z" fill="#515354" /><path d="M47 72h607M47 315h607" stroke="#f4eac7" strokeWidth="2" strokeDasharray="12 9" /><path d="M68 133h565v28H68z" fill="#6d6c68" /><path d="M72 147h557" stroke="#f4eac7" strokeWidth="1.5" strokeDasharray="9 8" />
        <text x="350" y="77" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="2">30 FT ROAD</text><text x="350" y="152" fill="white" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="2">40 FT INTERNAL ROAD</text><text x="350" y="319" fill="white" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="2">MAIN ROAD</text>
        <g><rect x="42" y="173" width="50" height="103" rx="3" fill="#7dac60" stroke="#ecf0d2" strokeWidth="2" /><rect x="47" y="178" width="40" height="36" rx="2" fill="#c9dccf" /><rect x="47" y="219" width="40" height="52" rx="2" fill="#a8c8d1" /><text x="67" y="252" fill="#305d47" fontSize="8" fontWeight="700" textAnchor="middle">PARK</text></g>
        {positionedPlots.map((plot) => {
          const status = ['sold', 'reserved', 'hold'].includes(plot.status) ? plot.status : 'available'
          return <g key={plot.id} className={`plan-plot plan-plot--${status} ${selectedPlot?.id === plot.id ? 'is-selected' : ''}`} onClick={() => onSelect(plot)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(plot) }} role="button" tabIndex="0" aria-label={`Select ${plot.number}, ${displayStatus(plot.status)}`}><rect x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx="3" /><text x={plot.x + plot.width / 2} y={plot.y + plot.height / 2 + 4} textAnchor="middle">{compactPlotNumber(plot)}</text></g>
        })}
        <g transform="translate(646,353)"><text x="0" y="-27" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1f583e">N</text><path d="M0-22 7 4 0 0-7 4Z" fill="#146343" /></g>
      </svg>
    </div>
  )
}

function parseHighlight(value) {
  const [label, ...detailParts] = String(value || '').split('|')
  return {
    label: label.trim(),
    detail: detailParts.join('|').trim()
  }
}

const hasSecureHttpUrl = (value) => /^https?:\/\//i.test(String(value || '').trim())

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [activeImage, setActiveImage] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      try {
        const data = await api.getProperty(id)
        if (!alive) return
        const next = enrichProperty(data)
        setProperty(next); setActiveImage(next.image); setSelectedPlot(next.plots.find((plot) => plot.status === 'available') || next.plots[0] || null)
      } catch {
        const local = defaultProperties.find((item) => item._id === id || item.id === id)
        if (alive && local) {
          const next = enrichProperty(local)
          setProperty(next); setActiveImage(next.image); setSelectedPlot(next.plots.find((plot) => plot.status === 'available') || next.plots[0] || null)
        }
      } finally { if (alive) setLoading(false) }
    }
    load()
    return () => { alive = false }
  }, [id])

  const gallery = useMemo(() => [...new Set([property?.image, ...(Array.isArray(property?.images) ? property.images : [])].filter(Boolean))], [property])
  if (loading) return <div className="property-loading"><span /><p>Loading project details…</p></div>
  if (!property) return <div className="property-empty"><h1>Property not found</h1><p>This listing may no longer be available.</p><Link to="/projects">Back to projects</Link></div>

  const plots = property.plots || []
  const totalPlots = property.details.totalPlots || plots.length || '—'
  const availablePlots = plots.filter((plot) => plot.status === 'available').length
  const type = property.tag?.replace(/_/g, ' ') || 'Residential Plots'
  const area = property.details.area || plots[0]?.area || 'Contact for plot sizes'
  const description = property.details.description || `${property.name} is a thoughtfully planned ${type.toLowerCase()} project with well-defined plots, convenient access and room for long-term value.`
  const videoUrl = Array.isArray(property.videos) ? property.videos[0] : ''
  const photos = gallery.length ? gallery : [fallbackImage]
  const contactQuery = selectedPlot ? `?property=${encodeURIComponent(property.name)}&plot=${encodeURIComponent(selectedPlot.number)}` : `?property=${encodeURIComponent(property.name)}`
  const defaultProjectHighlights = [
    `Total Plots | ${totalPlots}`,
    `Plot Sizes | ${area}`,
    'Wide Roads | 30 ft+',
    'Security | 24 × 7',
    'Water Supply | Ready',
    'Electricity | Ready',
    'Parks & Greenery | Green',
    'Documents | Verified'
  ]
  const projectHighlights = (property.projectHighlights.length ? property.projectHighlights : defaultProjectHighlights).map(parseHighlight)
  const defaultLocationHighlights = [
    'Education | Schools and colleges nearby',
    'Healthcare | Hospitals and clinics nearby',
    'Transportation | Airport, railway and bus access',
    'Shopping | Daily essentials and retail nearby',
    'Business | Employment hubs within reach'
  ]
  const locationHighlights = (property.locationHighlights.length ? property.locationHighlights : defaultLocationHighlights).map(parseHighlight)
  const savedMapUrl = property.locationMapUrl.trim()
  const mapUrl = hasSecureHttpUrl(savedMapUrl)
    ? savedMapUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.name}, ${property.location}`)}`
  const mapEmbedUrl = hasSecureHttpUrl(savedMapUrl) && /google\.[^/]+\/maps\/embed/i.test(savedMapUrl) ? savedMapUrl : ''
  const highlightIcons = ['grid', 'area', 'road', 'shield', 'pin', 'road', 'photo', 'shield']
  const locationTones = ['blue', 'red', 'purple', 'orange', 'teal']
  const locationIcons = ['□', '✚', '✦', '♙', '▤']
  const nearbyLocations = locationHighlights.map(({ label, detail }) => {
    const [distance = 'Nearby', travelTime = ''] = detail.split('·').map((item) => item.trim())
    return {
      place: label || detail,
      distance,
      travelTime,
      directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${label || detail}, ${property.location}`)}`
    }
  }).filter(({ place }) => place)

  return <div className="property-page">
    <section className="property-hero" style={{ backgroundImage: `url("${activeImage || property.image}")` }}>
      <div className="property-hero__shade" />
      <div className="property-hero__inner pd-container">
        <div className="property-hero__copy"><span className="project-pill">{type}</span><h1>{property.name}</h1><p className="hero-location"><Icon name="pin" size={17} />{property.location}</p><p className="property-hero__description">{description}</p><div className="hero-actions">{videoUrl && <button type="button" onClick={() => setShowVideo(true)}><Icon name="play" size={15} />Watch Video</button>}<button type="button" className="hero-actions__ghost" onClick={() => setShowGallery(true)}><Icon name="photo" size={15} />View Gallery</button></div><div className="hero-facts"><span><Icon name="grid" />{totalPlots} Plots</span><span><Icon name="area" />{area}</span><span><Icon name="shield" />{plots[0]?.verification || 'Verified project'}</span></div></div>
        <div className="hero-count"><b>{Math.min(gallery.findIndex((image) => image === activeImage) + 1 || 1, gallery.length || 1)}</b> / {gallery.length || 1}</div>
      </div>
    </section>

    <div className="property-thumbnails pd-container">{photos.slice(0, 5).map((image, index) => <button key={`${image}-${index}`} className={activeImage === image ? 'is-active' : ''} type="button" onClick={() => setActiveImage(image)}><img src={image} alt={`${property.name} view ${index + 1}`} /></button>)}<button type="button" className="video-thumb" onClick={() => videoUrl ? setShowVideo(true) : setShowGallery(true)} style={{ backgroundImage: `linear-gradient(rgba(5,26,28,.45),rgba(5,26,28,.72)),url("${property.image}")` }}><span><Icon name="play" size={21} />{videoUrl ? 'Project Video' : 'Project Views'}</span></button>{gallery.length > 5 && <button className="more-photos" type="button" onClick={() => setShowGallery(true)} style={{ backgroundImage: `linear-gradient(rgba(5,26,28,.45),rgba(5,26,28,.72)),url("${gallery[5]}")` }}>+{gallery.length - 5} Photos</button>}</div>

    <main>
      <section className="overview-section pd-container"><div className="overview-copy"><div><h2>Project Overview</h2><p>{description}</p></div><div className="overview-stats">{[['Project Type', type, 'grid'], ['Total Area', property.details.totalArea || area, 'area'], ['Total Plots', totalPlots, 'grid'], ['Plot Size Range', area, 'area'], ['Project Status', availablePlots ? `${availablePlots} Available` : 'Fully allocated', 'shield']].map(([label, value, icon]) => <div className="overview-stat" key={label}><Icon name={icon} /><span>{label}<b>{value}</b></span></div>)}</div></div><div className="overview-side"><img src={gallery[1] || property.image} alt="Project aerial view" /><div><strong><Icon name="pin" size={16} />Well planned location</strong><p><Icon name="check" size={14} />Thoughtful plot planning</p><p><Icon name="check" size={14} />Clear documentation</p><p><Icon name="check" size={14} />Investment-ready project</p></div></div></section>

      {plots.length ? <section className="layout-section" id="project-layout"><div className="pd-container layout-heading"><div><h2>Project Layout</h2><p>Click any plot to review its size, dimensions, facing and availability.</p><div className="plot-legend"><span className="available">Available</span><span className="sold">Sold</span><span className="reserved">Reserved</span><span className="hold">Hold</span></div>{property.brochureUrl && <a className="download-layout" href={property.brochureUrl} target="_blank" rel="noreferrer"><Icon name="down" />Download Layout (PDF)</a>}</div><ProjectPlan plots={plots} selectedPlot={selectedPlot} onSelect={setSelectedPlot} /><aside className="plot-detail-card" aria-live="polite">{selectedPlot ? <><div className="plot-detail-card__top"><h3>{selectedPlot.number}</h3><span className={`plot-status plot-status--${selectedPlot.status}`}>{displayStatus(selectedPlot.status)}</span></div><dl><div><dt>Area</dt><dd>{selectedPlot.area}</dd></div><div><dt>Dimensions</dt><dd>{selectedPlot.dimensions}</dd></div><div><dt>Facing</dt><dd>{selectedPlot.facing}</dd></div><div><dt>Road width</dt><dd>{selectedPlot.roadWidth}</dd></div></dl><div className="plot-price"><span>Price</span><strong>{displayPrice(selectedPlot.price)}</strong></div>{selectedPlot.status === 'sold' ? <button type="button" disabled>Plot sold</button> : <Link to={`/contact${contactQuery}`}>Enquire Now</Link>}</> : <p>Select a plot from the layout to see its details.</p>}</aside></div></section> : <section className="layout-section layout-section--simple"><div className="pd-container"><h2>Project Layout</h2><img src={property.layoutImage || property.image} alt={`${property.name} layout`} /></div></section>}

      <section className="highlights-section pd-container">
        <div className="highlight-list">
          <h2>Project Highlights</h2>
          <div className="highlight-grid">
            {projectHighlights.map(({ label, detail }, index) => (
              <div className="highlight-item" key={`${label}-${index}`}>
                <i><Icon name={highlightIcons[index % highlightIcons.length]} /></i>
                <span><b>{detail || label}</b>{detail && label}</span>
              </div>
            ))}
          </div>
        </div>
        <img className="highlights-image" src={gallery[2] || property.image} alt="Project lifestyle view" />
      </section>

      <section className="location-section pd-container">
        <h2>Location Highlights</h2>
        <p>Everything you need, just minutes away.</p>
        <div className="location-grid">
          {locationHighlights.map(({ label, detail }, index) => (
            <article className={`location-card location-card--${locationTones[index % locationTones.length]}`} key={`${label}-${index}`}>
              <h3><span>{locationIcons[index % locationIcons.length]}</span>{label || detail}</h3>
              <p><span>{detail ? 'Distance / time' : 'Nearby landmark'}</span><b>{detail || 'Conveniently located'}</b></p>
            </article>
          ))}
        </div>
      </section>

      <section className="map-section pd-container">
        <div className="map-heading">
          <div><h2>Project Location</h2><p>See how well connected your future home is.</p></div>
          <a className="map-link" href={mapUrl} target="_blank" rel="noreferrer">Open in Google Maps <Icon name="arrow" size={14} /></a>
        </div>
        <div className="map-layout">
          {mapEmbedUrl ? (
            <div className="location-map location-map--embed">
              <iframe src={mapEmbedUrl} title={`${property.name} location map`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          ) : (
            <div className="location-map" style={{ backgroundImage: `linear-gradient(rgba(246,250,245,.1),rgba(246,250,245,.1)),url("${property.layoutImage || property.image}")` }}>
              <div className="map-street map-street--one" /><div className="map-street map-street--two" /><div className="map-street map-street--three" />
              <span className="map-stop map-stop--school">{nearbyLocations[0]?.place || 'Nearby'}<br /><b>{nearbyLocations[0]?.distance || 'Well connected'}</b></span>
              <span className="map-stop map-stop--hospital">{nearbyLocations[1]?.place || 'Landmark'}<br /><b>{nearbyLocations[1]?.distance || 'Convenient access'}</b></span>
              <span className="map-stop map-stop--airport">{nearbyLocations[2]?.place || 'Destination'}<br /><b>{nearbyLocations[2]?.distance || 'Easy reach'}</b></span>
              <strong className="map-project"><Icon name="pin" />{property.name}</strong>
            </div>
          )}
          <div className="nearby-list">
            {nearbyLocations.map(({ place, distance, travelTime, directionsUrl }) => (
              <div key={place}>
                <span><Icon name="pin" size={15} />{place}</span><em>{distance}</em><em>{travelTime}</em>
                <a href={directionsUrl} target="_blank" rel="noreferrer">Directions</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section pd-container"><div><h2>Gallery</h2><button type="button" onClick={() => setShowGallery(true)}>Photos</button></div><div className="gallery-row">{photos.slice(0, 6).map((image, index) => <button key={`${image}-gallery-${index}`} type="button" onClick={() => { setActiveImage(image); setShowGallery(true) }}><img src={image} alt={`${property.name} gallery image ${index + 1}`} /></button>)}</div></section>
    </main>

    <section className="property-cta"><div className="pd-container"><div className="property-cta__copy"><i>❧</i><span><strong>Interested in this project?</strong><small>Get in touch with our sales team for site visits, pricing and more details.</small></span></div><div className="property-cta__actions"><Link to={`/contact${contactQuery}`}>Enquire Now <Icon name="arrow" /></Link><Link className="outline" to={`/contact${contactQuery}`}><Icon name="calendar" />Schedule a Visit</Link></div></div></section>

    {showGallery && <div className="property-modal" role="dialog" aria-modal="true" aria-label="Property gallery" onClick={() => setShowGallery(false)}><div className="property-modal__gallery" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowGallery(false)}>×</button><img src={activeImage || property.image} alt={property.name} /><div>{gallery.map((image, index) => <button key={`${image}-modal-${index}`} className={activeImage === image ? 'is-active' : ''} type="button" onClick={() => setActiveImage(image)}><img src={image} alt={`Gallery ${index + 1}`} /></button>)}</div></div></div>}
    {showVideo && <div className="property-modal" role="dialog" aria-modal="true" aria-label="Project video" onClick={() => setShowVideo(false)}><div className="property-modal__video" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowVideo(false)}>×</button>{videoUrl.includes('youtube') || videoUrl.includes('vimeo') ? <iframe src={videoUrl} title={`${property.name} project video`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video src={videoUrl} controls autoPlay />}</div></div>}
  </div>
}
