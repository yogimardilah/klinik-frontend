import { createRouter, createWebHistory } from 'vue-router'
import { metaGuard } from '@/middleware/auth'

// Layout components
import Dashboard from '../views/Dashboard.vue'
import Pasien from '../views/pasien/Index.vue'
import DashboardDemo from '../views/DashboardDemo.vue'

// Auth components
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

const routes = [
  // Public routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      guestOnly: true,
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      guestOnly: true,
      title: 'Register'
    }
  },

  // Protected routes (require authentication)
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  {
    path: '/pasien',
    name: 'Pasien',
    component: Pasien,
    meta: { 
      requiresAuth: true,
      title: 'Manajemen Pasien',
      roles: ['admin', 'staff', 'doctor', 'nurse']
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: DashboardDemo,
    meta: { 
      requiresAuth: true,
      title: 'Demo CardStats'
    }
  },

  // Catch all route - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: 'Halaman Tidak Ditemukan'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  // Set page title
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Klinik Management System`
  } else {
    document.title = 'Klinik Management System'
  }

  // Apply meta-based authentication guard
  await metaGuard(to, from, next)
})

// Global after hook for loading states
router.afterEach((to, from) => {
  // You can add global loading state management here
  console.log(`Navigated from ${from.name} to ${to.name}`)
})

export default router
