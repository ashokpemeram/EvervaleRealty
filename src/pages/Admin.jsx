import { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')
  const [properties, setProperties] = useState([])
  const [contact, setContact] = useState({
    address: '',
    phone: '',
    email: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: ''
  })
  const [inquiries, setInquiries] = useState([])
  const [contactSuccess, setContactSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => api.isAuthenticated())
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
    images: [],
    videos: [],
    brochureUrl: '',
    layoutImage: '',
    isVenture: false,
    beds: '',
    baths: '',
    area: '',
    totalPlots: '',
    plots: [],
    defaultPrice: '$450K',
    defaultDimensions: "80' x 120'",
    defaultArea: '9,600 sq ft',
    showOnHome: false
  })

  const [uploadingField, setUploadingField] = useState({
    cover: false,
    images: false,
    videos: false,
    layout: false,
    brochure: false
  })

  const handleUploadClick = async (e, fieldKey, isMultiple = false) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingField(prev => ({ ...prev, [fieldKey]: true }))
    try {
      if (isMultiple) {
        const data = await api.uploadMultipleFiles(files)
        if (data && Array.isArray(data.urls)) {
          setFormData(prev => ({
            ...prev,
            [fieldKey]: [...(prev[fieldKey] || []), ...data.urls]
          }))
        }
      } else {
        const file = files[0]
        const data = await api.uploadFile(file)
        if (data && data.url) {
          setFormData(prev => ({
            ...prev,
            [fieldKey === 'cover' ? 'image' : fieldKey === 'layout' ? 'layoutImage' : 'brochureUrl']: data.url
          }))
        }
      }
    } catch (err) {
      console.error(`Upload error for ${fieldKey}:`, err)
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploadingField(prev => ({ ...prev, [fieldKey]: false }))
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    let active = true
    const fetchAdminData = async () => {
      try {
        const [props, settings, leads] = await Promise.all([
          api.getProperties(),
          api.getContactSettings(),
          api.getInquiries()
        ])
        if (active) {
          setProperties(props)
          setContact({
            address: settings?.address || '',
            phone: settings?.phone || '',
            email: settings?.email || '',
            linkedin: settings?.linkedin || '',
            instagram: settings?.instagram || '',
            twitter: settings?.twitter || '',
            facebook: settings?.facebook || ''
          })
          setInquiries(leads)
        }
      } catch (error) {
        console.error('Error fetching admin data:', error)
      }
    }
    fetchAdminData()
    return () => {
      active = false
    }
  }, [isAuthenticated])

  // Delete listing
  const handleDeleteProperty = async (index) => {
    const targetId = properties[index]._id
    if (!targetId) return

    try {
      await api.deleteProperty(targetId)
      setProperties(prev => prev.filter((_, idx) => idx !== index))
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property listing.')
    }
  }

  const generatePlotsLayout = (count, defaultDim, defaultArea, defaultPrice) => {
    const list = []
    const countNum = parseInt(count) || 8
    
    // Distribute plots in rows:
    // 2 rows for N <= 12, 4 rows for larger counts
    const rows = countNum <= 12 ? 2 : 4
    const gap = countNum > 30 ? 6 : 8
    
    // Track current x-offset for each row starting at x=70 (after forest buffer zone)
    const rowXOffset = Array(rows).fill(70)
    
    const parseDimensions = (dimStr) => {
      if (!dimStr) return { w: 80, h: 120 }
      const parts = dimStr.replace(/'/g, '').split(/[x*-]/)
      if (parts.length >= 2) {
        const w = parseFloat(parts[0]) || 80
        const h = parseFloat(parts[1]) || 120
        return { w, h }
      }
      return { w: 80, h: 120 }
    }
    
    for (let i = 0; i < countNum; i++) {
      const rowIdx = i % rows
      const x = rowXOffset[rowIdx]
      
      const plotDim = defaultDim || "80' x 120'"
      const { w, h } = parseDimensions(plotDim)
      
      // Proportional visible sizes (min width 50, max 110, scale 0.75)
      // (min height 35, max 85, scale 0.35)
      const plotWidth = Math.round(Math.max(50, Math.min(110, w * 0.75)))
      const plotHeight = Math.round(Math.max(35, Math.min(85, h * 0.35)))
      
      // Calculate row-specific y position
      let y = 80
      if (rows === 2) {
        y = rowIdx === 0 ? 140 - plotHeight : 205
      } else {
        if (rowIdx === 0) y = 85 - plotHeight
        else if (rowIdx === 1) y = 145 - plotHeight
        else if (rowIdx === 2) y = 200
        else y = 255
      }
      
      list.push({
        id: `plot-${i + 1}`,
        number: `Plot ${i + 1}`,
        dimensions: plotDim,
        area: defaultArea || "9,600 sq ft",
        price: defaultPrice || "$450K",
        status: 'available',
        x: Math.round(x),
        y: Math.round(y),
        width: plotWidth,
        height: plotHeight,
        zoning: 'Residential Land',
        verification: 'Approved'
      })
      
      // Update offset for this row
      rowXOffset[rowIdx] += plotWidth + gap
    }
    return list
  }

  const recalculatePlotsLayout = (plots, rowsCount) => {
    if (!Array.isArray(plots) || plots.length === 0) return []
    const countNum = plots.length
    const rows = rowsCount || (countNum <= 12 ? 2 : 4)
    const gap = countNum > 30 ? 6 : 8
    
    const rowXOffset = Array(rows).fill(70)
    
    const parseDimensions = (dimStr) => {
      if (!dimStr) return { w: 80, h: 120 }
      const parts = dimStr.replace(/'/g, '').split(/[x*-]/)
      if (parts.length >= 2) {
        const w = parseFloat(parts[0]) || 80
        const h = parseFloat(parts[1]) || 120
        return { w, h }
      }
      return { w: 80, h: 120 }
    }
    
    return plots.map((plot, i) => {
      const rowIdx = i % rows
      const x = rowXOffset[rowIdx]
      const { w, h } = parseDimensions(plot.dimensions)
      
      const plotWidth = Math.round(Math.max(50, Math.min(110, w * 0.75)))
      const plotHeight = Math.round(Math.max(35, Math.min(85, h * 0.35)))
      
      let y = 80
      if (rows === 2) {
        y = rowIdx === 0 ? 140 - plotHeight : 205
      } else {
        if (rowIdx === 0) y = 85 - plotHeight
        else if (rowIdx === 1) y = 145 - plotHeight
        else if (rowIdx === 2) y = 200
        else y = 255
      }
      
      rowXOffset[rowIdx] += plotWidth + gap
      
      return {
        ...plot,
        x: Math.round(x),
        y: Math.round(y),
        width: plotWidth,
        height: plotHeight
      }
    })
  }

  // Add / Edit submission
  const handleSubmitProperty = async (e) => {
    e.preventDefault()

    const details = formData.isVenture
      ? { totalPlots: Number(formData.totalPlots) || 8, area: formData.area || "80' x 120' - 120' x 160'" }
      : { beds: Number(formData.beds) || 3, baths: Number(formData.baths) || 3, area: formData.area || '4,500 sq ft' }

    let plots = undefined
    if (formData.isVenture) {
      plots = formData.plots && formData.plots.length > 0
        ? recalculatePlotsLayout(formData.plots, Number(formData.totalPlots) || formData.plots.length)
        : generatePlotsLayout(Number(formData.totalPlots) || 8, formData.defaultDimensions, formData.defaultArea, formData.defaultPrice)
    }

    const payload = {
      name: formData.name,
      location: formData.location,
      price: formData.price,
      tag: formData.tag,
      image: formData.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      images: Array.isArray(formData.images) ? formData.images : [],
      videos: Array.isArray(formData.videos) ? formData.videos : [],
      brochureUrl: formData.brochureUrl,
      layoutImage: formData.layoutImage,
      details,
      plots,
      showOnHome: formData.showOnHome === true
    }

    try {
      if (editingItem !== null) {
        // Edit mode
        const targetId = properties[editingItem]._id
        const updated = await api.updateProperty(targetId, payload)
        const updatedList = [...properties]
        updatedList[editingItem] = updated
        setProperties(updatedList)
      } else {
        // Add mode
        const created = await api.createProperty(payload)
        setProperties([...properties, created])
      }
      setIsFormOpen(false)
      setEditingItem(null)
      setFormData({
        name: '',
        location: '',
        price: '',
        tag: 'NEW ACQUISITION',
        image: '',
        images: [],
        videos: [],
        brochureUrl: '',
        layoutImage: '',
        isVenture: false,
        beds: '',
        baths: '',
        area: '',
        totalPlots: '',
        plots: [],
        defaultPrice: '$450K',
        defaultDimensions: "80' x 120'",
        defaultArea: '9,600 sq ft',
        showOnHome: false
      })
    } catch (error) {
      console.error('Error submitting property:', error)
      alert(error.message || 'Failed to save property listing.')
    }
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
      images: Array.isArray(item.images) ? item.images : [],
      videos: Array.isArray(item.videos) ? item.videos : [],
      brochureUrl: item.brochureUrl || '',
      layoutImage: item.layoutImage || '',
      isVenture: item.tag === 'VENTURE PLOTS' || (Array.isArray(item.plots) && item.plots.length > 0),
      beds: item.details.beds || '',
      baths: item.details.baths || '',
      area: item.details.area,
      totalPlots: item.details.totalPlots || '',
      plots: Array.isArray(item.plots) ? item.plots : [],
      defaultPrice: item.plots && item.plots[0] ? item.plots[0].price : '$450K',
      defaultDimensions: item.plots && item.plots[0] ? item.plots[0].dimensions : "80' x 120'",
      defaultArea: item.plots && item.plots[0] ? item.plots[0].area : '9,600 sq ft',
      showOnHome: !!item.showOnHome
    })
    setIsFormOpen(true)
  }

  // Handle Global Contact details save
  const handleSaveContact = async (e) => {
    e.preventDefault()
    try {
      await api.updateContactSettings(contact)
      setContactSuccess(true)
      setTimeout(() => setContactSuccess(false), 4000)
    } catch (error) {
      console.error('Error updating contact settings:', error)
      alert('Failed to save contact settings.')
    }
  }

  // Delete lead CRM
  const handleDeleteInquiry = async (id) => {
    try {
      await api.deleteInquiry(id)
      setInquiries(prev => prev.filter((lead) => lead.id !== id))
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      alert('Failed to dismiss inquiry.')
    }
  }

  // Admin login handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.login(username, password)
      setIsAuthenticated(true)
      setLoginError('')
    } catch (error) {
      setLoginError(error.message || 'Invalid administrative credentials.')
    }
  }

  const handleLogout = () => {
    api.logout()
    setIsAuthenticated(false)
    setUsername('')
    setPassword('')
  }

  // Calculate high-end dashboard valuations factually
  const totalValuation = Array.isArray(properties) ? properties.reduce((acc, curr) => {
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
  }, 0) : 0

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
                  {properties.filter(p => p.tag === 'VENTURE PLOTS' || (Array.isArray(p.plots) && p.plots.length > 0)).length}
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
                    <th className="p-5">On Home</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(properties) && properties.map((item, index) => (
                    <tr key={`${item.name}-${index}`} className="border-b border-white/5 text-xs hover:bg-white/5 transition-colors duration-300">
                      <td className="p-5 font-semibold flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="h-10 w-14 object-cover rounded-lg shrink-0" />
                        <span className="text-white text-sm font-semibold">{item.name}</span>
                      </td>
                      <td className="p-5 text-gray-300">{item.location}</td>
                      <td className="p-5 font-bold text-[#F4C542]">{item.price}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                          (item.tag === 'VENTURE PLOTS' || (Array.isArray(item.plots) && item.plots.length > 0)) ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gold/10 text-gold'
                        }`}>
                          {item.tag}
                        </span>
                      </td>
                      <td className="p-5 text-gray-400">
                        {(item.tag === 'VENTURE PLOTS' || (Array.isArray(item.plots) && item.plots.length > 0))
                          ? `${item.details.totalPlots} Land Plots`
                          : `${item.details.beds}B / ${item.details.baths}B (${item.details.area})`}
                      </td>
                      <td className="p-5">
                        <span className={`px-3.5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          item.showOnHome ? 'bg-teal-500/10 text-teal-400' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {item.showOnHome ? 'Yes' : 'No'}
                        </span>
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
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/evervalerealty"
                  value={contact.linkedin || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Instagram Profile URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/evervalerealty"
                  value={contact.instagram || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, instagram: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">X / Twitter URL</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/evervalerealty"
                  value={contact.twitter || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, twitter: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Facebook Page URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/evervalerealty"
                  value={contact.facebook || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, facebook: e.target.value }))}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4C542]"
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
            {Array.isArray(inquiries) && inquiries.length > 0 ? (
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
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block">Cover Image Presentation</label>
                  {formData.image ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={formData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="px-4 py-2 bg-[#F4C542] hover:bg-[#d9ae36] text-[#071120] text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all">
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadClick(e, 'cover')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-[#F4C542] bg-[#0A0F1E] rounded-2xl p-8 cursor-pointer transition-all text-center">
                      {uploadingField.cover ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="h-8 w-8 border-4 border-t-transparent border-[#F4C542] rounded-full animate-spin" />
                          <span className="text-xs text-[#F4C542] font-semibold uppercase tracking-wider">Uploading cover image...</span>
                        </div>
                      ) : (
                        <div className="space-y-2 text-gray-400 hover:text-white">
                          <svg className="mx-auto h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <p className="text-xs font-bold uppercase tracking-wider">Upload Main Presentation Photo</p>
                          <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP (Max 10MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadClick(e, 'cover')}
                        className="hidden"
                        disabled={uploadingField.cover}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block">Additional Gallery Photos</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.isArray(formData.images) && formData.images.map((imgUrl, index) => (
                      <div key={`${imgUrl}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                        <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== index)
                          }))}
                          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-[#F4C542] bg-[#0A0F1E] rounded-xl aspect-square cursor-pointer transition-all text-center">
                      {uploadingField.images ? (
                        <div className="flex flex-col items-center gap-1.5 p-2">
                          <span className="h-6 w-6 border-2 border-t-transparent border-[#F4C542] rounded-full animate-spin" />
                          <span className="text-[9px] text-[#F4C542] font-semibold uppercase tracking-wider">Uploading...</span>
                        </div>
                      ) : (
                        <div className="space-y-1 text-gray-400 p-2 hover:text-white">
                          <span className="text-xl font-light block">+</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider block">Add Photos</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleUploadClick(e, 'images', true)}
                        className="hidden"
                        disabled={uploadingField.images}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block">Video Presentations</label>
                  <div className="space-y-3">
                    {Array.isArray(formData.videos) && formData.videos.map((vidUrl, index) => (
                      <div key={`${vidUrl}-${index}`} className="flex items-center justify-between p-3.5 bg-[#0A0F1E] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3 min-w-0">
                          <svg className="h-5 w-5 text-[#F4C542] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="text-xs text-gray-300 font-medium truncate">
                            {vidUrl.startsWith('/uploads/') 
                              ? vidUrl.substring(vidUrl.lastIndexOf('/') + 1)
                              : vidUrl
                            }
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            videos: prev.videos.filter((_, idx) => idx !== index)
                          }))}
                          className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-[#F4C542] bg-[#0A0F1E] hover:bg-[#0A0F1E]/60 rounded-xl p-3.5 cursor-pointer transition-all text-center">
                      {uploadingField.videos ? (
                        <>
                          <span className="h-4 w-4 border-2 border-t-transparent border-[#F4C542] rounded-full animate-spin" />
                          <span className="text-xs text-[#F4C542] font-semibold uppercase tracking-wider">Uploading video file...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white">Upload Video Presentation</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleUploadClick(e, 'videos', true)}
                        className="hidden"
                        disabled={uploadingField.videos}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block">Layout/Blueprint Floorplan</label>
                    {formData.layoutImage ? (
                      <div className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden border border-white/10 group">
                        <img src={formData.layoutImage} alt="Blueprint Floorplan" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="px-4 py-2 bg-[#F4C542] hover:bg-[#d9ae36] text-[#071120] text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadClick(e, 'layout')}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, layoutImage: '' }))}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-[#F4C542] bg-[#0A0F1E] rounded-2xl p-6 cursor-pointer transition-all text-center h-[120px] justify-center">
                        {uploadingField.layout ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="h-6 w-6 border-2 border-t-transparent border-[#F4C542] rounded-full animate-spin" />
                            <span className="text-[10px] text-[#F4C542] font-semibold uppercase tracking-wider">Uploading blueprint image...</span>
                          </div>
                        ) : (
                          <div className="space-y-1 text-gray-400 hover:text-white">
                            <svg className="mx-auto h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <p className="text-[10px] font-bold uppercase tracking-wider">Upload Floorplan Blueprint Schematic</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadClick(e, 'layout')}
                          className="hidden"
                          disabled={uploadingField.layout}
                        />
                      </label>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block">Marketing Brochure PDF</label>
                    {formData.brochureUrl ? (
                      <div className="flex items-center justify-between p-3.5 bg-[#0A0F1E] border border-white/5 rounded-2xl h-[120px] flex-col justify-between">
                        <div className="flex flex-col items-center gap-2 mt-2">
                          <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10px] text-gray-300 font-mono font-medium max-w-[220px] truncate">
                            {formData.brochureUrl.substring(formData.brochureUrl.lastIndexOf('/') + 1)}
                          </span>
                        </div>
                        <div className="flex gap-3 w-full">
                          <label className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-[9px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all text-center">
                            Replace
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleUploadClick(e, 'brochure')}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, brochureUrl: '' }))}
                            className="flex-1 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/10 hover:border-red-500/30 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-[#F4C542] bg-[#0A0F1E] rounded-2xl p-6 cursor-pointer transition-all text-center h-[120px] justify-center">
                        {uploadingField.brochure ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="h-6 w-6 border-2 border-t-transparent border-[#F4C542] rounded-full animate-spin" />
                            <span className="text-[10px] text-[#F4C542] font-semibold uppercase tracking-wider">Uploading PDF Brochure...</span>
                          </div>
                        ) : (
                          <div className="space-y-1 text-gray-400 hover:text-white">
                            <svg className="mx-auto h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-[10px] font-bold uppercase tracking-wider">Upload PDF Marketing Brochure</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleUploadClick(e, 'brochure')}
                          className="hidden"
                          disabled={uploadingField.brochure}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#0A0F1E] rounded-2xl border border-white/5">
                  <input
                    id="showOnHome"
                    type="checkbox"
                    checked={formData.showOnHome}
                    onChange={(e) => setFormData(prev => ({ ...prev, showOnHome: e.target.checked }))}
                    className="h-4 w-4 rounded border-white/10 bg-[#0A0F1E] text-[#F4C542] focus:ring-[#F4C542]"
                  />
                  <label htmlFor="showOnHome" className="text-xs uppercase tracking-widest text-gray-400 font-bold cursor-pointer">
                    Show on Home Page
                  </label>
                </div>

                {/* CONDITIONALLY RENDER STANDARD VS VENTURE PLOTS DATA LAYOUT FIELDS */}
                {formData.isVenture ? (
                  <div className="space-y-5 p-5 bg-[#0A0F1E] rounded-2xl border border-white/5">
                    <h4 className="text-xs uppercase tracking-widest text-[#F4C542] font-extrabold border-b border-white/5 pb-2">Masterplan Plot Generator</h4>
                    
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Total Plot Subdivisions</label>
                        <input
                          type="number"
                          placeholder="e.g. 8"
                          value={formData.totalPlots}
                          onChange={(e) => setFormData(prev => ({ ...prev, totalPlots: e.target.value }))}
                          className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Default Dimensions</label>
                        <input
                          type="text"
                          value={formData.defaultDimensions}
                          onChange={(e) => setFormData(prev => ({ ...prev, defaultDimensions: e.target.value }))}
                          className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Default Sizing/Area</label>
                        <input
                          type="text"
                          value={formData.defaultArea}
                          onChange={(e) => setFormData(prev => ({ ...prev, defaultArea: e.target.value }))}
                          className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Default Price</label>
                        <input
                          type="text"
                          value={formData.defaultPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, defaultPrice: e.target.value }))}
                          className="w-full bg-[#0F1A3A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#F4C542]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const count = Number(formData.totalPlots) || 8
                          const newPlots = generatePlotsLayout(count, formData.defaultDimensions, formData.defaultArea, formData.defaultPrice)
                          setFormData(prev => ({ ...prev, plots: newPlots }))
                        }}
                        className="w-full py-3 border border-[#F4C542]/40 hover:border-[#F4C542] text-[#F4C542] hover:bg-[#F4C542]/10 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300"
                      >
                        Regenerate Plot Layout Grid
                      </button>
                    </div>

                    {formData.plots && formData.plots.length > 0 && (
                      <div className="space-y-4 pt-3 border-t border-white/5">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-[#F4C542] font-bold">Bulk Update Actions</span>
                          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                            <button
                              type="button"
                              onClick={() => {
                                const val = prompt("Enter price for all plots (e.g. $450K):")
                                if (val !== null) {
                                  setFormData(prev => ({
                                    ...prev,
                                    plots: prev.plots.map(p => ({ ...p, price: val }))
                                  }))
                                }
                              }}
                              className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-extrabold uppercase tracking-wider text-gray-300 border border-white/5"
                            >
                              Set All Prices
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const val = prompt("Enter dimensions for all plots (e.g. 80' x 120'):")
                                if (val !== null) {
                                  const updated = formData.plots.map(p => ({ ...p, dimensions: val }))
                                  const recalculated = recalculatePlotsLayout(updated, formData.plots.length <= 12 ? 2 : 4)
                                  setFormData(prev => ({
                                    ...prev,
                                    plots: recalculated
                                  }))
                                }
                              }}
                              className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-extrabold uppercase tracking-wider text-gray-300 border border-white/5"
                            >
                              Set All Dims
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const val = prompt("Enter area for all plots (e.g. 9,600 sq ft):")
                                if (val !== null) {
                                  setFormData(prev => ({
                                    ...prev,
                                    plots: prev.plots.map(p => ({ ...p, area: val }))
                                  }))
                                }
                              }}
                              className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-extrabold uppercase tracking-wider text-gray-300 border border-white/5"
                            >
                              Set All Areas
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const val = prompt("Enter status for all plots (available, reserved, sold):")
                                if (val && ['available', 'reserved', 'sold'].includes(val.toLowerCase())) {
                                  setFormData(prev => ({
                                    ...prev,
                                    plots: prev.plots.map(p => ({ ...p, status: val.toLowerCase() }))
                                  }))
                                } else if (val !== null) {
                                  alert("Status must be available, reserved, or sold")
                                }
                              }}
                              className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-extrabold uppercase tracking-wider text-gray-300 border border-white/5"
                            >
                              Set All Statuses
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Configure Individual Plots ({formData.plots.length})</span>
                          </div>
                          
                          <div className="max-h-64 overflow-y-auto border border-white/10 bg-[#071120] rounded-xl p-3 space-y-3 scrollbar-thin">
                            {formData.plots.map((plot, index) => (
                              <div key={plot.id} className="grid gap-2 grid-cols-2 md:grid-cols-5 items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                                  {plot.number}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Dim (80' x 120')"
                                  value={plot.dimensions}
                                  onChange={(e) => {
                                    const nextPlots = [...formData.plots]
                                    nextPlots[index] = { ...plot, dimensions: e.target.value }
                                    const recalculated = recalculatePlotsLayout(nextPlots, formData.plots.length <= 12 ? 2 : 4)
                                    setFormData(prev => ({ ...prev, plots: recalculated }))
                                  }}
                                  className="w-full bg-[#0F1A3A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#F4C542]"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Area (9,600 sq ft)"
                                  value={plot.area}
                                  onChange={(e) => {
                                    const nextPlots = [...formData.plots]
                                    nextPlots[index] = { ...plot, area: e.target.value }
                                    setFormData(prev => ({ ...prev, plots: nextPlots }))
                                  }}
                                  className="w-full bg-[#0F1A3A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#F4C542]"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Price ($450K)"
                                  value={plot.price}
                                  onChange={(e) => {
                                    const nextPlots = [...formData.plots]
                                    nextPlots[index] = { ...plot, price: e.target.value }
                                    setFormData(prev => ({ ...prev, plots: nextPlots }))
                                  }}
                                  className="w-full bg-[#0F1A3A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#F4C542]"
                                  required
                                />
                                <select
                                  value={plot.status}
                                  onChange={(e) => {
                                    const nextPlots = [...formData.plots]
                                    nextPlots[index] = { ...plot, status: e.target.value }
                                    setFormData(prev => ({ ...prev, plots: nextPlots }))
                                  }}
                                  className="w-full bg-[#0F1A3A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#F4C542] col-span-2 md:col-span-1"
                                >
                                  <option value="available">Available</option>
                                  <option value="reserved">Reserved</option>
                                  <option value="sold">Sold</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-gray-500 leading-relaxed italic pt-2">
                      Note: Grid generator dynamically designs coordinates for up to 100 plots, maintaining neat row-wise placement so they render perfectly on the canvas.
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
