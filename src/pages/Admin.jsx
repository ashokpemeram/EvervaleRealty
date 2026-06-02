import { useState } from 'react'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')
  const [properties, setProperties] = useState(() => {
    const cached = localStorage.getItem('evervale_properties')
    return cached ? JSON.parse(cached) : []
  })
  const [contact, setContact] = useState(() => {
    const cached = localStorage.getItem('evervale_contact')
    return cached ? JSON.parse(cached) : { address: '', phone: '', email: '' }
  })
  const [inquiries, setInquiries] = useState(() => {
    const cached = localStorage.getItem('evervale_inquiries')
    return cached ? JSON.parse(cached) : []
  })
  const [contactSuccess, setContactSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('evervale_admin_auth') === 'true'
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Modal / Form state for Add/Edit Listing
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    tag: 'NEW ACQUISITION',
    image: '',
    isVenture: false,
    beds: '',
    baths: '',
    area: '',
    totalPlots: ''
  })

  // Sync Listings changes
  const saveProperties = (updated) => {
    setProperties(updated)
    localStorage.setItem('evervale_properties', JSON.stringify(updated))
  }

  // Sync inquiries CRM
  const saveInquiries = (updated) => {
    setInquiries(updated)
    localStorage.setItem('evervale_inquiries', JSON.stringify(updated))
  }

  // Delete listing
  const handleDeleteProperty = (index) => {
    const updated = properties.filter((_, idx) => idx !== index)
    saveProperties(updated)
  }

  // Add / Edit submission
  const handleSubmitProperty = (e) => {
    e.preventDefault()

    const details = formData.isVenture
      ? { totalPlots: Number(formData.totalPlots) || 8, area: formData.area || "80' x 120' - 120' x 160'" }
      : { beds: Number(formData.beds) || 3, baths: Number(formData.baths) || 3, area: formData.area || '4,500 sq ft' }

    // If it's a new land venture, pre-generate standard 8 plots layout so it works perfectly in interactive modal
    let plots = undefined
    if (formData.isVenture) {
      plots = [
        { id: 'custom-plot-1', number: 'Plot 1', dimensions: "80' x 120'", area: '9,600 sq ft', price: '$420K', status: 'available', x: 100, y: 80, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-2', number: 'Plot 2', dimensions: "80' x 120'", area: '9,600 sq ft', price: '$440K', status: 'available', x: 190, y: 80, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-3', number: 'Plot 3', dimensions: "90' x 130'", area: '11,700 sq ft', price: '$480K', status: 'reserved', x: 280, y: 80, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-4', number: 'Plot 4', dimensions: "90' x 130'", area: '11,700 sq ft', price: '$460K', status: 'available', x: 370, y: 80, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-5', number: 'Plot 5', dimensions: "100' x 140'", area: '14,000 sq ft', price: '$520K', status: 'sold', x: 100, y: 200, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-6', number: 'Plot 6', dimensions: "100' x 140'", area: '14,000 sq ft', price: '$550K', status: 'available', x: 190, y: 200, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-7', number: 'Plot 7', dimensions: "110' x 150'", area: '16,500 sq ft', price: '$610K', status: 'reserved', x: 280, y: 200, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' },
        { id: 'custom-plot-8', number: 'Plot 8', dimensions: "120' x 160'", area: '19,200 sq ft', price: '$690K', status: 'sold', x: 370, y: 200, width: 80, height: 60, zoning: 'Residential Land', verification: 'Approved' }
      ]
    }

    const newProperty = {
      name: formData.name,
      location: formData.location,
      price: formData.price,
      tag: formData.tag,
      image: formData.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      details,
      ...(plots ? { plots } : {})
    }

    if (editingItem !== null) {
      // Edit mode
      const updated = [...properties]
      updated[editingItem] = {
        ...updated[editingItem],
        ...newProperty
      }
      saveProperties(updated)
    } else {
      // Add mode
      saveProperties([...properties, newProperty])
    }

    setIsFormOpen(false)
    setEditingItem(null)
    setFormData({
      name: '',
      location: '',
      price: '',
      tag: 'NEW ACQUISITION',
      image: '',
      isVenture: false,
      beds: '',
      baths: '',
      area: '',
      totalPlots: ''
    })
  }

  // Trigger Edit
  const handleStartEdit = (index) => {
    const item = properties[index]
    setEditingItem(index)
    setFormData({
      name: item.name,
      location: item.location,
      price: item.price,
      tag: item.tag,
      image: item.image,
      isVenture: !!item.plots,
      beds: item.details.beds || '',
      baths: item.details.baths || '',
      area: item.details.area,
      totalPlots: item.details.totalPlots || ''
    })
    setIsFormOpen(true)
  }

  // Handle Global Contact details save
  const handleSaveContact = (e) => {
    e.preventDefault()
    localStorage.setItem('evervale_contact', JSON.stringify(contact))
    setContactSuccess(true)
    setTimeout(() => setContactSuccess(false), 4000)
  }

  // Delete lead CRM
  const handleDeleteInquiry = (id) => {
    const updated = inquiries.filter((lead) => lead.id !== id)
    saveInquiries(updated)
  }

  // Admin login handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'evervale2026') {
      setIsAuthenticated(true)
      sessionStorage.setItem('evervale_admin_auth', 'true')
      setLoginError('')
    } else {
      setLoginError('Invalid administrative credentials.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('evervale_admin_auth')
    setUsername('')
    setPassword('')
  }

  // Calculate high-end dashboard valuations factually
  const totalValuation = properties.reduce((acc, curr) => {
    // Basic parser for valuations (e.g. $12.2M -> 12.2 or $450K -> 0.45)
    let valStr = curr.price.replace('$', '').replace('From ', '').replace('From', '')
    let multiplier = 1
    if (valStr.includes('M')) {
      multiplier = 1000000
      valStr = valStr.replace('M', '')
    } else if (valStr.includes('K')) {
      multiplier = 1000
      valStr = valStr.replace('K', '')
    }
    const parsed = parseFloat(valStr) || 0
    return acc + parsed * multiplier
  }, 0)

  const formatCurrency = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val}`
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center px-6 select-none pt-20">
        <div className="w-full max-w-md bg-[#0F1A3A] border border-white/10 rounded-4xl p-8 md:p-10 shadow-soft">
          <div className="text-center mb-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#F4C542]">
              Secure Terminal Access
            </span>
            <h2 className="mt-3 text-3xl font-serif text-white tracking-wide">
              Firm Operations
            </h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Enter authorized credentials to decrypt control systems.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-2.5 animate-fade-in mb-6">
              <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Username</label>
              <input
                type="text"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#F4C542] hover:bg-[#d9ae36] rounded-full text-[#071120] font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-soft mt-2"
            >
              Unlock Console →
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white pt-28 pb-16 px-6 lg:px-12 select-none">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#F4C542]">
              Administrative Operations
            </span>
            <h1 className="mt-2 text-4xl font-serif text-white tracking-wide">
              Firm Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-1">Manage global listings, leads, and operational coordinates</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingItem(null)
                setIsFormOpen(true)
              }}
              className="rounded-full bg-[#F4C542] px-6 py-2.5 text-xs font-bold tracking-widest text-[#071120] hover:shadow-card uppercase transition-all duration-300"
            >
              Add New Asset
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 hover:border-white/50 px-6 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Tabs bar */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'properties', label: 'Properties & Ventures' },
            { id: 'contact', label: 'Contact Settings' },
            { id: 'leads', label: 'Briefing Leads' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4.5 border-b-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#F4C542] text-[#F4C542]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards Grid */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="bg-[#0F1A3A] border border-white/10 p-6 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">AUM / Total Valuation</p>
                <p className="text-2xl font-serif font-bold text-[#F4C542] mt-1.5">{formatCurrency(totalValuation)}</p>
                <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">Dynamic Valuation Aggregate</p>
              </div>
              <div className="bg-[#0F1A3A] border border-white/10 p-6 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Active Assets</p>
                <p className="text-2xl font-serif font-bold text-white mt-1.5">{properties.length}</p>
                <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">Buildings and Ventures</p>
              </div>
              <div className="bg-[#0F1A3A] border border-white/10 p-6 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Venture Land Plots</p>
                <p className="text-2xl font-serif font-bold text-white mt-1.5">
                  {properties.filter(p => !!p.plots).length}
                </p>
                <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">Masterplan Subdivisions</p>
              </div>
              <div className="bg-[#0F1A3A] border border-white/10 p-6 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Incoming Briefing Leads</p>
                <p className="text-2xl font-serif font-bold text-[#00B289] mt-1.5">{inquiries.length}</p>
                <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">CRM Submissions</p>
              </div>
            </div>

            {/* Quick Overview Welcome */}
            <div className="bg-[#0F1A3A] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <h3 className="text-xl font-serif text-white font-semibold">Welcome to the Private Office Terminal</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  This console provides complete operational governance. From this terminal, you can instantly add Standard Acquisitions or complex Land Ventures (which generates the custom interactive SVG plot maps automatically), alter site-wide contact info, or track CRM briefing files.
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-[#F4C542]/10 border border-[#F4C542]/30 text-[#F4C542]">
                {/* Shield Key logo */}
                <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div className="space-y-6 animate-fade-in">
            {/* Table of listings */}
            <div className="overflow-x-auto bg-[#0F1A3A] border border-white/10 rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] tracking-widest uppercase text-gray-400 font-bold">
                    <th className="p-5">Asset</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Pricing</th>
                    <th className="p-5">Tag / Type</th>
                    <th className="p-5">Configuration</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((item, index) => (
                    <tr key={`${item.name}-${index}`} className="border-b border-white/5 text-xs hover:bg-white/5 transition-colors duration-300">
                      <td className="p-5 font-semibold flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="h-10 w-14 object-cover rounded-lg shrink-0" />
                        <span className="text-white text-sm font-semibold">{item.name}</span>
                      </td>
                      <td className="p-5 text-gray-300">{item.location}</td>
                      <td className="p-5 font-bold text-[#F4C542]">{item.price}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                          item.plots ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gold/10 text-gold'
                        }`}>
                          {item.tag}
                        </span>
                      </td>
                      <td className="p-5 text-gray-400">
                        {item.plots
                          ? `${item.details.totalPlots} Land Plots`
                          : `${item.details.beds}B / ${item.details.baths}B (${item.details.area})`}
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleStartEdit(index)}
                          className="px-3.5 py-1.5 border border-white/20 text-white font-semibold rounded-lg hover:border-white transition-all duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(index)}
                          className="px-3.5 py-1.5 border border-red-500/30 text-red-400 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="bg-[#0F1A3A] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl animate-fade-in">
            <h3 className="text-lg font-serif text-white font-semibold mb-6">Global Contact Settings</h3>
            <form onSubmit={handleSaveContact} className="space-y-5">
              {contactSuccess && (
                <div className="bg-teal-500/10 border border-teal-500/30 text-teal-400 p-4 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-2.5 animate-fade-in mb-2">
                  <svg className="h-4 w-4 shrink-0 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Global contact coordinates updated and synchronized successfully.
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Office Headquarters</label>
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Concierge Phone Number</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Concierge Email Address</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-[#F4C542] hover:bg-[#d9ae36] px-8 py-3.5 text-xs font-bold tracking-widest text-[#071120] uppercase transition-all duration-300"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. CRM LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
            {inquiries.length > 0 ? (
              <div className="overflow-x-auto bg-[#0F1A3A] border border-white/10 rounded-2xl">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] tracking-widest uppercase text-gray-400 font-bold">
                      <th className="p-5">Date/Lead ID</th>
                      <th className="p-5">Client Name</th>
                      <th className="p-5">Coordinates</th>
                      <th className="p-5">Preference</th>
                      <th className="p-5">Inquiry Message</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((lead, idx) => (
                      <tr key={lead.id || idx} className="border-b border-white/5 text-xs hover:bg-white/5 transition-colors duration-300">
                        <td className="p-5 text-gray-400 font-mono font-medium">#{lead.id?.slice(0, 8) || `000${idx + 1}`}</td>
                        <td className="p-5 text-white font-semibold text-sm">{lead.name}</td>
                        <td className="p-5 space-y-1">
                          <p className="text-gray-300">{lead.email}</p>
                          <p className="text-gray-500 font-mono text-[11px]">{lead.phone}</p>
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase bg-teal-500/10 text-teal-400 tracking-wider">
                            {lead.contact}
                          </span>
                        </td>
                        <td className="p-5 text-gray-300 max-w-[320px] leading-relaxed break-words">{lead.message}</td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(lead.id)}
                            className="px-3.5 py-1.5 border border-red-500/30 text-red-400 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                          >
                            Dismiss
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-dashed border-white/20 p-12 text-center rounded-2xl max-w-lg mx-auto">
                <svg className="h-10 w-10 text-gray-600 animate-pulse mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Briefing Vault is Empty</p>
                <p className="text-[10px] text-gray-500 mt-1 max-w-xs mx-auto">Submitted client inquiries from floorplan visualizers and briefings will be indexed here.</p>
              </div>
            )}
          </div>
        )}

        {/* COMPREHENSIVE ADD/EDIT ASSET DIALOG MODAL */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[#0F1A3A] border border-white/10 rounded-3xl p-6 md:p-8 max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-transparent text-gray-400 transition-all duration-300 hover:border-white hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-2xl font-serif text-white font-semibold mb-6">
                {editingItem !== null ? 'Modify Asset Specifications' : 'Commission New Real Estate Asset'}
              </h3>

              <form onSubmit={handleSubmitProperty} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Asset Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Nocturne Ridge Estate"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Geographic Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bel Air, Los Angeles"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Listing Price</label>
                    <input
                      type="text"
                      placeholder="e.g. $9.8M or From $450K"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tagging Category</label>
                    <select
                      value={formData.tag}
                      onChange={(e) => {
                        const nextTag = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          tag: nextTag,
                          isVenture: nextTag === 'VENTURE PLOTS'
                        }))
                      }}
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                    >
                      <option>NEW ACQUISITION</option>
                      <option>VENTURE PLOTS</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Image Presentation URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                  />
                </div>

                {/* CONDITIONALLY RENDER STANDARD VS VENTURE PLOTS DATA LAYOUT FIELDS */}
                {formData.isVenture ? (
                  <div className="grid gap-5 md:grid-cols-2 p-5 bg-[#0A0F1E] rounded-2xl border border-white/5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-[#F4C542] font-bold">Total Plot Subdivisions</label>
                      <input
                        type="number"
                        placeholder="e.g. 8"
                        value={formData.totalPlots}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalPlots: e.target.value }))}
                        className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-[#F4C542] font-bold">Plot Sizing Ranges</label>
                      <input
                        type="text"
                        placeholder="e.g. 80' x 120' - 120' x 160'"
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                        required
                      />
                    </div>
                    <div className="col-span-2 text-[10px] text-gray-500 leading-relaxed italic">
                      Note: Setting the tag to "VENTURE PLOTS" automatically enables the high-fidelity interactive vector masterplan map and grid layout model with this asset.
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-3 p-5 bg-[#0A0F1E] rounded-2xl border border-white/5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Bedrooms Count</label>
                      <input
                        type="number"
                        placeholder="5"
                        value={formData.beds}
                        onChange={(e) => setFormData(prev => ({ ...prev, beds: e.target.value }))}
                        className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Bathrooms Count</label>
                      <input
                        type="number"
                        placeholder="6"
                        value={formData.baths}
                        onChange={(e) => setFormData(prev => ({ ...prev, baths: e.target.value }))}
                        className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Area (sq ft)</label>
                      <input
                        type="text"
                        placeholder="7,900 sq ft"
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#F4C542] hover:bg-[#d9ae36] rounded-full text-[#071120] font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-soft"
                  >
                    Save Specifications
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-4 border border-white/20 hover:border-white/50 rounded-full text-white font-bold text-xs tracking-widest uppercase transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
