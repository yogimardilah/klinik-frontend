import axios from 'axios'

/**
 * API Service
 * Handles HTTP requests dengan automatic authentication dan error handling
 */
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    this.timeout = 10000 // 10 seconds
    
    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor untuk add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token jika tersedia
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log request untuk debugging
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params
          })
        }

        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor untuk handle errors dan token refresh
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response untuk debugging
        if (import.meta.env.DEV) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
        }

        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Log error untuk debugging
        if (import.meta.env.DEV) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          })
        }

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Try to refresh token
            await this.refreshAuthToken()
            
            // Retry original request dengan token baru
            const newToken = this.getAuthToken()
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.warn('Access forbidden - insufficient permissions')
        }

        // Handle 429 Too Many Requests
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded')
        }

        // Handle network errors
        if (!error.response) {
          console.error('Network error - server may be unreachable')
        }

        return Promise.reject(this.normalizeError(error))
      }
    )
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth_token')
  }

  // Get refresh token from localStorage
  getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  // Refresh authentication token
  async refreshAuthToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      // Make refresh request tanpa interceptor untuk avoid infinite loop
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      const { token, refresh_token: newRefreshToken } = response.data

      // Update tokens
      localStorage.setItem('auth_token', token)
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken)
      }

      return token
    } catch (error) {
      // Clear invalid tokens
      this.clearAuthTokens()
      throw error
    }
  }

  // Clear auth tokens
  clearAuthTokens() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('refresh_token')
  }

  // Handle authentication failure
  handleAuthFailure() {
    this.clearAuthTokens()
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  // Normalize error response
  normalizeError(error) {
    if (error.response) {
      // Server responded dengan error status
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        data: error.response.data,
        errors: error.response.data?.errors
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      return {
        status: 0,
        message: 'Network error - no response from server',
        data: null
      }
    } else {
      // Error dalam setup request
      return {
        status: 0,
        message: error.message,
        data: null
      }
    }
  }

  // HTTP Methods
  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async post(url, data = {}) {
    try {
      const response = await this.client.post(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async put(url, data = {}) {
    try {
      const response = await this.client.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async patch(url, data = {}) {
    try {
      const response = await this.client.patch(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async delete(url, params = {}) {
    try {
      const response = await this.client.delete(url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // File upload method
  async uploadFile(url, file, progressCallback = null) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressCallback && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            progressCallback(progress)
          }
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Download file method
  async downloadFile(url, filename = null) {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob'
      })

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', filename || 'download')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      return response.data
    } catch (error) {
      throw error
    }
  }

  // Set auth token manually (untuk login)
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth_token', token)
    }
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getAuthToken()
  }

  // Get API base URL
  getBaseURL() {
    return this.baseURL
  }

  // Set timeout
  setTimeout(timeout) {
    this.timeout = timeout
    this.client.defaults.timeout = timeout
  }
}

// Export singleton instance
export default new ApiService()