import ApiService from './api'

/**
 * Authentication Service
 * Handles user authentication, token management, and user profile
 */
class AuthService {
  constructor() {
    this.tokenKey = 'auth_token'
    this.userKey = 'auth_user'
    this.refreshTokenKey = 'refresh_token'
  }

  /**
   * Login user dengan email dan password
   * @param {Object} credentials - { email, password, remember_me }
   * @returns {Promise<Object>} User data dan token
   */
  async login(credentials) {
    try {
      const response = await ApiService.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        remember_me: credentials.remember_me || false
      })

      const { user, token, refresh_token } = response.data || response

      // Store tokens
      this.setToken(token)
      this.setUser(user)
      
      if (refresh_token) {
        this.setRefreshToken(refresh_token)
      }

      return { user, token }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register user baru
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data dan token
   */
  async register(userData) {
    try {
      const response = await ApiService.post('/auth/register', userData)
      
      const { user, token, refresh_token } = response.data || response

      // Store tokens setelah register berhasil
      this.setToken(token)
      this.setUser(user)
      
      if (refresh_token) {
        this.setRefreshToken(refresh_token)
      }

      return { user, token }
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Call logout endpoint jika token masih valid
      const token = this.getToken()
      if (token) {
        await ApiService.post('/auth/logout').catch(() => {
          // Ignore error jika logout endpoint gagal
          console.warn('Logout endpoint failed, continuing with local logout')
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call result
      this.clearAuthData()
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<string>} New token
   */
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await ApiService.post('/auth/refresh', {
        refresh_token: refreshToken
      })

      const { token, refresh_token: newRefreshToken } = response.data || response

      this.setToken(token)
      if (newRefreshToken) {
        this.setRefreshToken(newRefreshToken)
      }

      return token
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear auth data jika refresh gagal
      this.clearAuthData()
      throw error
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  async getProfile() {
    try {
      const response = await ApiService.get('/auth/profile')
      const user = response.data || response
      
      // Update stored user data
      this.setUser(user)
      
      return user
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(profileData) {
    try {
      const response = await ApiService.put('/auth/profile', profileData)
      const user = response.data || response
      
      // Update stored user data
      this.setUser(user)
      
      return user
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  /**
   * Change password
   * @param {Object} passwordData - { current_password, new_password, new_password_confirmation }
   * @returns {Promise<Object>} Success response
   */
  async changePassword(passwordData) {
    try {
      const response = await ApiService.put('/auth/change-password', passwordData)
      return response
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Success response
   */
  async forgotPassword(email) {
    try {
      const response = await ApiService.post('/auth/forgot-password', { email })
      return response
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  /**
   * Reset password dengan token
   * @param {Object} resetData - { token, email, password, password_confirmation }
   * @returns {Promise<Object>} Success response
   */
  async resetPassword(resetData) {
    try {
      const response = await ApiService.post('/auth/reset-password', resetData)
      return response
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  /**
   * Verify email dengan token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Success response
   */
  async verifyEmail(token) {
    try {
      const response = await ApiService.post('/auth/verify-email', { token })
      return response
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  }

  /**
   * Resend email verification
   * @returns {Promise<Object>} Success response
   */
  async resendVerification() {
    try {
      const response = await ApiService.post('/auth/resend-verification')
      return response
    } catch (error) {
      console.error('Resend verification error:', error)
      throw error
    }
  }

  // Token Management Methods
  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  setRefreshToken(refreshToken) {
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken)
    }
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey)
  }

  // User Management Methods
  setUser(user) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user))
    }
  }

  getUser() {
    const user = localStorage.getItem(this.userKey)
    return user ? JSON.parse(user) : null
  }

  // Auth State Methods
  isAuthenticated() {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user)
  }

  isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      // Decode JWT token untuk check expiry
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      console.error('Token decode error:', error)
      return true
    }
  }

  // Utility Methods
  clearAuthData() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    localStorage.removeItem(this.refreshTokenKey)
  }

  /**
   * Check user role
   * @param {string|Array} roles - Role atau array roles yang dicheck
   * @returns {boolean} Whether user has the role(s)
   */
  hasRole(roles) {
    const user = this.getUser()
    if (!user || !user.roles) return false

    const userRoles = Array.isArray(user.roles) 
      ? user.roles.map(role => role.name || role)
      : [user.role || user.roles]

    const checkRoles = Array.isArray(roles) ? roles : [roles]
    
    return checkRoles.some(role => userRoles.includes(role))
  }

  /**
   * Check user permission
   * @param {string|Array} permissions - Permission atau array permissions
   * @returns {boolean} Whether user has the permission(s)
   */
  hasPermission(permissions) {
    const user = this.getUser()
    if (!user || !user.permissions) return false

    const userPermissions = Array.isArray(user.permissions)
      ? user.permissions.map(perm => perm.name || perm)
      : [user.permissions]

    const checkPermissions = Array.isArray(permissions) ? permissions : [permissions]
    
    return checkPermissions.some(permission => userPermissions.includes(permission))
  }

  /**
   * Get user initials untuk avatar
   * @returns {string} User initials
   */
  getUserInitials() {
    const user = this.getUser()
    if (!user || !user.name) return 'U'

    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  /**
   * Get user avatar URL atau fallback
   * @returns {string} Avatar URL atau null
   */
  getUserAvatar() {
    const user = this.getUser()
    return user?.avatar || user?.profile_photo_url || null
  }
}

export default new AuthService()