import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Visualizer from './pages/Visualizer'
import Admin from './pages/Admin'
import Projects from './pages/Projects'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Seed default properties database
    if (!localStorage.getItem('evervale_properties')) {
      const defaultProperties = [
        {
          name: 'Evervale Oakridge Estates',
          location: 'Austin Hills, TX',
          price: 'From $450K',
          tag: 'VENTURE PLOTS',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          details: { totalPlots: 8, area: "80' x 120' - 120' x 160'" },
          plots: [
            {
              id: 'oak-plot-1',
              number: 'Plot 1',
              dimensions: "80' x 120'",
              area: '9,600 sq ft',
              price: '$450K',
              status: 'available',
              x: 100,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-2',
              number: 'Plot 2',
              dimensions: "80' x 120'",
              area: '9,600 sq ft',
              price: '$465K',
              status: 'available',
              x: 190,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-3',
              number: 'Plot 3',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$510K',
              status: 'reserved',
              x: 280,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-4',
              number: 'Plot 4',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$495K',
              status: 'available',
              x: 370,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-5',
              number: 'Plot 5',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$580K',
              status: 'sold',
              x: 100,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-6',
              number: 'Plot 6',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$610K',
              status: 'available',
              x: 190,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-7',
              number: 'Plot 7',
              dimensions: "110' x 150'",
              area: '16,500 sq ft',
              price: '$680K',
              status: 'reserved',
              x: 280,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-8',
              number: 'Plot 8',
              dimensions: "120' x 160'",
              area: '19,200 sq ft',
              price: '$750K',
              status: 'sold',
              x: 370,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            }
          ]
        },
        {
          name: 'Evervale Lakeside Estates',
          location: 'Lake Tahoe, NV',
          price: 'From $590K',
          tag: 'VENTURE PLOTS',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
          details: { totalPlots: 8, area: "90' x 130' - 130' x 180'" },
          plots: [
            {
              id: 'lake-plot-1',
              number: 'Plot 1',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$590K',
              status: 'available',
              x: 100,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-2',
              number: 'Plot 2',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$610K',
              status: 'available',
              x: 190,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-3',
              number: 'Plot 3',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$650K',
              status: 'reserved',
              x: 280,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-4',
              number: 'Plot 4',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$630K',
              status: 'available',
              x: 370,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-5',
              number: 'Plot 5',
              dimensions: "110' x 150'",
              area: '16,500 sq ft',
              price: '$720K',
              status: 'sold',
              x: 100,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-6',
              number: 'Plot 6',
              dimensions: "110' x 150'",
              area: '16,500 sq ft',
              price: '$740K',
              status: 'available',
              x: 190,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-7',
              number: 'Plot 7',
              dimensions: "120' x 160'",
              area: '19,200 sq ft',
              price: '$810K',
              status: 'reserved',
              x: 280,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-8',
              number: 'Plot 8',
              dimensions: "130' x 180'",
              area: '23,400 sq ft',
              price: '$890K',
              status: 'sold',
              x: 370,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            }
          ]
        },
        {
          name: 'Summit Glasshouse',
          location: 'Aspen, CO',
          price: '$12.2M',
          tag: 'NEW ACQUISITION',
          image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
          details: { beds: 6, baths: 7, area: '8,750 sq ft' }
        },
        {
          name: 'Regent Crescent',
          location: 'Tribeca, NY',
          price: '$8.1M',
          tag: 'NEW ACQUISITION',
          image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
          details: { beds: 3, baths: 4, area: '4,200 sq ft' }
        }
      ]
      localStorage.setItem('evervale_properties', JSON.stringify(defaultProperties))
    }

    // Seed default contact info
    if (!localStorage.getItem('evervale_contact')) {
      const defaultContact = {
        address: '428 Penthouse Plaza, Art District, NY 10012',
        phone: '+1 (212) 555-0198',
        email: 'concierge@evervale.com'
      }
      localStorage.setItem('evervale_contact', JSON.stringify(defaultContact))
    }

    // Seed default inquiries/CRM leads
    if (!localStorage.getItem('evervale_inquiries')) {
      const defaultInquiries = [
        {
          id: 'lead-1',
          name: 'Celia Monroe',
          email: 'celia@monroecapital.com',
          phone: '+1 (310) 555-9081',
          contact: 'Private Briefing',
          message: 'I am interested in acquiring Plot 2 at Evervale Oakridge Estates (listed at $465K). Please coordinate a private briefing with my office.'
        },
        {
          id: 'lead-2',
          name: 'Dylan Park',
          email: 'dylan@parkfamilyoffice.com',
          phone: '+1 (212) 555-0012',
          contact: 'Phone',
          message: 'Interested in private off-market listings matching the Contemporary Aspen series.'
        }
      ]
      localStorage.setItem('evervale_inquiries', JSON.stringify(defaultInquiries))
    }
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
