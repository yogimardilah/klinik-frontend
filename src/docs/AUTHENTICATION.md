# Authentication System Documentation

## Overview

Sistem autentikasi yang lengkap untuk aplikasi klinik management dengan fitur:
- JWT-based authentication
- Role & permission management 
- Auto token refresh
- Route protection
- State management dengan Pinia

## Architecture

```
├── src/
│   ├── services/
│   │   ├── authService.js          # Core authentication logic
│   │   └── api.js                  # HTTP client dengan auto-auth
│   ├── stores/
│   │   └── auth.js                 # Pinia store untuk auth state
│   ├── middleware/
│   │   └── auth.js                 # Route guards & middleware
│   ├── composables/
│   │   └── useAuth.js              # Vue composable untuk auth
│   └── views/auth/
│       ├── Login.vue               # Login form
│       └── Register.vue            # Registration form
```

## Usage

### Basic Authentication

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { 
  user, 
  isAuthenticated, 
  login, 
  logout,
  hasRole,
  hasPermission 
} = useAuth()

// Check if user is logged in
if (isAuthenticated.value) {
  console.log('User:', user.value.name)
}

// Login
const handleLogin = async () => {
  try {
    await login({
      email: 'user@example.com',
      password: 'password123',
      remember_me: true
    })
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}

// Logout
const handleLogout = async () => {
  await logout()
}
</script>
```

### Role & Permission Checks

```vue
<template>
  <!-- Show content berdasarkan role -->
  <div v-if="isAdmin">
    Admin only content
  </div>

  <!-- Show content berdasarkan permission -->
  <button v-if="canManagePatients" @click="addPatient">
    Add Patient
  </button>

  <!-- Multiple role check -->
  <div v-if="hasAnyRole(['doctor', 'nurse'])">
    Medical staff content
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { 
  isAdmin, 
  canManagePatients, 
  hasRole, 
  hasAnyRole,
  hasPermission 
} = useAuth()

// Programmatic checks
if (hasRole('admin')) {
  // Admin specific logic
}

if (hasPermission('user.create')) {
  // User creation logic
}
</script>
```

### Route Protection

```javascript
// router/index.js
import { metaGuard } from '@/middleware/auth'

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminPanel,
    meta: { 
      requiresAuth: true,
      roles: ['admin', 'super_admin']
    }
  },
  {
    path: '/login',
    component: Login,
    meta: { guestOnly: true }
  }
]

router.beforeEach(metaGuard)
```

### Manual Route Guards

```javascript
import { 
  requireAuth, 
  requireRole, 
  requirePermission,
  guestOnly 
} from '@/middleware/auth'

// Protect route yang require authentication
router.beforeEach(requireAuth)

// Protect route untuk admin only
router.beforeEach(requireRole(['admin']))

// Protect route dengan specific permission
router.beforeEach(requirePermission(['user.manage']))

// Redirect authenticated users dari guest pages
router.beforeEach(guestOnly)
```

## API Integration

### Automatic Token Management

```javascript
// services/api.js sudah handle automatic token injection
import ApiService from '@/services/api'

// Token otomatis ditambahkan ke headers
const users = await ApiService.get('/users')

// Auto refresh jika token expired
const profile = await ApiService.get('/auth/profile')
```

### Expected Backend Endpoints

```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration  
POST   /api/auth/logout             # User logout
POST   /api/auth/refresh            # Refresh token
GET    /api/auth/profile            # Get user profile
PUT    /api/auth/profile            # Update user profile
PUT    /api/auth/change-password    # Change password
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
POST   /api/auth/verify-email       # Verify email
POST   /api/auth/resend-verification # Resend verification
```

### Request/Response Format

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": true
}
```

#### Login Response
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "doctor",
    "roles": [
      { "name": "doctor", "permissions": [...] }
    ],
    "permissions": ["patient.view", "patient.create"],
    "email_verified_at": "2024-01-01T00:00:00Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "def50200..."
}
```

## State Management

### Pinia Store

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Reactive state
console.log(authStore.user)
console.log(authStore.isAuthenticated)
console.log(authStore.userRole)

// Actions
await authStore.login(credentials)
await authStore.logout()
await authStore.updateProfile(data)
```

### Local Storage

Authentication data disimpan di localStorage:
- `auth_token` - JWT access token
- `auth_user` - User data object
- `refresh_token` - Refresh token

## Security Features

### Token Refresh
- Automatic token refresh sebelum expired
- Fallback ke logout jika refresh gagal
- Request retry dengan token baru

### Request Interceptors
- Auto-inject Bearer token ke headers
- Request/response logging (development)
- Error handling & normalization

### Route Protection
- Meta-based route guards
- Role & permission checks
- Guest-only routes
- Unauthorized redirects

## Configuration

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Role Mapping

```javascript
// composables/useAuth.js
const roleMap = {
  'admin': 'Administrator',
  'super_admin': 'Super Administrator',
  'doctor': 'Dokter',
  'nurse': 'Perawat',
  'staff': 'Staff'
}
```

## Components

### Login Form
- Email/password validation
- Remember me option
- Password visibility toggle
- Error handling
- Loading states

### Register Form  
- Comprehensive validation
- Password strength indicator
- Role selection
- Terms & conditions
- Real-time error clearing

### Header Component
- User avatar/initials
- User dropdown menu
- Notification bell
- Logout functionality

## Error Handling

### API Errors
```javascript
try {
  await authStore.login(credentials)
} catch (error) {
  if (error.status === 401) {
    // Invalid credentials
  } else if (error.status === 422) {
    // Validation errors
    console.log(error.errors)
  } else if (error.status === 429) {
    // Rate limited
  }
}
```

### Network Errors
```javascript
catch (error) {
  if (error.status === 0) {
    // Network error
  }
}
```

## Best Practices

### Component Usage
```vue
<script setup>
// Prefer composable over direct store access
import { useAuth } from '@/composables/useAuth'
const { user, isAuthenticated } = useAuth()

// NOT: import { useAuthStore } from '@/stores/auth'
</script>
```

### Permission Checks
```vue
<template>
  <!-- Check permissions in template -->
  <button v-if="canManageUsers" @click="editUser">
    Edit User
  </button>
</template>

<script setup>
// Check permissions in script
const { canManageUsers } = useAuth()

const editUser = () => {
  if (!canManageUsers.value) {
    alert('Insufficient permissions')
    return
  }
  // Edit logic
}
</script>
```

### Route Guards
```javascript
// Use meta-based guards untuk declarative approach
meta: { 
  requiresAuth: true,
  roles: ['admin'],
  permissions: ['user.edit']
}

// Use programmatic guards untuk complex logic
beforeEnter: (to, from, next) => {
  if (complexCondition()) {
    next()
  } else {
    next('/unauthorized')
  }
}
```

## Testing

### Mock Authentication
```javascript
// tests/mocks/auth.js
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin'
}

export const mockAuthStore = {
  user: mockUser,
  isAuthenticated: true,
  hasRole: vi.fn(() => true),
  hasPermission: vi.fn(() => true)
}
```

## Troubleshooting

### Common Issues

1. **Token not included in requests**
   - Check if `auth_token` exists in localStorage
   - Verify API service setup

2. **Infinite redirect loops**
   - Check route guard conditions
   - Verify guest-only routes

3. **Permission checks failing**
   - Check user roles/permissions format
   - Verify backend response structure

4. **Auto-logout issues**
   - Check token expiry handling
   - Verify refresh token implementation

### Debug Mode

```javascript
// Enable detailed logging
localStorage.setItem('auth_debug', 'true')

// Check auth state
console.log('Auth Store:', useAuthStore())
console.log('Token:', localStorage.getItem('auth_token'))
```

## Migration Guide

### From Session-based Auth

1. Update backend untuk JWT tokens
2. Replace session checks dengan `isAuthenticated`
3. Update route guards
4. Handle token storage

### Adding New Roles

1. Update backend role system
2. Add role mapping di `useAuth.js`
3. Update permission checks
4. Add route restrictions

---

**Documentation Version**: 1.0.0  
**Last Updated**: December 2024  
**Author**: Klinik Frontend Team