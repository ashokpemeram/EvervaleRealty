import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MailIcon } from './Icons'

export default function PlotPlanViewer({ venture, isOpen, onClose }) {
  const [selectedPlot, setSelectedPlot] = useState(null)
  const navigate = useNavigate()

  if (!isOpen || !venture) return null

  const handleInquire = (plot) => {
    if (!plot) return
    navigate('/contact', {
      state: {
        ventureName: venture.name,
        plotNumber: plot.number,
        plotPrice: plot.price,
      },
    })
    onClose()
  }

  // Get status color coding based on user reference image
  const getStatusOutline = (status, isSelected) => {
    if (isSelected) return 'stroke-[#F4C542] stroke-[3.5px] filter drop-shadow-[0_0_4px_rgba(244,197,66,0.5)]'
    switch (status) {
      case 'available':
        return 'stroke-[#00B289] stroke-[2px]'
      case 'reserved':
        return 'stroke-[#D97706] stroke-[2px]'
      case 'sold':
        return 'stroke-[#4B5563] stroke-[2px]'
      default:
        return 'stroke-gray-600 stroke-[2px]'
    }
  }

  const getStatusFill = (status) => {
    switch (status) {
      case 'available':
        return 'fill-[#0E2F30]'
      case 'reserved':
        return 'fill-[#2B231D]'
      case 'sold':
        return 'fill-[#1C2330]'
      default:
        return 'fill-[#131F32]'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="rounded-full bg-[#00B289]/10 px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#00B289] uppercase">
            Available
          </span>
        )
      case 'reserved':
        return (
          <span className="rounded-full bg-[#D97706]/10 px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#D97706] uppercase">
            Reserved
          </span>
        )
      case 'sold':
        return (
          <span className="rounded-full bg-red-500/10 px-3.5 py-1 text-[10px] font-bold tracking-widest text-red-500 uppercase">
            Sold
          </span>
        )
      default:
        return null
    }
  }

  const getLabelColor = (status) => {
    switch (status) {
      case 'available':
        return 'fill-[#00B289]'
      case 'reserved':
        return 'fill-[#D97706]'
      case 'sold':
        return 'fill-[#4B5563]'
      default:
        return 'fill-gray-400'
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Outer Modal Box matching slate layout theme */}
      <div className="relative w-full max-w-5xl overflow-hidden bg-[#0B1A30] rounded-4xl border border-[#173054] shadow-soft max-h-[92vh] flex flex-col md:flex-row select-none">
        
        {/* Left Section: Interactive SVG Layout Map */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between min-h-[380px] md:min-h-0">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F4C542]">
                  Interactive Layout Plan
                </span>
                <h2 className="mt-1.5 text-2xl font-semibold text-white">{venture.name}</h2>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  {/* Location Icon */}
                  <svg className="h-3.5 w-3.5 text-[#F4C542]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{venture.location}</span>
                </div>
              </div>
              
              {/* Close Circular Button */}
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-transparent text-gray-400 transition-all duration-300 hover:border-white hover:text-white"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* SVG Map Canvas Area */}
          <div className="relative my-8 bg-[#0D203B]/60 rounded-4xl border border-[#173054] p-6 overflow-hidden flex items-center justify-center">
            <svg
              viewBox="0 0 600 350"
              className="w-full h-auto max-h-[340px]"
            >
              {/* Background Grid Pattern & Hatching for Sold */}
              <defs>
                <pattern id="plan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1D4ED8" strokeWidth="0.75" strokeOpacity="0.08" />
                </pattern>
                <pattern id="sold-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#4B5563" strokeWidth="1.5" strokeOpacity="0.25" />
                </pattern>
              </defs>
              <rect width="600" height="350" fill="url(#plan-grid)" />

              {/* Dotted Grid lines inside plan area */}
              <line x1="50" y1="50" x2="550" y2="50" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 6" strokeOpacity="0.1" />
              <line x1="50" y1="300" x2="550" y2="300" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 6" strokeOpacity="0.1" />

              {/* Left Forest Buffer Overlay */}
              <rect x="25" y="60" width="30" height="225" fill="#0C1B2E" stroke="#1D4ED8" strokeWidth="0.5" strokeOpacity="0.15" rx="4" />
              <g transform="rotate(-90 40 172)">
                <text
                  x="40"
                  y="172"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-bold tracking-[0.4em] fill-[#1E3A8A] opacity-60"
                >
                  FOREST BUFFER ZONE
                </text>
              </g>

              {/* Access Trail / Road layout exactly matching the picture */}
              <g>
                <rect x="65" y="160" width="480" height="24" rx="12" fill="#13233A" stroke="#1D4ED8" strokeWidth="1" strokeOpacity="0.1" />
                <line x1="75" y1="172" x2="535" y2="172" stroke="#F4C542" strokeWidth="1.25" strokeDasharray="6 8" strokeOpacity="0.35" />
                <text x="290" y="175" className="text-[9px] font-bold tracking-[0.35em] fill-[#F4C542]/40" textAnchor="middle">
                  OAKRIDGE TRAIL DRIVE
                </text>
              </g>

              {/* Compass on top right */}
              <g transform="translate(525, 95)">
                <circle r="16" fill="none" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.25"/>
                <line x1="0" y1="-16" x2="0" y2="16" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.3"/>
                <line x1="-16" y1="0" x2="16" y2="0" stroke="#F4C542" strokeWidth="1" strokeOpacity="0.15"/>
                <path d="M 0 -13 L 3.5 0 L 0 3.5 L -3.5 0 Z" fill="#F4C542" opacity="0.6"/>
                <text x="0" y="-19" textAnchor="middle" fontSize="8" fill="#F4C542" fontWeight="bold" opacity="0.8">N</text>
              </g>

              {/* Legend overlay top-left inside plan canvas */}
              <g transform="translate(45, 80)">
                <circle cx="0" cy="0" r="3.5" fill="#00B289" />
                <text x="12" y="3.5" className="text-[9px] font-bold tracking-widest fill-gray-400">Available</text>

                <circle cx="0" cy="18" r="3.5" fill="#D97706" />
                <text x="12" y="21.5" className="text-[9px] font-bold tracking-widest fill-gray-400">Reserved</text>

                <circle cx="0" cy="36" r="3.5" fill="#4B5563" />
                <text x="12" y="39.5" className="text-[9px] font-bold tracking-widest fill-gray-400">Sold</text>
              </g>

              {/* Plot Rectangles Grid Render */}
              {venture.plots?.map((plot) => {
                const isSelected = selectedPlot?.id === plot.id
                return (
                  <g
                    key={plot.id}
                    onClick={() => setSelectedPlot(plot)}
                    className="cursor-pointer"
                  >
                    {/* Base Filled Rectangle */}
                    <rect
                      x={plot.x}
                      y={plot.y}
                      width={plot.width}
                      height={plot.height}
                      rx={10}
                      ry={10}
                      className={`transition-all duration-300 ease-out ${getStatusFill(plot.status)} ${getStatusOutline(plot.status, isSelected)}`}
                    />
                    
                    {/* Diagonal stripes pattern overlay for sold plots */}
                    {plot.status === 'sold' && (
                      <rect
                        x={plot.x}
                        y={plot.y}
                        width={plot.width}
                        height={plot.height}
                        rx={10}
                        ry={10}
                        fill="url(#sold-hatch)"
                        pointerEvents="none"
                      />
                    )}
                    
                    {/* Title Text (e.g. Plot 1) */}
                    <text
                      x={plot.x + plot.width / 2}
                      y={plot.y + plot.height / 2 - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-bold fill-white tracking-wider"
                    >
                      {plot.number}
                    </text>
                    
                    {/* Dimensions Label (e.g. 80' x 120') */}
                    <text
                      x={plot.x + plot.width / 2}
                      y={plot.y + plot.height / 2 + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[8px] tracking-wide font-medium ${getLabelColor(plot.status)}`}
                    >
                      {plot.dimensions}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Right Section: Details Panel (Exactly matching user reference layout) */}
        <div className="w-full md:w-[360px] bg-[#071120] p-6 md:p-10 flex flex-col justify-between">
          {selectedPlot ? (
            // State 2: Plot Selected View
            <div className="flex flex-col h-full justify-between gap-6 animate-fade-in">
              <div className="space-y-5">
                {/* Availability Badge */}
                <div>
                  {getStatusBadge(selectedPlot.status)}
                </div>

                {/* Plot Title & Pricing */}
                <div className="space-y-1">
                  <h3 className="text-3xl font-semibold text-white tracking-wide">{selectedPlot.number}</h3>
                  <p className="text-2xl font-bold text-[#F4C542]">{selectedPlot.price}</p>
                </div>

                {/* Plot Meta Data Card Container */}
                <div className="bg-[#111E30] border border-[#1E2E44] rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3.5 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold tracking-wider">Dimensions</span>
                    <span className="text-white font-bold">{selectedPlot.dimensions}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-3.5 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold tracking-wider">Total Area</span>
                    <span className="text-white font-bold">{selectedPlot.area}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-3.5 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold tracking-wider">Zoning</span>
                    <span className="text-white font-bold">{selectedPlot.zoning || 'Residential Land'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-semibold tracking-wider">Verification</span>
                    <span className="text-[#00B289] font-bold flex items-center gap-1">
                      {/* Checkmark Icon */}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {selectedPlot.verification || 'Approved'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button pre-fills contact details */}
              <div>
                {selectedPlot.status !== 'sold' ? (
                  <button
                    onClick={() => handleInquire(selectedPlot)}
                    className="w-full py-4 bg-[#F4C542] hover:bg-[#d9ae36] rounded-full text-[#071120] font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 uppercase"
                  >
                    <MailIcon className="h-5 w-5 shrink-0" />
                    Request Briefing
                  </button>
                ) : (
                  <div className="w-full py-4 bg-gray-800 cursor-not-allowed rounded-full text-gray-500 font-bold text-xs tracking-widest flex items-center justify-center gap-2 uppercase">
                    Sold Out
                  </div>
                )}
              </div>
            </div>
          ) : (
            // State 1: Default Empty View (matching user reference mockup exactly)
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="text-gray-500 mb-6 shrink-0">
                {/* Finger Click pointer icon */}
                <svg className="h-10 w-10 text-gray-600 animate-pulse mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303-.053-1.593 1.593M21.75 12h-2.25M17.303 19.303l-1.593-1.593M4.5 12H2.25M6.697 4.447l1.593 1.593M3.303 19.303l1.593-1.593" />
                </svg>
              </div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-gray-400 leading-relaxed max-w-[240px] uppercase">
                Select a plot from the layout plan to view detailed dimensions, availability, and pricing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
