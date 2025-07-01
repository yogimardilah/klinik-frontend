import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

/**
 * Composable untuk authentication utilities
 * Menyediakan helper functions dan reactive auth state
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Reactive computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const userRole = computed(() => authStore.userRole)
  const userPermissions = computed(() => authStore.userPermissions)
  const userInitials = computed(() => authStore.userInitials)
  const userAvatar = computed(() => authStore.userAvatar)

  // Auth actions
  const login = async (credentials) => {
    return await authStore.login(credentials)
  }

  const register = async (userData) => {
    return await authStore.register(userData)
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  const updateProfile = async (profileData) => {
    return await authStore.updateProfile(profileData)
  }

  const changePassword = async (passwordData) => {
    return await authStore.changePassword(passwordData)
  }

  // Permission helpers
  const hasRole = (roles) => {
    return authStore.hasRole(roles)
  }

  const hasPermission = (permissions) => {
    return authStore.hasPermission(permissions)
  }

  const hasAnyRole = (roles) => {
    return authStore.hasAnyRole(roles)
  }

  const hasAnyPermission = (permissions) => {
    return authStore.hasAnyPermission(permissions)
  }

  // Role checks
  const isAdmin = computed(() => hasRole(['admin', 'super_admin']))
  const isDoctor = computed(() => hasRole(['doctor', 'dokter']))
  const isNurse = computed(() => hasRole(['nurse', 'perawat']))
  const isStaff = computed(() => hasRole(['staff', 'admin', 'doctor', 'nurse']))

  // Permission checks for common actions
  const canManageUsers = computed(() => hasPermission(['user.manage', 'user.create', 'user.edit', 'user.delete']))
  const canManagePatients = computed(() => hasPermission(['patient.manage']) || hasAnyRole(['admin', 'doctor', 'nurse']))
  const canViewReports = computed(() => hasPermission(['report.view']) || hasAnyRole(['admin', 'doctor']))
  const canManageSettings = computed(() => hasPermission(['setting.manage']) || isAdmin.value)

  // User info helpers
  const getFullName = () => {
    return user.value?.name || 'Unknown User'
  }

  const getEmail = () => {
    return user.value?.email || ''
  }

  const getRoleName = () => {
    const roleMap = {
      'admin': 'Administrator',
      'super_admin': 'Super Administrator', 
      'doctor': 'Dokter',
      'dokter': 'Dokter',
      'nurse': 'Perawat',
      'perawat': 'Perawat',
      'staff': 'Staff'
    }
    return roleMap[userRole.value] || userRole.value || 'User'
  }

  const getInitials = () => {
    return userInitials.value
  }

  // Check if user email is verified
  const isEmailVerified = computed(() => {
    return user.value?.email_verified_at !== null
  })

  // Check if user profile is complete
  const isProfileComplete = computed(() => {
    if (!user.value) return false
    
    const requiredFields = ['name', 'email']
    return requiredFields.every(field => user.value[field])
  })

  // Navigation helpers
  const redirectToLogin = (redirectPath = null) => {
    const query = redirectPath ? { redirect: redirectPath } : {}
    router.push({ name: 'Login', query })
  }

  const redirectToDashboard = () => {
    router.push({ name: 'Dashboard' })
  }

  const redirectToProfile = () => {
    router.push({ name: 'Profile' })
  }

  // Auth guards for programmatic use
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      redirectToLogin(router.currentRoute.value.fullPath)
      return false
    }
    return true
  }

  const requireRole = (requiredRoles) => {
    if (!requireAuth()) return false
    
    if (!hasAnyRole(requiredRoles)) {
      router.push({ name: 'Dashboard', query: { error: 'unauthorized' } })
      return false
    }
    return true
  }

  const requirePermission = (requiredPermissions) => {
    if (!requireAuth()) return false
    
    if (!hasAnyPermission(requiredPermissions)) {
      router.push({ name: 'Dashboard', query: { error: 'unauthorized' } })
      return false
    }
    return true
  }

  // Token utilities
  const getAuthToken = () => {
    return authStore.token
  }

  const isTokenExpired = () => {
    return authStore.isTokenExpired
  }

  // Format user display name for UI
  const formatUserName = (includeRole = false) => {
    const name = getFullName()
    if (includeRole) {
      return `${name} (${getRoleName()})`
    }
    return name
  }

  // Check if current user can perform action on target user
  const canManageUser = (targetUser) => {
    if (isAdmin.value) return true
    if (user.value?.id === targetUser?.id) return true // Can manage own profile
    return false
  }

  return {
    // Reactive state
    user,
    isAuthenticated,
    isLoading,
    userRole,
    userPermissions,
    userInitials,
    userAvatar,
    isEmailVerified,
    isProfileComplete,

    // Auth actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,

    // Permission checks
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,

    // Role helpers
    isAdmin,
    isDoctor,
    isNurse,
    isStaff,

    // Permission helpers
    canManageUsers,
    canManagePatients,
    canViewReports,
    canManageSettings,

    // User info
    getFullName,
    getEmail,
    getRoleName,
    getInitials,
    formatUserName,

    // Navigation
    redirectToLogin,
    redirectToDashboard,
    redirectToProfile,

    // Guards
    requireAuth,
    requireRole,
    requirePermission,

    // Utilities
    getAuthToken,
    isTokenExpired,
    canManageUser
  }
}