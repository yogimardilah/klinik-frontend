import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '@/services/authService'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => {
    return !!(user.value && token.value && AuthService.isAuthenticated())
  })

  const isTokenExpired = computed(() => {
    return AuthService.isTokenExpired()
  })

  const userInitials = computed(() => {
    return AuthService.getUserInitials()
  })

  const userAvatar = computed(() => {
    return AuthService.getUserAvatar()
  })

  const userRole = computed(() => {
    if (!user.value) return null
    return user.value.role || user.value.roles?.[0]?.name || null
  })

  const userPermissions = computed(() => {
    if (!user.value) return []
    return user.value.permissions || []
  })

  // Actions
  const initializeAuth = async () => {
    if (isInitialized.value) return

    try {
      const storedToken = AuthService.getToken()
      const storedUser = AuthService.getUser()

      if (storedToken && storedUser) {
        // Check if token is expired
        if (AuthService.isTokenExpired()) {
          try {
            // Try to refresh token
            await refreshToken()
          } catch (error) {
            // If refresh fails, logout
            await logout()
          }
        } else {
          // Token is valid, set auth state
          token.value = storedToken
          user.value = storedUser
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      await logout()
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await AuthService.login(credentials)
      
      // Set auth state
      user.value = response.user
      token.value = response.token

      return response
    } catch (error) {
      // Clear any partial auth state
      user.value = null
      token.value = null
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await AuthService.register(userData)
      
      // Set auth state
      user.value = response.user
      token.value = response.token

      return response
    } catch (error) {
      // Clear any partial auth state
      user.value = null
      token.value = null
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear auth state
      user.value = null
      token.value = null
      isLoading.value = false

      // Redirect to login page
      if (router.currentRoute.value.name !== 'Login') {
        router.push({ name: 'Login' })
      }
    }
  }

  const refreshToken = async () => {
    try {
      const newToken = await AuthService.refreshToken()
      token.value = newToken
      return newToken
    } catch (error) {
      await logout()
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const updatedUser = await AuthService.updateProfile(profileData)
      user.value = updatedUser
      return updatedUser
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    isLoading.value = true
    try {
      const response = await AuthService.changePassword(passwordData)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async (email) => {
    isLoading.value = true
    try {
      const response = await AuthService.forgotPassword(email)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (resetData) => {
    isLoading.value = true
    try {
      const response = await AuthService.resetPassword(resetData)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const verifyEmail = async (token) => {
    isLoading.value = true
    try {
      const response = await AuthService.verifyEmail(token)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resendVerification = async () => {
    isLoading.value = true
    try {
      const response = await AuthService.resendVerification()
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Permission & Role Helpers
  const hasRole = (roles) => {
    return AuthService.hasRole(roles)
  }

  const hasPermission = (permissions) => {
    return AuthService.hasPermission(permissions)
  }

  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) roles = [roles]
    return roles.some(role => hasRole(role))
  }

  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) permissions = [permissions]
    return permissions.some(permission => hasPermission(permission))
  }

  // Refresh user profile from server
  const refreshProfile = async () => {
    try {
      const updatedUser = await AuthService.getProfile()
      user.value = updatedUser
      return updatedUser
    } catch (error) {
      console.error('Refresh profile error:', error)
      throw error
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    isInitialized,
    
    // Getters
    isAuthenticated,
    isTokenExpired,
    userInitials,
    userAvatar,
    userRole,
    userPermissions,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshProfile,
    
    // Helpers
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission
  }
})