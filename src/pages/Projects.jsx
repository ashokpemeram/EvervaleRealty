import { useState, useEffect } from 'react'
import PropertyCard from '../components/PropertyCard'
import PlotPlanViewer from '../components/PlotPlanViewer'
import useScrollReveal from '../hooks/useScrollReveal'
import { api } from '../services/api'

export default function Projects() {
  const [properties, setProperties] = useState([])

  const [activeFilter, setActiveFilter] = useState('all')
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedVenture, setSelectedVenture] = useState(null)

  useScrollReveal([properties, activeFilter])

  useEffect(() => {
    let active = true
    const fetchProperties = async () => {
      try {
        const data = await api.getProperties()
        if (active) setProperties(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProperties()
    return () => {
      active = false
    }
  }, [])

  const handleViewPlots = (venture) => {
    setSelectedVenture(venture)
    setIsViewerOpen(true)
  }

  // Filter listings based on category selection
  const filteredProperties = Array.isArray(properties)
    ? properties.filter((property) => {
        const isVenture = property.tag === 'VENTURE PLOTS' || (Array.isArray(property.plots) && property.plots.length > 0)
        if (activeFilter === 'residences') return !isVenture
        if (activeFilter === 'ventures') return isVenture
        return true // 'all'
      })
    : []

  return (
    <div className="bg-ivory min-h-screen pt-28 pb-20 select-none font-sans">
      <section className="mx-auto max-w-6xl px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="reveal mb-10 text-center md:text-left animate-fade-in" data-animate>
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Global Portfolio
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-navy tracking-wide">
            Our Architectural Projects
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-navy/60 leading-relaxed">
            Browse our curated collection of verified off-market estates and premium land development masterplans engineered for generational wealth preservation.
          </p>
        </div>

        {/* Categories Filtering Bar */}
        <div className="reveal flex flex-wrap gap-2.5 mb-12 select-none" data-animate>
          {[
            { id: 'all', label: 'All Portfolio' },
            { id: 'residences', label: 'Luxury Residences' },
            { id: 'ventures', label: 'Land Masterplans' }
          ].map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-gold text-navy hover:shadow-card'
                    : 'bg-white border border-navy/10 text-navy/70 hover:border-navy/30 hover:text-navy shadow-soft'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        {/* Listings Grid */}
        {Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
            {filteredProperties.map((property, index) => (
              <div key={property.name} className="reveal" data-animate>
                <PropertyCard
                  {...property}
                  delay={index * 100}
                  onViewPlots={() => handleViewPlots(property)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-navy/20 p-16 text-center rounded-4xl max-w-md mx-auto">
            <svg className="h-12 w-12 text-navy/20 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21h8.25M12 3v18M5.25 8.25h13.5M5.25 15.75h13.5" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-widest text-navy/60">No Active Projects</p>
            <p className="text-[10px] text-navy/40 mt-1 max-w-xs mx-auto">Selected operational bracket is empty. Try adding elements in the administrative operations portal.</p>
          </div>
        )}

      </section>

      {/* SVG Masterplan Floorplan Viewer Modal */}
      {selectedVenture && (
        <PlotPlanViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          venture={selectedVenture}
        />
      )}
    </div>
  )
}
