import axios from '@/plugins/axios'

/**
 * Base API Service untuk semua endpoint
 */
class ApiService {
  constructor() {
    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add timestamp untuk mencegah caching
        config.params = {
          ...config.params,
          _t: Date.now()
        }
        
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
        return config
      },
      (error) => {
        console.error('Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status}`, response.data)
        return response
      },
      (error) => {
        console.error('Response Error:', error.response || error)
        
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - logout user
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        
        return Promise.reject(this.handleError(error))
      }
    )
  }

  handleError(error) {
    const errorResponse = {
      message: 'Terjadi kesalahan pada server',
      status: error.response?.status || 500,
      data: error.response?.data || null
    }

    if (error.response?.data?.message) {
      errorResponse.message = error.response.data.message
    } else if (error.message === 'Network Error') {
      errorResponse.message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (error.code === 'ECONNABORTED') {
      errorResponse.message = 'Request timeout. Silakan coba lagi.'
    }

    return errorResponse
  }

  // GET request
  async get(url, params = {}) {
    try {
      const response = await axios.get(url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // POST request
  async post(url, data = {}) {
    try {
      const response = await axios.post(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // PUT request
  async put(url, data = {}) {
    try {
      const response = await axios.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // PATCH request
  async patch(url, data = {}) {
    try {
      const response = await axios.patch(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // DELETE request
  async delete(url) {
    try {
      const response = await axios.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Upload file
  async upload(url, file, onProgress = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (onProgress) {
        config.onUploadProgress = onProgress
      }

      const response = await axios.post(url, formData, config)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new ApiService()