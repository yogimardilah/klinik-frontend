import { useAuthStore } from '@/stores/auth'

/**
 * Authentication Middleware
 * Provides route guards and access control
 */

/**
 * Require authentication guard
 * Redirects to login if user is not authenticated
 */
export const requireAuth = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state jika belum
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (authStore.isAuthenticated) {
    // Check if token is expired
    if (authStore.isTokenExpired) {
      try {
        // Try to refresh token
        await authStore.refreshToken()
        next()
      } catch (error) {
        // Redirect to login if refresh fails
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
      }
    } else {
      next()
    }
  } else {
    // Redirect to login with return URL
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }
}

/**
 * Guest only guard
 * Redirects authenticated users away from guest pages (like login)
 */
export const guestOnly = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state jika belum
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (authStore.isAuthenticated) {
    // Redirect authenticated users to dashboard
    next({ name: 'Dashboard' })
  } else {
    next()
  }
}

/**
 * Role-based access control guard
 * @param {string|Array} roles - Required roles
 * @returns {Function} Route guard function
 */
export const requireRole = (roles) => {
  return async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Initialize auth state jika belum
    if (!authStore.isInitialized) {
      await authStore.initializeAuth()
    }

    if (!authStore.isAuthenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }

    if (authStore.hasRole(roles)) {
      next()
    } else {
      // Redirect to unauthorized page or dashboard
      next({
        name: 'Dashboard',
        query: { error: 'unauthorized' }
      })
    }
  }
}

/**
 * Permission-based access control guard
 * @param {string|Array} permissions - Required permissions
 * @returns {Function} Route guard function
 */
export const requirePermission = (permissions) => {
  return async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Initialize auth state jika belum
    if (!authStore.isInitialized) {
      await authStore.initializeAuth()
    }

    if (!authStore.isAuthenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }

    if (authStore.hasPermission(permissions)) {
      next()
    } else {
      // Redirect to unauthorized page or dashboard
      next({
        name: 'Dashboard',
        query: { error: 'unauthorized' }
      })
    }
  }
}

/**
 * Admin only guard
 * Shortcut untuk require admin role
 */
export const requireAdmin = requireRole(['admin', 'super_admin'])

/**
 * Doctor only guard
 * Shortcut untuk require doctor role
 */
export const requireDoctor = requireRole(['doctor', 'dokter'])

/**
 * Staff guard (admin, doctor, nurse, etc.)
 * Allow multiple staff roles
 */
export const requireStaff = requireRole(['admin', 'doctor', 'nurse', 'staff', 'dokter', 'perawat'])

/**
 * Verify email required guard
 * Redirects to email verification if email is not verified
 */
export const requireVerifiedEmail = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state jika belum
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (!authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  const user = authStore.user
  if (user && user.email_verified_at) {
    next()
  } else {
    // Redirect to email verification page
    next({
      name: 'VerifyEmail',
      query: { redirect: to.fullPath }
    })
  }
}

/**
 * Optional auth guard
 * Loads auth state but doesn't redirect if not authenticated
 * Useful for pages that work both for guests and authenticated users
 */
export const optionalAuth = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state jika belum
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  // Always proceed regardless of auth status
  next()
}

/**
 * Composite guard untuk multiple requirements
 * @param {Array} guards - Array of guard functions
 * @returns {Function} Combined guard function
 */
export const combineGuards = (guards) => {
  return async (to, from, next) => {
    for (const guard of guards) {
      try {
        await new Promise((resolve, reject) => {
          guard(to, from, (result) => {
            if (result === true || result === undefined) {
              resolve()
            } else {
              reject(result)
            }
          })
        })
      } catch (redirectResult) {
        // If any guard wants to redirect, do it
        next(redirectResult)
        return
      }
    }
    // If all guards passed, proceed
    next()
  }
}

/**
 * Route meta helper untuk defining route requirements
 * Usage di route definition:
 * meta: { 
 *   requiresAuth: true,
 *   roles: ['admin'],
 *   permissions: ['user.create']
 * }
 */
export const metaGuard = async (to, from, next) => {
  const meta = to.meta || {}
  const authStore = useAuthStore()
  
  // Initialize auth state jika belum
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  // Check if route requires authentication
  if (meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Check if route is guest only
  if (meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Check roles
  if (meta.roles && !authStore.hasAnyRole(meta.roles)) {
    next({
      name: 'Dashboard',
      query: { error: 'unauthorized' }
    })
    return
  }

  // Check permissions
  if (meta.permissions && !authStore.hasAnyPermission(meta.permissions)) {
    next({
      name: 'Dashboard',
      query: { error: 'unauthorized' }
    })
    return
  }

  // Check email verification
  if (meta.requiresVerification && authStore.user && !authStore.user.email_verified_at) {
    next({
      name: 'VerifyEmail',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
}