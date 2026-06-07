import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import useScrollReveal from '../hooks/useScrollReveal'
import { AreaIcon, BathIcon, BedIcon, MailIcon } from '../components/Icons'

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlot, setSelectedPlot] = useState(null)
  
  // Media states
  const [activeMediaTab, setActiveMediaTab] = useState('photos') // 'photos' | 'videos'
  const [activePhoto, setActivePhoto] = useState('')
  const [activeVideo, setActiveVideo] = useState('')
  
  // View states
  const [viewMode, setViewMode] = useState('layout') // 'layout' | 'grid' | 'table'
  const [sizeFilter, setSizeFilter] = useState('All Sizes')
  const [facingFilter, setFacingFilter] = useState('All Facings')

  // Zoom & Pan states
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.6))
  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e) => {
    // Only drag with left click
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // EMI calculator
  const calculateEMI = (priceStr) => {
    if (!priceStr) return '$0/mo'
    let numeric = parseFloat(priceStr.replace(/[^0-9.]/g, ''))
    if (isNaN(numeric)) return '$1,250/mo'
    if (priceStr.toLowerCase().includes('k') && numeric < 1000) {
      numeric = numeric * 1000
    }
    const emi = Math.round(numeric * 0.0051)
    return `$${emi.toLocaleString()}/mo`
  }

  // Filter checker helpers
  const matchesSizeRange = (plotAreaStr, range) => {
    if (!range || range === 'All Sizes') return true
    const areaNum = parseInt(plotAreaStr.replace(/,/g, '').replace(/[^\d]/g, ''), 10)
    if (isNaN(areaNum)) return true
    
    if (range === '2000 - 5000 sq ft') {
      return areaNum >= 2000 && areaNum <= 5000
    } else if (range === '5000 - 10000 sq ft') {
      return areaNum >= 5000 && areaNum <= 10000
    } else if (range === '10000 - 15000 sq ft') {
      return areaNum >= 10000 && areaNum <= 15000
    } else if (range === '15000+ sq ft') {
      return areaNum > 15000
    }
    return true
  }

  const matchesFacing = (plotFacing, selectedFacing) => {
    if (!selectedFacing || selectedFacing === 'All Facings') return true
    return plotFacing.toLowerCase() === selectedFacing.toLowerCase()
  }
  
  // Inquiry Form state
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    contact: 'Private Briefing',
    message: ''
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useScrollReveal([property, activeMediaTab])

  useEffect(() => {
    let active = true
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true)
        const data = await api.getProperty(id)
        if (active && data) {
          // Enrich plots with Vastu facing and road widths for dynamic rendering
          const enrichPlots = (plots) => {
            if (!Array.isArray(plots)) return []
            const facings = ['North-East', 'East', 'West', 'North-East', 'South', 'East', 'North-East', 'West']
            const widths = ['60 FT', '60 FT', '40 FT', '60 FT', '60 FT', '80 FT', '60 FT', '60 FT']
            return plots.map((plot, index) => ({
              ...plot,
              facing: plot.facing || facings[index % facings.length],
              roadWidth: plot.roadWidth || widths[index % widths.length]
            }))
          }

          const enrichedData = {
            ...data,
            plots: enrichPlots(data.plots)
          }

          setProperty(enrichedData)
          setActivePhoto(enrichedData.image)
          if (Array.isArray(enrichedData.videos) && enrichedData.videos.length > 0) {
            setActiveVideo(enrichedData.videos[0])
          }
          
          // Pre-fill inquiry message
          setInquiry(prev => ({
            ...prev,
            message: `I am interested in receiving information on "${enrichedData.name}" listed at ${enrichedData.price}. Please coordinate a private briefing with my office.`
          }))

          // Set default selected plot to first available
          if (Array.isArray(enrichedData.plots) && enrichedData.plots.length > 0) {
            const initialPlot = enrichedData.plots.find(p => p.status === 'available') || enrichedData.plots[0]
            setSelectedPlot(initialPlot)
          }
        }
      } catch (error) {
        console.error('Error fetching property details:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchPropertyDetails()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="bg-[#071120] min-h-screen pt-28 flex items-center justify-center text-white font-sans">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 border-4 border-[#F4C542] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#F4C542] font-semibold">Retrieving Asset Records...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="bg-[#071120] min-h-screen pt-28 flex items-center justify-center text-white font-sans">
        <div className="space-y-6 text-center max-w-md px-6">
          <svg className="h-16 w-16 text-red-500/40 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <h2 className="text-2xl font-serif">Asset Not Found</h2>
          <p className="text-sm text-gray-400">The requested property listing does not exist or has been archived from our private portfolios.</p>
          <Link to="/projects" className="inline-block px-8 py-3 bg-[#F4C542] hover:bg-[#d9ae36] rounded-full text-[#071120] font-bold text-xs tracking-widest uppercase transition-all duration-300">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const isVenture = property.tag === 'VENTURE PLOTS' || (Array.isArray(property.plots) && property.plots.length > 0)
  const additionalImages = Array.isArray(property.images) ? property.images : []
  const allPhotos = [property.image, ...additionalImages].filter(Boolean)
  const videosList = Array.isArray(property.videos) ? property.videos : []

  // Inquiry submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        id: `lead-prop-${Date.now()}`,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        contact: inquiry.contact,
        message: inquiry.message
      }
      await api.createInquiry(payload)
      setSubmitSuccess(true)
      setInquiry({
        name: '',
        email: '',
        phone: '',
        contact: 'Private Briefing',
        message: `I am interested in receiving information on "${property.name}" listed at ${property.price}.`
      })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Inquiry submission failed:', error)
      alert('Failed to submit inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Pre-fill message with plot details for land masterplans
  const handleInquirePlot = (plot) => {
    if (!plot) return
    setInquiry(prev => ({
      ...prev,
      message: `I am interested in acquiring ${plot.number} at "${property.name}" (listed at ${plot.price}). Please coordinate a private briefing with my office.`
    }))
    // Scroll to contact form
    const contactForm = document.getElementById('details-inquiry-form')
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Helper colors for interactive masterplan
  const getStatusOutline = (plot, isSelected) => {
    if (isSelected) return 'stroke-[#F4C542] stroke-[3px] filter drop-shadow-[0_0_8px_rgba(244,197,66,0.6)]'
    switch (plot.status) {
      case 'available': return 'stroke-[#10B981] stroke-[2px]'
      case 'reserved': return 'stroke-[#F59E0B] stroke-[2px]'
      case 'sold': return 'stroke-[#374151] stroke-[2px]'
      default: return 'stroke-gray-600 stroke-[2px]'
    }
  }

  const getStatusFill = (status) => {
    switch (status) {
      case 'available': return 'fill-[#0F2E2C]'
      case 'reserved': return 'fill-[#3A2E1A]'
      case 'sold': return 'fill-[#1B2433]'
      default: return 'fill-[#131F32]'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="rounded bg-[#10B981]/15 px-3 py-1 text-[10px] font-bold tracking-widest text-[#10B981] uppercase border border-[#10B981]/30">
            Available
          </span>
        )
      case 'reserved':
        return (
          <span className="rounded bg-[#F59E0B]/15 px-3 py-1 text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase border border-[#F59E0B]/30">
            Reserved
          </span>
        )
      case 'sold':
        return (
          <span className="rounded bg-[#374151]/30 px-3 py-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase border border-[#374151]/30">
            Sold
          </span>
        )
      default: return null
    }
  }

  const getSvgWidth = () => {
    if (!property || !Array.isArray(property.plots) || property.plots.length === 0) return 600
    let maxX = 0
    property.plots.forEach(plot => {
      const endX = (plot.x || 0) + (plot.width || 0)
      if (endX > maxX) maxX = endX
    })
    return Math.max(600, maxX + 70)
  }
  const svgWidth = getSvgWidth()

  return (
    <div className="bg-[#071120] text-white min-h-screen pt-28 pb-20 font-sans select-none">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12 space-y-12">
        
        {/* Navigation & Header */}
        <div className="reveal flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6" data-animate>
          <div className="space-y-1">
            <Link to="/projects" className="text-xs font-bold tracking-widest text-gray-400 hover:text-white uppercase transition-colors flex items-center gap-1.5 mb-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Portfolio
            </Link>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                isVenture ? 'bg-indigo-500/15 text-indigo-400' : 'bg-[#F4C542]/15 text-[#F4C542]'
              }`}>
                {property.tag}
              </span>
              <span className="text-xs text-gray-400">{property.location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white tracking-wide mt-2">{property.name}</h1>
          </div>
          <div className="text-left md:text-right shrink-0">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Value Allocation</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F4C542] mt-1">{property.price}</p>
          </div>
        </div>

        {/* Media Carousel and Specs Split */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
          
          {/* Media Suite Container */}
          <div className="reveal space-y-4" data-animate>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-3">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`text-xs font-bold tracking-widest uppercase pb-1 border-b-2 transition-all ${
                  activeMediaTab === 'photos'
                    ? 'border-[#F4C542] text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Photos ({allPhotos.length})
              </button>
              {videosList.length > 0 && (
                <button
                  onClick={() => setActiveMediaTab('videos')}
                  className={`text-xs font-bold tracking-widest uppercase pb-1 border-b-2 transition-all ${
                    activeMediaTab === 'videos'
                      ? 'border-[#F4C542] text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Video Presentation ({videosList.length})
                </button>
              )}
            </div>

            {/* Display screen */}
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-[#0A0F1E] border border-white/10 shadow-soft">
              {activeMediaTab === 'photos' ? (
                <img
                  src={activePhoto}
                  alt={property.name}
                  className="h-full w-full object-cover animate-fade-in"
                />
              ) : (
                activeVideo && (
                  activeVideo.includes('youtube.com') || activeVideo.includes('youtu.be') || activeVideo.includes('vimeo.com') ? (
                    <iframe
                      src={activeVideo}
                      title="Property Video Presentation"
                      className="h-full w-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={activeVideo}
                      key={activeVideo}
                      controls
                      className="h-full w-full object-cover"
                    />
                  )
                )
              )}
            </div>

            {/* Carousel thumbnails (Photos Only) */}
            {activeMediaTab === 'photos' && allPhotos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allPhotos.map((photo, index) => (
                  <button
                    key={`${photo}-${index}`}
                    onClick={() => setActivePhoto(photo)}
                    className={`h-16 w-24 overflow-hidden rounded-xl border shrink-0 transition-all ${
                      activePhoto === photo ? 'border-[#F4C542] opacity-100 scale-95' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Carousel thumbnails (Videos Only) */}
            {activeMediaTab === 'videos' && videosList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {videosList.map((video, index) => {
                  const isEmbed = video.includes('youtube.com') || video.includes('youtu.be') || video.includes('vimeo.com')
                  return (
                    <button
                      key={`${video}-${index}`}
                      onClick={() => setActiveVideo(video)}
                      className={`h-16 w-28 overflow-hidden rounded-xl border shrink-0 transition-all flex items-center justify-center bg-black/40 relative ${
                        activeVideo === video ? 'border-[#F4C542] opacity-100 scale-95' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {isEmbed ? (
                        <div className="text-center p-1">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Video {index + 1}</span>
                          <span className="text-[7px] text-gray-500">External Embed</span>
                        </div>
                      ) : (
                        <div className="text-center p-1 flex flex-col items-center gap-1">
                          <svg className="h-4 w-4 text-[#F4C542]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Video {index + 1}</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Asset Specs and Brochure Downloads */}
          <div className="reveal space-y-6" data-animate>
            <div className="bg-[#0F1A3A] border border-white/10 rounded-3xl p-6 space-y-6">
              <h3 className="text-lg font-serif font-bold text-white border-b border-white/5 pb-3 uppercase tracking-wider">Asset Specifications</h3>
              
              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
                  <AreaIcon className="h-5 w-5 text-[#F4C542]" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Area</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{property.details.area}</p>
                  </div>
                </div>
                {isVenture ? (
                  <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
                    <svg className="h-5 w-5 text-[#F4C542]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Subdivisions</p>
                      <p className="text-sm font-semibold text-white mt-0.5">{property.details.totalPlots} Land Plots</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
                      <BedIcon className="h-5 w-5 text-[#F4C542]" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Bedrooms</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{property.details.beds} Bedrooms</p>
                      </div>
                    </div>
                    <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
                      <BathIcon className="h-5 w-5 text-[#F4C542]" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Bathrooms</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{property.details.baths} Bathrooms</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 col-span-1 sm:col-span-2 md:col-span-1">
                  <svg className="h-5 w-5 text-[#F4C542]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Verification Status</p>
                    <p className="text-sm font-semibold text-[#00B289] mt-0.5 flex items-center gap-1">Approved Escrow</p>
                  </div>
                </div>
              </div>

              {/* Brochure Download Section */}
              {property.brochureUrl && (
                <div className="border-t border-white/5 pt-5 text-center">
                  <a
                    href={property.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 border border-[#F4C542]/40 hover:border-[#F4C542] bg-[#F4C542]/5 hover:bg-[#F4C542]/10 rounded-full text-[#F4C542] font-bold text-xs tracking-widest flex items-center justify-center gap-2 transition-all duration-300 uppercase cursor-pointer"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Property Brochure
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Layout Section */}
        <div className="reveal space-y-6" data-animate>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F4C542]">
                Architectural Layout
              </span>
              <h2 className="mt-1 text-3xl font-serif text-white tracking-wide">Property Layout Schema</h2>
              <p className="text-sm text-gray-400 max-w-2xl mt-1.5">
                {isVenture 
                  ? 'Review available subdivisions and sizes inside our interactive vector masterplan development canvas.'
                  : 'Examine structural floorplans and layout space structures mapped to this private luxury residence.'
                }
              </p>
            </div>

            {/* Filter and View Toggles Bar */}
            {isVenture && (
              <div className="flex flex-wrap items-center gap-4 bg-[#0B1528]/40 border border-white/5 p-4 rounded-2xl w-full md:w-auto">
                <div className="flex items-center gap-3">
                  {/* Size Range Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold">Size Range</label>
                    <div className="relative">
                      <select
                        value={sizeFilter}
                        onChange={(e) => setSizeFilter(e.target.value)}
                        className="appearance-none bg-[#111A2E] text-white border border-white/10 rounded-lg px-3.5 py-1.5 pr-8 text-[11px] focus:outline-none focus:border-[#F4C542] min-w-[150px] cursor-pointer font-semibold"
                      >
                        <option value="All Sizes">All Sizes</option>
                        <option value="2000 - 5000 sq ft">2000 - 5000 sq ft</option>
                        <option value="5000 - 10000 sq ft">5000 - 10000 sq ft</option>
                        <option value="10000 - 15000 sq ft">10000 - 15000 sq ft</option>
                        <option value="15000+ sq ft">15000+ sq ft</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Facing Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold">Facing</label>
                    <div className="relative">
                      <select
                        value={facingFilter}
                        onChange={(e) => setFacingFilter(e.target.value)}
                        className="appearance-none bg-[#111A2E] text-white border border-white/10 rounded-lg px-3.5 py-1.5 pr-8 text-[11px] focus:outline-none focus:border-[#F4C542] min-w-[120px] cursor-pointer font-semibold"
                      >
                        <option value="All Facings">All Facings</option>
                        <option value="North-East">North-East</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="South">South</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Toggles */}
                <div className="flex items-center bg-[#071120] border border-white/10 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setViewMode('layout')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                      viewMode === 'layout'
                        ? 'bg-[#F4C542] text-[#071120]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.182v10.764a1 1 0 01-.553.894L15 20l-6-3z" />
                    </svg>
                    Layout
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-[#F4C542] text-[#071120]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                      viewMode === 'table'
                        ? 'bg-[#F4C542] text-[#071120]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Table
                  </button>
                </div>
              </div>
            )}
          </div>

          {isVenture ? (
            /* Land Venture Interactive Layout Section */
            <div className="relative w-full overflow-hidden bg-[#080B11] rounded-3xl md:rounded-4xl border border-white/10 shadow-soft flex flex-col md:flex-row select-none">
              
              {/* Left Section: Active View Rendering */}
              <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[380px] md:min-h-0 relative">
                {viewMode === 'layout' ? (
                  /* Layout SVG Canvas with Interactive Drag and Zoom */
                  <div className="relative w-full h-[380px] bg-[#07090F] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center shadow-inner">
                    <div
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUpOrLeave}
                      onMouseLeave={handleMouseUpOrLeave}
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                      }}
                      className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <svg
                        viewBox={`0 0 ${svgWidth} 350`}
                        className="h-[300px] w-auto shrink-0 select-none pointer-events-auto"
                        style={{ overflow: 'visible' }}
                      >
                        <defs>
                          <pattern id="details-plan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1D4ED8" strokeWidth="0.75" strokeOpacity="0.06" />
                          </pattern>
                        </defs>
                        <rect width={svgWidth} height="350" fill="url(#details-plan-grid)" />
                        
                        <line x1="50" y1="50" x2={svgWidth - 50} y2="50" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 6" strokeOpacity="0.08" />
                        <line x1="50" y1="300" x2={svgWidth - 50} y2="300" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 6" strokeOpacity="0.08" />
                        
                        {/* Forest Buffer Overlay */}
                        <rect x="25" y="60" width="30" height="225" fill="#0C1B2E" stroke="#1D4ED8" strokeWidth="0.5" strokeOpacity="0.1" rx="0" />
                        <g transform="rotate(-90 40 172)">
                          <text x="40" y="172" textAnchor="middle" dominantBaseline="middle" className="text-[9px] font-extrabold tracking-[0.4em] fill-[#1E3A8A] opacity-50">
                            FOREST BUFFER ZONE
                          </text>
                        </g>

                        {/* Boulevard Driveway strip */}
                        <g>
                          <rect x="65" y="160" width={svgWidth - 120} height="24" rx="0" fill="#161920" stroke="#374151" strokeWidth="0.5" strokeOpacity="0.3" />
                          <line x1="75" y1="172" x2={svgWidth - 65} y2="172" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="6 8" strokeOpacity="0.25" />
                          <text x={(svgWidth - 120) / 2 + 65} y="175" className="text-[9px] font-bold tracking-[0.4em] fill-white/20" textAnchor="middle">
                            60FT BOULEVARD AVENUE
                          </text>
                        </g>

                        {/* Compass on right */}
                        <g transform={`translate(${svgWidth - 75}, 95)`}>
                          <circle r="16" fill="none" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.2"/>
                          <line x1="0" y1="-16" x2="0" y2="16" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.25"/>
                          <line x1="-16" y1="0" x2="16" y2="0" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.12"/>
                          <path d="M 0 -13 L 3 0 L 0 3 L -3 0 Z" fill="#F4C542" opacity="0.5"/>
                          <text x="0" y="-19" textAnchor="middle" fontSize="8" fill="#F4C542" fontWeight="extrabold" opacity="0.7">N</text>
                        </g>

                        {/* Rectangular Plots Grid */}
                        {property.plots?.map((plot) => {
                          const isSelected = selectedPlot?.id === plot.id
                          const isMatched = matchesSizeRange(plot.area, sizeFilter) && matchesFacing(plot.facing, facingFilter)
                          const opacityClass = isMatched ? 'opacity-100' : 'opacity-20'
                          
                          return (
                            <g
                              key={plot.id}
                              onClick={() => isMatched && setSelectedPlot(plot)}
                              className={`cursor-pointer transition-all duration-300 ${opacityClass}`}
                            >
                              <rect
                                x={plot.x}
                                y={plot.y}
                                width={plot.width}
                                height={plot.height}
                                rx={0}
                                ry={0}
                                className={`transition-all duration-300 ease-out ${getStatusFill(plot.status)} ${getStatusOutline(plot, isSelected)}`}
                              />
                              <text
                                x={plot.x + plot.width / 2}
                                y={plot.y + plot.height / 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] font-extrabold fill-white tracking-wider pointer-events-none"
                              >
                                {plot.number.replace(/Plot\s+/i, '')}
                              </text>
                            </g>
                          )
                        })}
                      </svg>
                    </div>

                    {/* Floating Zoom Controls (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-10">
                      <button
                        onClick={handleZoomIn}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#0F1626]/90 border border-white/10 hover:border-[#F4C542] text-white hover:text-[#F4C542] shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer text-base font-bold"
                        title="Zoom In"
                      >
                        +
                      </button>
                      <button
                        onClick={handleZoomOut}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#0F1626]/90 border border-white/10 hover:border-[#F4C542] text-white hover:text-[#F4C542] shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer text-base font-bold"
                        title="Zoom Out"
                      >
                        −
                      </button>
                      <button
                        onClick={handleResetZoom}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#0F1626]/90 border border-white/10 hover:border-[#F4C542] text-white hover:text-[#F4C542] shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer"
                        title="Reset View"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="3" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                        </svg>
                      </button>
                    </div>

                    {/* Floating Legend Card (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 bg-[#0B1220]/90 border border-white/10 p-3.5 rounded-xl shadow-xl backdrop-blur-md flex flex-col gap-2 z-10 text-[9px] font-bold uppercase tracking-wider text-gray-300 min-w-[110px]">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 bg-[#10B981] inline-block border border-[#10B981]/50" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 bg-[#F59E0B] inline-block border border-[#F59E0B]/50" />
                        <span>Reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 bg-[#374151] inline-block border border-[#374151]/50" />
                        <span>Sold</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 border border-[#F4C542] bg-[#3A2E1A] inline-block" />
                        <span>Selected</span>
                      </div>
                    </div>
                  </div>
                ) : viewMode === 'grid' ? (
                  /* Grid Card layout of plots */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                    {property.plots
                      ?.filter(plot => matchesSizeRange(plot.area, sizeFilter) && matchesFacing(plot.facing, facingFilter))
                      .map(plot => {
                        const isSelected = selectedPlot?.id === plot.id
                        return (
                          <div
                            key={plot.id}
                            onClick={() => setSelectedPlot(plot)}
                            className={`cursor-pointer bg-[#0D121E] border rounded-2xl p-4.5 transition-all duration-300 hover:-translate-y-0.5 ${
                              isSelected 
                                ? 'border-[#F4C542] bg-[#11224D]/40' 
                                : 'border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-sm font-bold text-white">{plot.number}</span>
                              {getStatusBadge(plot.status)}
                            </div>
                            <div className="space-y-1 text-xs text-gray-400">
                              <div className="flex justify-between">
                                <span>Area Size:</span>
                                <span className="text-white font-bold">{plot.area}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Dimensions:</span>
                                <span className="text-white font-semibold">{plot.dimensions}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Facing:</span>
                                <span className="text-white font-semibold">{plot.facing}</span>
                              </div>
                            </div>
                            <p className="mt-3.5 text-base font-bold text-[#F4C542]">{plot.price}</p>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  /* Table List layout of plots */
                  <div className="max-h-[380px] overflow-y-auto border border-white/5 rounded-2xl bg-[#07090F] scrollbar-thin">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-[#0F1626] text-gray-400 uppercase tracking-widest text-[8px] border-b border-white/5 sticky top-0 z-10">
                          <th className="p-3.5">Plot Number</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Area Size</th>
                          <th className="p-3.5">Dimensions</th>
                          <th className="p-3.5">Facing</th>
                          <th className="p-3.5">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {property.plots
                          ?.filter(plot => matchesSizeRange(plot.area, sizeFilter) && matchesFacing(plot.facing, facingFilter))
                          .map(plot => {
                            const isSelected = selectedPlot?.id === plot.id
                            return (
                              <tr
                                key={plot.id}
                                onClick={() => setSelectedPlot(plot)}
                                className={`cursor-pointer hover:bg-white/5 transition-colors ${
                                  isSelected ? 'bg-[#1D2E54]/30 text-white font-semibold' : 'text-gray-300'
                                }`}
                              >
                                <td className="p-3.5 font-bold">{plot.number}</td>
                                <td className="p-3.5">{getStatusBadge(plot.status)}</td>
                                <td className="p-3.5">{plot.area}</td>
                                <td className="p-3.5">{plot.dimensions}</td>
                                <td className="p-3.5">{plot.facing}</td>
                                <td className="p-3.5 font-bold text-[#F4C542]">{plot.price}</td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sidebar Details Panel */}
              <div className="w-full md:w-[380px] bg-[#07090F] p-6 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between shadow-lg">
                {selectedPlot ? (
                  <div className="flex flex-col h-full justify-between gap-6 animate-fade-in text-sans">
                    <div className="space-y-5">
                      {/* Plot Title Header */}
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-[#F4C542] font-bold tracking-[0.2em] uppercase">Selected Plot</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-3xl font-serif text-white">Plot</h3>
                          <span className="text-3xl font-bold font-serif text-[#F4C542]">
                            #{selectedPlot.number.replace(/Plot\s+/i, '')}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold tracking-wide mt-1">
                          {property.name} — Premium Sector
                        </p>
                      </div>

                      {/* Image Thumbnail Card */}
                      <div className="relative aspect-[2.2/1] w-full overflow-hidden rounded-2xl border border-white/10 shadow-md">
                        <img 
                          src={property.image} 
                          alt="Premium plot view" 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-[#0F2E2C]/95 border border-[#10B981]/30 px-2.5 py-1 rounded-md shadow-sm">
                          <span className="text-[9px] font-extrabold tracking-widest text-[#10B981] uppercase">
                            Premium View
                          </span>
                        </div>
                      </div>

                      {/* 2x2 Specs Grid */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-b border-white/10 pb-5">
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Area Size</p>
                          <p className="text-sm font-bold text-white mt-1 uppercase">{selectedPlot.area}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Dimensions</p>
                          <p className="text-sm font-bold text-white mt-1 uppercase">{selectedPlot.dimensions}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Facing</p>
                          <p className="text-sm font-bold text-white mt-1 uppercase">{selectedPlot.facing}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Road Width</p>
                          <p className="text-sm font-bold text-white mt-1 uppercase">{selectedPlot.roadWidth}</p>
                        </div>
                      </div>

                      {/* Price & EMI Card */}
                      <div className="bg-[#0D121E] border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Price</p>
                          <p className="text-2xl font-bold text-[#F4C542]">{selectedPlot.price}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">EMI Starting</p>
                          <p className="text-sm font-bold text-white">{calculateEMI(selectedPlot.price)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Button Controls */}
                    <div className="space-y-3">
                      {selectedPlot.status !== 'sold' ? (
                        <button
                          onClick={() => handleInquirePlot(selectedPlot)}
                          className="w-full py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#071120] rounded-xl font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-[#F59E0B]/20 transition-all duration-300 cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Enquire Now
                        </button>
                      ) : (
                        <div className="w-full py-2.5 bg-gray-800 text-gray-500 rounded-xl font-bold text-[10px] tracking-widest uppercase text-center cursor-not-allowed">
                          Sold Out
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleInquirePlot(selectedPlot)}
                          className="py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Schedule Visit
                        </button>
                        <button
                          className="py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Favorite
                        </button>
                      </div>

                      {/* Footer tags */}
                      <div className="border-t border-white/5 pt-4 flex justify-between text-[9px] font-bold uppercase tracking-wider text-gray-500">
                        <div className="flex items-center gap-1">
                          <span>Documents:</span>
                          <span className="text-white font-semibold">Ready</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Legal Clearance:</span>
                          <span className="text-white font-semibold">A+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <svg className="h-10 w-10 text-gray-600 animate-pulse mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303-.053-1.593 1.593M21.75 12h-2.25M17.303 19.303l-1.593-1.593M4.5 12H2.25M6.697 4.447l1.593 1.593M3.303 19.303l1.593-1.593" />
                    </svg>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 max-w-[220px] uppercase leading-relaxed">
                      Select a plot from the layout plan to load specifications and details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Standard Residence Layout Blueprint Image */
            <div className="relative w-full overflow-hidden rounded-3xl md:rounded-4xl bg-[#0F1A3A] border border-white/10 p-4 sm:p-6 shadow-soft flex items-center justify-center min-h-[260px] sm:min-h-[340px] md:min-h-[420px] aspect-video">
              <img
                src={property.layoutImage || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'}
                alt="Floorplan Blueprint Layout"
                className="h-full max-h-[380px] w-auto object-contain rounded-2xl border border-white/5 opacity-80"
              />
              <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 rounded-xl sm:rounded-2xl bg-[#071120]/85 border border-white/10 p-3 sm:p-4 backdrop-blur-sm">
                <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#F4C542]">Blueprint Specifications</span>
                <p className="text-[10px] sm:text-xs font-semibold mt-0.5 sm:mt-1 text-white">{property.details.area} Architectural Flowplan</p>
              </div>
            </div>
          )}
        </div>

        {/* CRM Enquiry & Briefing form */}
        <div id="details-inquiry-form" className="reveal max-w-3xl mx-auto border-t border-white/5 pt-12" data-animate>
          <div className="bg-[#0F1A3A] border border-white/10 rounded-3xl md:rounded-4xl p-5 sm:p-8 md:p-10 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F4C542]">Private Briefing Request</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white">Arrange an Escrow Consultation</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                Connect directly with our private office concierge. Submit your coordinates below and we will coordinate a secure virtual presentation.
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-[#00B289]/10 border border-[#00B289]/30 p-6 rounded-3xl text-center space-y-2 animate-fade-in">
                <svg className="h-10 w-10 text-[#00B289] mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <h4 className="text-sm font-bold uppercase tracking-widest text-white">Transmission Successful</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">Your briefing dossier has been queued. Our concierge desk will make contact within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Celia Monroe"
                      value={inquiry.name}
                      onChange={(e) => setInquiry(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Secure Email</label>
                    <input
                      type="email"
                      placeholder="e.g. celia@monroecapital.com"
                      value={inquiry.email}
                      onChange={(e) => setInquiry(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Secure Telephone</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (310) 555-9081"
                      value={inquiry.phone}
                      onChange={(e) => setInquiry(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Preferred Medium</label>
                    <select
                      value={inquiry.contact}
                      onChange={(e) => setInquiry(prev => ({ ...prev, contact: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                    >
                      <option>Private Briefing</option>
                      <option>Email</option>
                      <option>Phone</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Consultation Brief / Message</label>
                  <textarea
                    rows="3"
                    placeholder="Provide briefing guidelines..."
                    value={inquiry.message}
                    onChange={(e) => setInquiry(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#F4C542] hover:bg-[#d9ae36] disabled:bg-gray-800 text-[#071120] disabled:text-gray-500 font-bold text-xs tracking-widest uppercase rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-card cursor-pointer"
                >
                  <MailIcon className="h-5 w-5 shrink-0" />
                  {submitting ? 'Transmitting Brief...' : 'Request Private Dossier Presentation'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
