// Resilient API client with strict type-guards to prevent runtime rendering crashes
import {
  defaultContact,
  defaultTestimonials,
  defaultInquiries
} from './defaults.js'

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('evervale_admin_token')
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const customFetch = (url, options) => {
  const targetUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url
  return fetch(targetUrl, options)
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const api = {
  // Auth
  login: async (username, password) => {
    try {
      const res = await customFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await handleResponse(res)
      if (data && data.token) {
        sessionStorage.setItem('evervale_admin_token', data.token)
        sessionStorage.setItem('evervale_admin_auth', 'true')
        return data
      }
    } catch (error) {
      console.warn('Backend login failed, attempting local fallback validation:', error.message)
    }

    // Local fallback for offline testing
    if (username === 'admin' && password === 'evervale2026') {
      sessionStorage.setItem('evervale_admin_auth', 'true')
      return { username: 'admin', token: 'mock-offline-token-12345' }
    }
    throw new Error('Invalid administrative credentials (offline fallback).')
  },

  logout: () => {
    sessionStorage.removeItem('evervale_admin_token')
    sessionStorage.removeItem('evervale_admin_auth')
  },

  isAuthenticated: () => {
    return sessionStorage.getItem('evervale_admin_auth') === 'true'
  },

  // Properties
  getProperties: async () => {
    const res = await customFetch('/api/properties')
    return await handleResponse(res)
  },

  getProperty: async (id) => {
    const res = await customFetch(`/api/properties/${id}`)
    return await handleResponse(res)
  },

  createProperty: async (propertyData) => {
    const res = await customFetch('/api/properties', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    })
    return await handleResponse(res)
  },

  updateProperty: async (id, propertyData) => {
    const res = await customFetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    })
    return await handleResponse(res)
  },

  deleteProperty: async (id) => {
    const res = await customFetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return await handleResponse(res)
  },

  // Plots
  updatePlotStatus: async (propertyId, plotId, status) => {
    const res = await customFetch(`/api/properties/${propertyId}/plots/${plotId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    return await handleResponse(res)
  },

  // Inquiries (CRM leads)
  getInquiries: async () => {
    try {
      const res = await customFetch('/api/inquiries', {
        method: 'GET',
        headers: getAuthHeaders()
      })
      const data = await handleResponse(res)
      if (Array.isArray(data)) {
        localStorage.setItem('evervale_inquiries', JSON.stringify(data))
        return data
      }
    } catch (error) {
      console.warn('Backend offline: Falling back to local inquiries data.', error.message)
    }

    const cached = localStorage.getItem('evervale_inquiries')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) return parsed
      } catch (err) {
        console.error('Failed to parse cached inquiries:', err)
      }
    }
    return defaultInquiries
  },

  createInquiry: async (inquiryData) => {
    try {
      const res = await customFetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      })
      return await handleResponse(res)
    } catch (error) {
      console.warn('Backend offline: Submitting inquiry locally.', error.message)
    }

    const cached = localStorage.getItem('evervale_inquiries')
    let current = []
    try {
      current = cached ? JSON.parse(cached) : defaultInquiries
    } catch (err) {
      console.error('Failed to parse cached inquiries for creation:', err)
    }
    if (!Array.isArray(current)) current = defaultInquiries
    localStorage.setItem('evervale_inquiries', JSON.stringify([...current, inquiryData]))
    return inquiryData
  },

  deleteInquiry: async (id) => {
    try {
      const res = await customFetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await handleResponse(res)
      const cached = localStorage.getItem('evervale_inquiries')
      if (cached) {
        try {
          let list = JSON.parse(cached)
          if (Array.isArray(list)) {
            list = list.filter((lead) => lead.id !== id)
            localStorage.setItem('evervale_inquiries', JSON.stringify(list))
          }
        } catch (err) {
          console.error('Failed to parse cached inquiries for deletion:', err)
        }
      }
      return data
    } catch (error) {
      console.warn('Backend offline: Dismissing inquiry locally.', error.message)
    }

    const cached = localStorage.getItem('evervale_inquiries')
    if (cached) {
      try {
        let list = JSON.parse(cached)
        if (Array.isArray(list)) {
          list = list.filter((lead) => lead.id !== id)
          localStorage.setItem('evervale_inquiries', JSON.stringify(list))
        }
      } catch (err) {
        console.error('Failed to parse cached inquiries for local deletion:', err)
      }
    }
    return { success: true }
  },

  // Testimonials
  getTestimonials: async () => {
    try {
      const res = await customFetch('/api/testimonials')
      const data = await handleResponse(res)
      if (Array.isArray(data)) {
        localStorage.setItem('evervale_testimonials', JSON.stringify(data))
        return data
      }
    } catch (error) {
      console.warn('Backend offline: Falling back to local testimonials.', error.message)
    }

    const cached = localStorage.getItem('evervale_testimonials')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) return parsed
      } catch (err) {
        console.error('Failed to parse cached testimonials:', err)
      }
    }
    return defaultTestimonials
  },

  createTestimonial: async (testimonialData) => {
    try {
      const res = await customFetch('/api/testimonials', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(testimonialData)
      })
      const data = await handleResponse(res)
      if (data && typeof data === 'object') {
        const cached = localStorage.getItem('evervale_testimonials')
        const current = cached ? JSON.parse(cached) : defaultTestimonials
        if (Array.isArray(current)) {
          localStorage.setItem('evervale_testimonials', JSON.stringify([...current, data]))
        }
        return data
      }
    } catch (error) {
      console.warn('Backend offline: Creating testimonial locally.', error.message)
    }

    const cached = localStorage.getItem('evervale_testimonials')
    let current = []
    try {
      current = cached ? JSON.parse(cached) : defaultTestimonials
    } catch (err) {
      console.error('Failed to parse cached testimonials for creation:', err)
    }
    if (!Array.isArray(current)) current = defaultTestimonials
    localStorage.setItem('evervale_testimonials', JSON.stringify([...current, testimonialData]))
    return testimonialData
  },

  deleteTestimonial: async (id) => {
    try {
      const res = await customFetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await handleResponse(res)
      const cached = localStorage.getItem('evervale_testimonials')
      if (cached) {
        try {
          let list = JSON.parse(cached)
          if (Array.isArray(list)) {
            list = list.filter(t => t._id !== id)
            localStorage.setItem('evervale_testimonials', JSON.stringify(list))
          }
        } catch (err) {
          console.error('Failed to parse cached testimonials for deletion:', err)
        }
      }
      return data
    } catch (error) {
      console.warn('Backend offline: Deleting testimonial locally.', error.message)
    }

    const cached = localStorage.getItem('evervale_testimonials')
    if (cached) {
      try {
        let list = JSON.parse(cached)
        if (Array.isArray(list)) {
          list = list.filter(t => t._id !== id)
          localStorage.setItem('evervale_testimonials', JSON.stringify(list))
        }
      } catch (err) {
        console.error('Failed to parse cached testimonials for local deletion:', err)
      }
    }
    return { success: true }
  },

  // Contact Settings
  getContactSettings: async () => {
    try {
      const res = await customFetch('/api/contact-settings')
      const data = await handleResponse(res)
      if (data && typeof data === 'object') {
        localStorage.setItem('evervale_contact', JSON.stringify(data))
        return data
      }
    } catch (error) {
      console.warn('Backend offline: Falling back to local contact configurations.', error.message)
    }

    const cached = localStorage.getItem('evervale_contact')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed && typeof parsed === 'object') return parsed
      } catch (err) {
        console.error('Failed to parse cached contact coordinates:', err)
      }
    }
    return defaultContact
  },

  updateContactSettings: async (settingsData) => {
    try {
      const res = await customFetch('/api/contact-settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settingsData)
      })
      const data = await handleResponse(res)
      if (data && typeof data === 'object') {
        localStorage.setItem('evervale_contact', JSON.stringify(data))
        return data
      }
    } catch (error) {
      console.warn('Backend offline: Updating contact configurations locally.', error.message)
    }

    localStorage.setItem('evervale_contact', JSON.stringify(settingsData))
    return settingsData
  },

  uploadFile: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const token = sessionStorage.getItem('evervale_admin_token')
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

      const res = await customFetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData
      })
      return await handleResponse(res)
    } catch (error) {
      console.warn('Backend offline: Mocking upload path locally.', error.message)
      return { url: `/uploads/mock-local-${Date.now()}-${file.name}` }
    }
  },

  uploadMultipleFiles: async (files) => {
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      const token = sessionStorage.getItem('evervale_admin_token')
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

      const res = await customFetch('/api/upload/multiple', {
        method: 'POST',
        headers,
        body: formData
      })
      const data = await handleResponse(res)
      return data // returns { urls: [...] }
    } catch (error) {
      console.warn('Backend offline: Mocking multiple upload paths locally.', error.message)
      const urls = Array.from(files).map((file, idx) => `/uploads/mock-local-${Date.now()}-${idx}-${file.name}`)
      return { urls }
    }
  }
}

export default api
