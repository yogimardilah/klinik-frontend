<template>
  <header class="flex items-center justify-between p-4 bg-white shadow">
    <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
    
    <div class="flex items-center space-x-4">
      <!-- Notifications Bell -->
      <div class="relative">
        <button 
          @click="toggleNotifications"
          class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a3 3 0 00-6 0v5zM9 7V5a3 3 0 116 0v2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17v-2a6 6 0 00-6-6v-2"/>
          </svg>
          <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div class="px-4 py-2 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-900">Notifikasi</h3>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
              Tidak ada notifikasi
            </div>
            <div v-else v-for="notification in notifications" :key="notification.id" class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
              <p class="text-sm text-gray-900">{{ notification.title }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
            </div>
          </div>
          <div class="px-4 py-2 border-t border-gray-200">
            <button class="text-sm text-blue-600 hover:text-blue-500">Lihat semua</button>
          </div>
        </div>
      </div>

      <!-- User Menu -->
      <div class="relative">
        <!-- User Avatar Button -->
        <button 
          @click="toggleUserMenu"
          class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <!-- Avatar -->
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <img 
              v-if="authStore.userAvatar" 
              :src="authStore.userAvatar" 
              :alt="authStore.user?.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <span v-else class="text-blue-600 font-semibold text-sm">
              {{ authStore.userInitials }}
            </span>
          </div>
          
          <!-- User Info -->
          <div class="hidden sm:block text-left">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name || 'User' }}</p>
            <p class="text-xs text-gray-500">{{ authStore.userRole || 'Staff' }}</p>
          </div>

          <!-- Dropdown Arrow -->
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- User Dropdown Menu -->
        <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <!-- User Info in Dropdown -->
          <div class="px-4 py-3 border-b border-gray-200">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
              {{ authStore.userRole || 'Staff' }}
            </span>
          </div>

          <!-- Menu Items -->
          <div class="py-1">
            <router-link 
              to="/profile" 
              @click="closeUserMenu"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Profil Saya
            </router-link>

            <router-link 
              to="/settings" 
              @click="closeUserMenu"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Pengaturan
            </router-link>

            <router-link 
              to="/help" 
              @click="closeUserMenu"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Bantuan
            </router-link>
          </div>

          <!-- Logout -->
          <div class="border-t border-gray-200 py-1">
            <button 
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <svg v-if="isLoggingOut" class="w-4 h-4 mr-3 text-red-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              {{ isLoggingOut ? 'Logout...' : 'Logout' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Component state
const showUserMenu = ref(false)
const showNotifications = ref(false)
const isLoggingOut = ref(false)
const notifications = ref([
  { id: 1, title: 'Pasien baru terdaftar', time: '2 menit yang lalu' },
  { id: 2, title: 'Appointment dikonfirmasi', time: '5 menit yang lalu' },
  { id: 3, title: 'Hasil lab tersedia', time: '10 menit yang lalu' }
])

// Computed
const title = computed(() => {
  return route.meta?.title || route.name || 'Dashboard'
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showNotifications.value = false
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    showUserMenu.value = false
  }
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const closeNotifications = () => {
  showNotifications.value = false
}

const handleLogout = async () => {
  if (isLoggingOut.value) return

  const confirmed = confirm('Apakah Anda yakin ingin logout?')
  if (!confirmed) return

  isLoggingOut.value = true
  closeUserMenu()

  try {
    await authStore.logout()
    router.push({ name: 'Login', query: { message: 'logged_out' } })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const userMenu = event.target.closest('[data-user-menu]')
  const notifications = event.target.closest('[data-notifications]')
  
  if (!userMenu) {
    showUserMenu.value = false
  }
  
  if (!notifications) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
