import { useState, useRef, useEffect } from 'react'

// Custom inline SVG icons mapping to replace Lucide dependency safely
const VastuIcon = ({ name, className }) => {
  switch (name) {
    case 'sun':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.72-12.72l-1.41 1.41" />
        </svg>
      )
    case 'flame':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'moon':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    case 'droplets':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    case 'alert-triangle':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'tree-pine':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8 21h8M12 3L5 12h14L12 3zm0 5l-5 7h10l-5-7z" />
        </svg>
      )
    case 'wind':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h15M3 18h12" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

// YIQ Brightness Check to determine legible contrasting text colors
function getContrastColor(hexColor) {
  if (!hexColor) return '#FFFFFF'
  const cleanHex = hexColor.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#0B1F3A' : '#FFFFFF'
}

export default function Visualizer() {
  const [form, setForm] = useState({
    width_ft: 40,
    depth_ft: 60,
    facing: 'East',
    floors: 'G+1',
    bhk: '2 BHK',
    bathrooms: '2',
    parking: '1 car',
    specialRequirements: ['Living room', 'Kitchen', 'Dining room'],
    stylePreference: 'Modern minimalist'
  })

  const [layout, setLayout] = useState(null)
  const [vastuReport, setVastuReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [vastuLoading, setVastuLoading] = useState(false)
  const [activeFloorTab, setActiveFloorTab] = useState('ground')

  const vastuRef = useRef(null)

  // Scroll to Vastu panel when loaded
  useEffect(() => {
    if (vastuReport && vastuRef.current) {
      vastuRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [vastuReport])

  // Multi-select requirements toggler
  const handleToggleRequirement = (req) => {
    setForm((prev) => {
      const active = prev.specialRequirements.includes(req)
      return {
        ...prev,
        specialRequirements: active
          ? prev.specialRequirements.filter((r) => r !== req)
          : [...prev.specialRequirements, req]
      }
    })
  }

  // AI Layout Generator simulation
  const handleGenerate = (e) => {
    e.preventDefault()
    setLoading(true)
    setVastuReport(null) // Reset Vastu report on new layout

    setTimeout(() => {
      // Create high-fidelity custom mockup floorplan based on inputs
      const isThreeStory = form.floors === 'G+2'
      const isTwoStory = form.floors === 'G+1' || isThreeStory
      const bhkCount = parseInt(form.bhk[0]) || 2

      const generatedLayout = {
        architect_note: `This custom ${form.bhk} ${form.stylePreference.toLowerCase()} layouts is mathematically optimized to capture maximum airflow based on a ${form.facing}-facing grid orientation. The central vertical transition column acts as an ambient temperature cooling tower, reducing mechanical energy loads while organizing private and utility spatial zones.`,
        floors: {
          ground: [
            { name: 'Living Room', x_pct: 5, y_pct: 45, w_pct: 45, h_pct: 50, color: '#1E3A8A' },
            { name: 'Kitchen', x_pct: 55, y_pct: 45, w_pct: 40, h_pct: 25, color: '#991B1B' },
            { name: 'Dining', x_pct: 55, y_pct: 73, w_pct: 40, h_pct: 22, color: '#854D0E' },
            { name: 'Foyer & Lobby', x_pct: 5, y_pct: 5, w_pct: 50, h_pct: 35, color: '#374151' },
            { name: 'Toilet 1', x_pct: 60, y_pct: 5, w_pct: 35, h_pct: 35, color: '#075985' }
          ]
        }
      }

      // Add bedrooms and layout buffers dynamically
      if (bhkCount >= 1) {
        generatedLayout.floors.ground.push({ name: 'Master Bed', x_pct: 5, y_pct: 45, w_pct: 45, h_pct: 50, color: '#065F46' })
        // Move living room on Ground floor to fit Bedroom
        const living = generatedLayout.floors.ground.find(r => r.name === 'Living Room')
        if (living) {
          living.x_pct = 5
          living.y_pct = 5
          living.w_pct = 50
          living.h_pct = 35
        }
        const foyer = generatedLayout.floors.ground.find(r => r.name === 'Foyer & Lobby')
        if (foyer) {
          foyer.x_pct = 55
          foyer.y_pct = 5
          foyer.w_pct = 40
          foyer.h_pct = 35
        }
      }

      if (isTwoStory) {
        generatedLayout.floors.first = [
          { name: 'Family Lounge', x_pct: 5, y_pct: 5, w_pct: 45, h_pct: 45, color: '#1E3A8A' },
          { name: 'Bedroom 2', x_pct: 55, y_pct: 5, w_pct: 40, h_pct: 45, color: '#0F766E' },
          { name: 'Toilet 2', x_pct: 55, y_pct: 55, w_pct: 40, h_pct: 40, color: '#075985' }
        ]

        if (form.specialRequirements.includes('Pooja room')) {
          generatedLayout.floors.first.push({ name: 'Pooja Sanctum', x_pct: 5, y_pct: 55, w_pct: 20, h_pct: 40, color: '#D97706' })
          generatedLayout.floors.first.push({ name: 'Open Terrace', x_pct: 27, y_pct: 55, w_pct: 23, h_pct: 40, color: '#1E293B' })
        } else {
          generatedLayout.floors.first.push({ name: 'Open Terrace', x_pct: 5, y_pct: 55, w_pct: 45, h_pct: 40, color: '#1E293B' })
        }
      }

      if (isThreeStory) {
        generatedLayout.floors.second = [
          { name: 'Guest Room', x_pct: 5, y_pct: 5, w_pct: 45, h_pct: 45, color: '#115E59' },
          { name: 'Open Terrace', x_pct: 5, y_pct: 55, w_pct: 90, h_pct: 40, color: '#1E293B' }
        ]
        if (bhkCount >= 3) {
          generatedLayout.floors.second.push({ name: 'Bedroom 3', x_pct: 55, y_pct: 5, w_pct: 40, h_pct: 45, color: '#115E59' })
          const guest = generatedLayout.floors.second.find(r => r.name === 'Guest Room')
          if (guest) guest.name = 'Study/Office'
        }
      }

      // Incorporate garden
      if (form.specialRequirements.includes('Garden/lawn')) {
        generatedLayout.floors.ground.unshift({ name: 'Garden Lawn', x_pct: 5, y_pct: 85, w_pct: 90, h_pct: 12, color: '#064E3B' })
        // Shrink other spaces proportionally
        generatedLayout.floors.ground.forEach(r => {
          if (r.name !== 'Garden Lawn' && r.y_pct > 30) {
            r.h_pct = Math.round(r.h_pct * 0.8)
          }
        })
      }

      setLayout(generatedLayout)
      setActiveFloorTab('ground')
      setLoading(false)
    }, 1500)
  }

  // Vastu Report generator simulation
  const handleCheckVastu = () => {
    setVastuLoading(true)

    setTimeout(() => {
      const isVastuStyle = form.stylePreference === 'Traditional/Vastu'
      const scoreValue = isVastuStyle
        ? form.facing === 'East' ? 96 : 91
        : form.facing === 'East' ? 82 : 68

      const report = {
        score: scoreValue,
        summary: isVastuStyle
          ? `Exceptional Vedic design adherence. The layout plan exhibits perfect alignments with cosmic directions, optimizing solar charging and ensuring zero high-priority energy blockages.`
          : `Good layout base, but multiple secondary zones require spatial restructuring to prevent vital force drain. Southern sleeping alignments and kitchen energy sectors are misaligned.`,
        compass_note: `The building threshold faces standard solar ${form.facing} (azimuth angle optimized).`,
        compliant: [
          {
            icon_key: 'sun',
            title: 'Northeast Foyer Entrance',
            tag: 'Ideal',
            description: 'Enables high-frequency atmospheric ionization to charge the living room corridor naturally.'
          },
          {
            icon_key: 'flame',
            title: 'Southeast Kitchen Zone',
            tag: 'Ideal',
            description: 'Aligns the element of Agni (fire) precisely with dominant thermal flows, balancing indoor air metrics.'
          }
        ],
        adjustments: [
          {
            icon_key: 'alert-triangle',
            title: 'Southwest Bathroom Ventilation',
            tag: 'Important',
            description: 'Relocate wastewater outflows immediately. Keeping a drainage stack in Southwest drains earth energies.'
          },
          {
            icon_key: 'moon',
            title: 'Northwest Sleeping Orientation',
            tag: 'Adjust',
            description: 'If shifting bedroom is impossible, place a copper energy pyramid under the headboard to align geomagnetic nodes.'
          }
        ],
        quick_wins: [
          {
            icon_key: 'zap',
            title: 'Hang Copper Surya Plate',
            tag: 'Good',
            description: 'Mount on the main outer threshold to deflect high-frequency secondary radiation waves.'
          },
          {
            icon_key: 'tree-pine',
            title: 'Place A Tulsi Plant',
            tag: 'Ideal',
            description: 'Keep in the Northeast buffer corner to stabilize electromagnetic fields.'
          }
        ]
      }

      setVastuReport(report)
      setVastuLoading(false)
    }, 1000)
  }

  // Retrofit 2BHK Callback
  const handleRetry2BHK = () => {
    setForm(prev => ({ ...prev, bhk: '2 BHK' }))
    setLoading(true)
    setTimeout(() => {
      setForm(prev => {
        const mockForm = { ...prev, bhk: '2 BHK' }
        // Manually trigger generation with updated G+1 configuration
        const generatedLayout = {
          architect_note: `Optimized layout strictly mapped to a G+1 2 BHK residential configuration. Ground level hosts shared social foyers, whereas the upper deck preserves absolute sleeping isolation.`,
          floors: {
            ground: [
              { name: 'Master Bed', x_pct: 5, y_pct: 45, w_pct: 45, h_pct: 50, color: '#065F46' },
              { name: 'Living Room', x_pct: 5, y_pct: 5, w_pct: 50, h_pct: 35, color: '#1E3A8A' },
              { name: 'Foyer & Lobby', x_pct: 55, y_pct: 5, w_pct: 40, h_pct: 35, color: '#374151' },
              { name: 'Kitchen', x_pct: 55, y_pct: 45, w_pct: 40, h_pct: 25, color: '#991B1B' },
              { name: 'Dining', x_pct: 55, y_pct: 73, w_pct: 40, h_pct: 22, color: '#854D0E' },
              { name: 'Toilet 1', x_pct: 60, y_pct: 5, w_pct: 35, h_pct: 35, color: '#075985' }
            ],
            first: [
              { name: 'Bedroom 2', x_pct: 55, y_pct: 5, w_pct: 40, h_pct: 45, color: '#0F766E' },
              { name: 'Family Lounge', x_pct: 5, y_pct: 5, w_pct: 45, h_pct: 45, color: '#1E3A8A' },
              { name: 'Toilet 2', x_pct: 55, y_pct: 55, w_pct: 40, h_pct: 40, color: '#075985' },
              { name: 'Open Terrace', x_pct: 5, y_pct: 55, w_pct: 45, h_pct: 40, color: '#1E293B' }
            ]
          }
        }
        setLayout(generatedLayout)
        setActiveFloorTab('ground')
        setVastuReport(null)
        setLoading(false)
        return mockForm
      })
    }, 1000)
  }

  // Retrofit Vastu Compliance Callback
  const handleRegenerateVastu = () => {
    setForm(prev => ({ ...prev, stylePreference: 'Traditional/Vastu' }))
    setLoading(true)
    setTimeout(() => {
      setForm(prev => {
        const mockForm = { ...prev, stylePreference: 'Traditional/Vastu' }
        // Generate with shifted rooms ensuring pure compliant Vastu quadrants
        const generatedLayout = {
          architect_note: `VEDIC FLOORPLAN STANDARD: Re-engineered layout under Vastu Purusha Mandala protocols. Kitchen shifted to Southeast (Agni), Master Suite locks down Southwest (Nairutya), and Foyer resides in Northeast (Ishanya) to optimize cosmic bio-frequencies.`,
          floors: {
            ground: [
              { name: 'Master Bed (SW)', x_pct: 5, y_pct: 45, w_pct: 45, h_pct: 50, color: '#065F46' },
              { name: 'Foyer (NE)', x_pct: 55, y_pct: 5, w_pct: 40, h_pct: 35, color: '#374151' },
              { name: 'Living Room', x_pct: 5, y_pct: 5, w_pct: 50, h_pct: 35, color: '#1E3A8A' },
              { name: 'Kitchen (SE)', x_pct: 55, y_pct: 45, w_pct: 40, h_pct: 25, color: '#991B1B' },
              { name: 'Dining', x_pct: 55, y_pct: 73, w_pct: 40, h_pct: 22, color: '#854D0E' },
              { name: 'Toilet (NW)', x_pct: 60, y_pct: 5, w_pct: 35, h_pct: 35, color: '#075985' }
            ]
          }
        }

        // Incorporate first floor as G+1 default
        if (mockForm.floors !== 'G') {
          generatedLayout.floors.first = [
            { name: 'Bedroom 2', x_pct: 55, y_pct: 5, w_pct: 40, h_pct: 45, color: '#0F766E' },
            { name: 'Family Lounge', x_pct: 5, y_pct: 5, w_pct: 45, h_pct: 45, color: '#1E3A8A' },
            { name: 'Pooja (NE)', x_pct: 5, y_pct: 55, w_pct: 25, h_pct: 40, color: '#D97706' },
            { name: 'Toilet 2', x_pct: 55, y_pct: 55, w_pct: 40, h_pct: 40, color: '#075985' }
          ]
        }

        setLayout(generatedLayout)
        setActiveFloorTab('ground')
        // Automatically check vastu report with high-score
        const vastuReportValue = {
          score: 98,
          summary: `Flawless Vedic alignment achieved. All rooms sit in their absolute ideal quadrants. Magnetic solar currents distribute perfectly through the core threshold.`,
          compass_note: `The building faces solar ${mockForm.facing}. Nairutya and Ishanya nodes are highly stabilized.`,
          compliant: [
            {
              icon_key: 'sun',
              title: 'Northeast Ishanya Foyer',
              tag: 'Ideal',
              description: 'Attracts early cosmic solar induction. Perfect placement.'
            },
            {
              icon_key: 'flame',
              title: 'Southeast Agni Kitchen',
              tag: 'Ideal',
              description: 'Combustion element is anchored in the fire quadrant correctly.'
            },
            {
              icon_key: 'tree-pine',
              title: 'Southwest Nairutya Master Bed',
              tag: 'Ideal',
              description: 'Coordinates heavy building loads to ground geomagnetic currents, inducing deep sleep cycles.'
            }
          ],
          compliant_extra: true,
          adjustments: [],
          quick_wins: []
        }
        setVastuReport(vastuReportValue)
        setLoading(false)
        return mockForm
      })
    }, 1000)
  }

  // Width to Depth aspect ratio SVG calculations
  const plotWidth = 400
  const plotHeight = Math.max(250, Math.min(500, (form.depth_ft / form.width_ft) * plotWidth))
  const pad = 40
  const svgWidth = plotWidth + pad * 2
  const svgHeight = plotHeight + pad * 2

  // Get active floor rooms safely
  const activeRooms = layout?.floors[activeFloorTab] || []

  // Renders beautiful arrow markers on the respective facing edge
  const renderFacingArrow = () => {
    const arrowColor = '#E0A500' // Gold
    const textStyle = "text-[9px] font-extrabold fill-[#E0A500] tracking-widest uppercase"
    
    switch (form.facing) {
      case 'East':
        return (
          <g transform={`translate(${pad + plotWidth + 15}, ${pad + plotHeight / 2})`}>
            <line x1="15" y1="0" x2="-10" y2="0" stroke={arrowColor} strokeWidth="2" markerEnd="url(#arrow)" />
            <polygon points="-12,0 -4,-4 -4,4" fill={arrowColor} />
            <text x="5" y="-6" textAnchor="middle" className={textStyle} transform="rotate(90)">Facing East</text>
          </g>
        )
      case 'West':
        return (
          <g transform={`translate(${pad - 15}, ${pad + plotHeight / 2})`}>
            <line x1="-15" y1="0" x2="10" y2="0" stroke={arrowColor} strokeWidth="2" />
            <polygon points="12,0 4,-4 4,4" fill={arrowColor} />
            <text x="-5" y="-6" textAnchor="middle" className={textStyle} transform="rotate(-90)">Facing West</text>
          </g>
        )
      case 'North':
        return (
          <g transform={`translate(${pad + plotWidth / 2}, ${pad - 15})`}>
            <line x1="0" y1="-15" x2="0" y2="10" stroke={arrowColor} strokeWidth="2" />
            <polygon points="0,12 -4,4 4,4" fill={arrowColor} />
            <text x="0" y="-18" textAnchor="middle" className={textStyle}>Facing North</text>
          </g>
        )
      case 'South':
        return (
          <g transform={`translate(${pad + plotWidth / 2}, ${pad + plotHeight + 15})`}>
            <line x1="0" y1="15" x2="0" y2="-10" stroke={arrowColor} strokeWidth="2" />
            <polygon points="0,-12 -4,-4 4,-4" fill={arrowColor} />
            <text x="0" y="24" textAnchor="middle" className={textStyle}>Facing South</text>
          </g>
        )
      default:
        return null
    }
  }

  // Get unique rooms with colors for layout legend swatches
  const getUniqueRooms = () => {
    if (!layout) return []
    const roomsMap = new Map()
    Object.values(layout.floors).forEach(floorRooms => {
      floorRooms.forEach(room => {
        if (!roomsMap.has(room.name)) {
          roomsMap.set(room.name, room.color)
        }
      })
    })
    return Array.from(roomsMap.entries()).map(([name, color]) => ({ name, color }))
  }

  return (
    <div className="min-h-screen bg-ivory text-navy pt-28 pb-16 px-4 md:px-8 font-sans">
      <div className="mx-auto max-w-[1280px]">
        {/* Header Block with custom fonts */}
        <header className="mb-10 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Advanced Generative Advisory
          </span>
          <h1 className="mt-2 text-4xl md:text-5xl font-serif text-navy tracking-wide">
            AI House Visualiser
          </h1>
          <p className="mt-3 text-sm text-navy/70 max-w-xl">
            Enter your plot details. Claude will generate a high-performance vector floor plan mapped to custom style and environmental frameworks.
          </p>
        </header>

        {/* Two-Column Desktop Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-[420px,1fr] items-start">
          
          {/* Sticky Left Form Panel */}
          <aside className="bg-white border border-navy/10 rounded-4xl p-6 md:p-8 space-y-6 lg:sticky lg:top-28 shadow-soft text-navy">
            <div>
              <h2 className="text-xl font-bold text-navy tracking-wide">Design Inputs</h2>
              <p className="text-xs text-navy/60 mt-1">Configure layout specifications below</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Plot Dimensions Input Group */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/60 font-bold">1. Plot Dimensions (ft)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">Width (20-100)</span>
                    <input
                      type="number"
                      min="20"
                      max="100"
                      value={form.width_ft}
                      onChange={(e) => setForm(prev => ({ ...prev, width_ft: Number(e.target.value) }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">Depth (30-120)</span>
                    <input
                      type="number"
                      min="30"
                      max="120"
                      value={form.depth_ft}
                      onChange={(e) => setForm(prev => ({ ...prev, depth_ft: Number(e.target.value) }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Main Structural Settings */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/60 font-bold">2. Configuration</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">Facing</span>
                    <select
                      value={form.facing}
                      onChange={(e) => setForm(prev => ({ ...prev, facing: e.target.value }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-2.5 py-2 text-xs text-navy focus:outline-none focus:border-gold"
                    >
                      <option>East</option>
                      <option>West</option>
                      <option>North</option>
                      <option>South</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">Floors</span>
                    <select
                      value={form.floors}
                      onChange={(e) => setForm(prev => ({ ...prev, floors: e.target.value }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-2.5 py-2 text-xs text-navy focus:outline-none focus:border-gold"
                    >
                      <option>G</option>
                      <option>G+1</option>
                      <option>G+2</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">BHK</span>
                    <select
                      value={form.bhk}
                      onChange={(e) => setForm(prev => ({ ...prev, bhk: e.target.value }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-2.5 py-2 text-xs text-navy focus:outline-none focus:border-gold"
                    >
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Utility configuration */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/60 font-bold">3. Rooms Needed</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">Bathrooms</span>
                    <select
                      value={form.bathrooms}
                      onChange={(e) => setForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-navy/40 block mb-1">Parking Lot</span>
                    <select
                      value={form.parking}
                      onChange={(e) => setForm(prev => ({ ...prev, parking: e.target.value }))}
                      className="w-full bg-ivory border border-navy/15 rounded px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold"
                    >
                      <option>None</option>
                      <option>1 car</option>
                      <option>2 cars</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Multi-Select Requirements Chips */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/60 font-bold">4. Special Requirements</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Pooja room', 'Study room', 'Open terrace', 
                    'Living room', 'Kitchen', 'Dining room', 
                    'Guest room', 'Servant quarters', 'Garden/lawn'
                  ].map((option) => {
                    const isSelected = form.specialRequirements.includes(option)
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => handleToggleRequirement(option)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                          isSelected
                            ? 'bg-gold text-navy'
                            : 'bg-transparent border border-navy/20 text-navy/70 hover:border-navy/50'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Single Select Style Preference Chips */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/60 font-bold">5. Style Preference</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Modern minimalist', 'Traditional/Vastu', 
                    'Contemporary', 'Compact & efficient'
                  ].map((option) => {
                    const isSelected = form.stylePreference === option
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setForm(prev => ({ ...prev, stylePreference: option }))}
                        className={`px-3.5 py-1.5 rounded text-xs font-semibold tracking-wider transition-all duration-300 ${
                          isSelected
                            ? 'bg-gold text-navy'
                            : 'bg-transparent border border-navy/20 text-navy/70 hover:border-navy/50'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gold hover:bg-gold/90 disabled:bg-gray-200 disabled:text-gray-400 rounded text-navy font-bold text-xs tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 uppercase shadow-soft"
                >
                  {loading ? (
                    <>
                      {/* Loading Spinner */}
                      <svg className="animate-spin h-4 w-4 text-navy" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Claude is designing...</span>
                    </>
                  ) : (
                    <span>Generate Layout →</span>
                  )}
                </button>
              </div>
            </form>
          </aside>

          {/* Right Panel: Output and Diagrams */}
          <main className="space-y-8">
            
            {layout ? (
              // Active Floorplan View
              <section className="bg-white border border-navy/10 text-navy rounded-4xl p-6 md:p-8 space-y-6 shadow-soft">
                
                {/* 1. Dynamic Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-navy/10 pb-6 text-center md:text-left select-none">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Plot Size</p>
                    <p className="text-base font-semibold text-navy mt-0.5">{form.width_ft} × {form.depth_ft} ft</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Total Area</p>
                    <p className="text-base font-semibold text-navy mt-0.5">{form.width_ft * form.depth_ft} sqft</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Built-up Area</p>
                    <p className="text-base font-semibold text-gold mt-0.5">~{Math.round(form.width_ft * form.depth_ft * 0.63)} sqft</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Configuration</p>
                    <p className="text-base font-semibold text-navy mt-0.5">{form.bhk} · {form.floors}</p>
                  </div>
                </div>

                {/* 2. Architect Note */}
                <div className="border-l-2 border-gold pl-4 italic text-sm text-navy/80 leading-relaxed py-1">
                  "{layout.architect_note}"
                </div>

                {/* 3. Floor Tabs Selection (only if upper floors exist) */}
                {Object.keys(layout.floors).length > 1 && (
                  <div className="flex items-center gap-2 bg-ivory p-1.5 rounded-lg w-fit select-none">
                    {Object.keys(layout.floors).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFloorTab(tab)}
                        className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                          activeFloorTab === tab
                            ? 'bg-gold text-navy'
                            : 'text-navy/60 hover:text-navy'
                        }`}
                      >
                        {tab === 'ground' ? 'Ground Floor' : tab === 'first' ? 'First Floor' : 'Second Floor'}
                      </button>
                    ))}
                  </div>
                )}

                {/* 4. Interactive SVG Floorplan Canvas */}
                <div className="relative bg-ivory rounded-2xl border border-navy/5 p-8 flex items-center justify-center overflow-x-auto">
                  <svg
                    width={svgWidth}
                    height={svgHeight}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="max-w-full select-none"
                  >
                    {/* Background grid */}
                    <defs>
                      <pattern id="room-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#F4C542" strokeWidth="0.5" strokeOpacity="0.1" />
                      </pattern>
                    </defs>
                    <rect width={svgWidth} height={svgHeight} fill="url(#room-grid)" />

                    {/* Outer Dashed Plot boundary box */}
                    <rect
                      x={pad}
                      y={pad}
                      width={plotWidth}
                      height={plotHeight}
                      fill="none"
                      stroke="#0B1F3A"
                      strokeWidth="2"
                      strokeDasharray="4 6"
                      strokeOpacity="0.3"
                    />

                    {/* Edge Dimension Labels */}
                    {/* Top Plot Width label */}
                    <text x={pad + plotWidth / 2} y={pad - 12} textAnchor="middle" className="text-[10px] font-bold fill-navy/70 tracking-widest">
                      {form.width_ft} FT
                    </text>
                    <line x1={pad} y1={pad - 6} x2={pad + plotWidth} y2={pad - 6} stroke="#0B1F3A" strokeWidth="0.75" strokeOpacity="0.2" />

                    {/* Left Plot Depth label */}
                    <g transform={`rotate(-90 ${pad - 15} ${pad + plotHeight / 2})`}>
                      <text x={pad - 15} y={pad + plotHeight / 2} textAnchor="middle" className="text-[10px] font-bold fill-navy/70 tracking-widest">
                        {form.depth_ft} FT
                      </text>
                    </g>
                    <line x1={pad - 6} y1={pad} x2={pad - 6} y2={pad + plotHeight} stroke="#0B1F3A" strokeWidth="0.75" strokeOpacity="0.2" />

                    {/* Dynamic Facing Arrow on correct boundary */}
                    {renderFacingArrow()}

                    {/* Render Rooms as Colored Boxes inside dynamic aspect boundary */}
                    {activeRooms.map((room, idx) => {
                      const rx = pad + (room.x_pct / 100) * plotWidth
                      const ry = pad + (room.y_pct / 100) * plotHeight
                      const rw = (room.w_pct / 100) * plotWidth
                      const rh = (room.h_pct / 100) * plotHeight
                      
                      const txtColor = getContrastColor(room.color)
                      const rx_center = rx + rw / 2
                      const ry_center = ry + rh / 2

                      // Calculate dynamically translated feet sizes inside Room boundary
                      const roomW_ft = Math.round((room.w_pct / 100) * form.width_ft)
                      const roomD_ft = Math.round((room.h_pct / 100) * form.depth_ft)

                      return (
                        <g key={`${room.name}-${idx}`} className="transition-all duration-500">
                          {/* Room Rect boundary */}
                          <rect
                            x={rx}
                            y={ry}
                            width={rw}
                            height={rh}
                            fill={room.color}
                            fillOpacity="0.85"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            rx="3"
                          />
                          
                          {/* Room Labels inside the Box (only render if box size permits) */}
                          {rw > 45 && rh > 35 ? (
                            <>
                              <text
                                x={rx_center}
                                y={ry_center - 4}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={txtColor}
                                className="text-[9px] font-bold tracking-wider"
                              >
                                {room.name}
                              </text>
                              <text
                                x={rx_center}
                                y={ry_center + 6}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={txtColor}
                                fillOpacity="0.75"
                                className="text-[7.5px] font-semibold"
                              >
                                {roomW_ft}' × {roomD_ft}'
                              </text>
                            </>
                          ) : (
                            <text
                              x={rx_center}
                              y={ry_center}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={txtColor}
                              className="text-[8px] font-bold"
                            >
                              {room.name[0]}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* 5. Interactive Room Swatch Legend */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Color Index</p>
                  <div className="flex flex-wrap gap-4 select-none">
                    {getUniqueRooms().map((room) => (
                      <span key={room.name} className="flex items-center gap-2 text-xs font-semibold text-navy/70">
                        <span className="h-3.5 w-3.5 rounded" style={{ backgroundColor: room.color }} />
                        {room.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 6. Dynamic Action Buttons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-navy/10 pt-6 select-none">
                  <button
                    type="button"
                    className="py-3 border border-navy/20 hover:border-navy/50 text-navy font-bold text-xs tracking-wider rounded transition-all duration-300 uppercase"
                  >
                    Estimate Cost ↗
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckVastu}
                    disabled={vastuLoading}
                    className="py-3 bg-transparent border border-gold text-gold hover:bg-gold/10 font-bold text-xs tracking-wider rounded transition-all duration-300 uppercase flex items-center justify-center gap-2"
                  >
                    {vastuLoading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-gold" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Checking...</span>
                      </>
                    ) : (
                      <span>Check Vastu ↗</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRetry2BHK}
                    className="py-3 border border-navy/20 hover:border-navy/50 text-navy font-bold text-xs tracking-wider rounded transition-all duration-300 uppercase"
                  >
                    Try 2BHK ↗
                  </button>
                </div>

              </section>
            ) : (
              // Empty State Placeholder View
              <div
                className="border-2 border-dashed border-navy/20 rounded-2xl flex flex-col items-center justify-center p-12 text-center"
                style={{
                  minHeight: `${Math.max(300, Math.min(500, (form.depth_ft / form.width_ft) * 350))}px`
                }}
              >
                <div className="text-navy/20 mb-4 animate-pulse">
                  {/* Blueprint House Icon */}
                  <svg className="h-14 w-14 text-navy/15" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold tracking-[0.2em] text-navy/50 uppercase">
                  Your floor plan will appear here
                </h3>
                <p className="text-xs text-navy/35 max-w-[280px] mt-2 leading-relaxed">
                  Adjust values on the left and trigger the generator to build custom CAD vector models.
                </p>
              </div>
            )}

            {/* Vastu Compliance Panel (Dynamic Slide-Up animation when active) */}
            {vastuReport && (
              <section
                ref={vastuRef}
                className="bg-white border border-gold/30 rounded-4xl p-6 md:p-8 space-y-8 animate-vastu-panel shadow-soft text-navy"
              >
                {/* Header: Score Ring + Note layout */}
                <div className="flex flex-col md:flex-row items-center gap-6 border-b border-navy/10 pb-6 select-none">
                  {/* Progress Radial Ring SVG */}
                  <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="45"
                        fill="transparent"
                        stroke="#F6F7F9"
                        strokeWidth="8"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="45"
                        fill="transparent"
                        stroke="#F4C542"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - vastuReport.score / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-navy">{vastuReport.score}</span>
                      <span className="text-[8px] font-bold text-navy/50 tracking-widest uppercase">Score</span>
                    </div>
                  </div>

                  {/* Summary Notes */}
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-lg font-bold text-navy tracking-wide">Vastu Mandala Assessment</h3>
                    <p className="text-xs text-navy/80 leading-relaxed max-w-xl">{vastuReport.summary}</p>
                    <p className="text-[10px] text-gold font-bold tracking-widest uppercase mt-2">
                      {vastuReport.compass_note}
                    </p>
                  </div>
                </div>

                {/* Dual Layout: Columns of Vastu features + Circular Compass */}
                <div className="grid gap-8 md:grid-cols-[1fr,240px] items-start">
                  
                  {/* Vastu items listing cards */}
                  <div className="space-y-6 select-none">
                    
                    {/* Section 1: Compliant gets right */}
                    {vastuReport.compliant.length > 0 && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs font-bold tracking-widest text-emerald-600 uppercase flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          What this layout gets right
                        </h4>
                        <div className="grid gap-3">
                          {vastuReport.compliant.map((item, idx) => (
                            <div key={`comp-${idx}`} className="bg-ivory border border-navy/5 p-4 rounded-xl flex gap-3.5 items-start">
                              <div className="p-2 bg-gold/15 text-gold rounded-lg shrink-0">
                                <VastuIcon name={item.icon_key} className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-navy">{item.title}</h5>
                                  <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
                                    {item.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] text-navy/70 leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Adjustments recommended */}
                    {vastuReport.adjustments.length > 0 && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs font-bold tracking-widest text-orange-600 uppercase flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                          Adjustments recommended
                        </h4>
                        <div className="grid gap-3">
                          {vastuReport.adjustments.map((item, idx) => {
                            const isImportant = item.tag === 'Important'
                            return (
                              <div
                                key={`adj-${idx}`}
                                className={`bg-ivory border border-navy/5 p-4 rounded-xl flex gap-3.5 items-start ${
                                  isImportant ? 'border-l-4 border-l-red-500' : ''
                                }`}
                              >
                                <div className={`p-2 rounded-lg shrink-0 ${isImportant ? 'bg-red-500/15 text-red-500' : 'bg-orange-500/15 text-orange-500'}`}>
                                  <VastuIcon name={item.icon_key} className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold text-navy">{item.title}</h5>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${
                                      isImportant ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                                    }`}>
                                      {item.tag}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-navy/70 leading-relaxed">{item.description}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section 3: Quick wins */}
                    {vastuReport.quick_wins.length > 0 && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs font-bold tracking-widest text-teal-600 uppercase flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                          Quick wins to improve score
                        </h4>
                        <div className="grid gap-3">
                          {vastuReport.quick_wins.map((item, idx) => (
                            <div key={`win-${idx}`} className="bg-ivory border border-navy/5 p-4 rounded-xl flex gap-3.5 items-start">
                              <div className="p-2 bg-teal-500/15 text-teal-600 rounded-lg shrink-0">
                                <VastuIcon name={item.icon_key} className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-navy">{item.title}</h5>
                                  <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-teal-500/10 text-teal-600">
                                    {item.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] text-navy/70 leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Vector Compass Dial mapping facing directions */}
                  <div className="flex flex-col items-center justify-center bg-ivory border border-navy/5 rounded-2xl p-6 select-none shrink-0 self-center">
                    <svg width="150" height="150" viewBox="0 0 150 150" className="max-w-full">
                      {/* Compass Circle */}
                      <circle cx="75" cy="75" r="60" fill="none" stroke="#F4C542" strokeWidth="1.5" strokeOpacity="0.3" />
                      <circle cx="75" cy="75" r="50" fill="none" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.15" />

                      {/* Direction Ticks */}
                      <line x1="75" y1="15" x2="75" y2="25" stroke="#F4C542" strokeWidth="1.5" strokeOpacity="0.5" />
                      <line x1="75" y1="125" x2="75" y2="135" stroke="#F4C542" strokeWidth="1.5" strokeOpacity="0.5" />
                      <line x1="15" y1="75" x2="25" y2="75" stroke="#F4C542" strokeWidth="1.5" strokeOpacity="0.5" />
                      <line x1="125" y1="75" x2="135" y2="75" stroke="#F4C542" strokeWidth="1.5" strokeOpacity="0.5" />

                      {/* Direction labels (Highlight active direction in Gold) */}
                      <text x="75" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" className={form.facing === 'North' ? 'fill-gold font-extrabold' : 'fill-navy/40'}>N</text>
                      <text x="75" y="126" textAnchor="middle" fontSize="10" fontWeight="bold" className={form.facing === 'South' ? 'fill-gold font-extrabold' : 'fill-navy/40'}>S</text>
                      <text x="118" y="79" textAnchor="middle" fontSize="10" fontWeight="bold" className={form.facing === 'East' ? 'fill-gold font-extrabold' : 'fill-navy/40'}>E</text>
                      <text x="32" y="79" textAnchor="middle" fontSize="10" fontWeight="bold" className={form.facing === 'West' ? 'fill-gold font-extrabold' : 'fill-navy/40'}>W</text>

                      {/* Moving needle indicating Facing direction dynamically */}
                      <g transform={`rotate(${
                        form.facing === 'East' ? 90 : form.facing === 'West' ? 270 : form.facing === 'North' ? 0 : 180
                      } 75 75)`}>
                        {/* Needle points Up (North position of rotated group) */}
                        <polygon points="75,32 79,75 71,75" fill="#F4C542" />
                        <polygon points="75,118 79,75 71,75" fill="#0B1F3A" />
                        <circle cx="75" cy="75" r="4.5" fill="#F6F7F9" stroke="#F4C542" strokeWidth="2" />
                      </g>
                    </svg>
                    <span className="text-[10px] font-bold text-navy/40 tracking-widest uppercase mt-4">
                      Grid Alignment
                    </span>
                  </div>

                </div>

                {/* Regenerate compliant plan Vastu Action */}
                {!vastuReport.compliant_extra && (
                  <div className="border-t border-navy/10 pt-6 select-none">
                    <button
                      type="button"
                      onClick={handleRegenerateVastu}
                      className="w-full py-4 bg-gold hover:bg-gold/90 rounded text-navy font-bold text-xs tracking-widest flex items-center justify-center gap-2 transition-all duration-300 uppercase shadow-soft"
                    >
                      Generate Vastu-compliant layout →
                    </button>
                  </div>
                )}

              </section>
            )}

          </main>

        </div>
      </div>
    </div>
  )
}
