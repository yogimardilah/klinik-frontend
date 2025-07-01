<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Masuk ke Akun Anda
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistem Manajemen Klinik
        </p>
      </div>

      <!-- Alert Messages -->
      <div v-if="message" :class="[
        'rounded-md p-4',
        messageType === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
      ]">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg v-if="messageType === 'error'" class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p :class="[
              'text-sm font-medium',
              messageType === 'error' ? 'text-red-800' : 'text-green-800'
            ]">
              {{ message }}
            </p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="clearMessage" :class="[
              'inline-flex rounded-md text-sm',
              messageType === 'error' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'
            ]">
              <span class="sr-only">Tutup</span>
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1 relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                :class="[
                  'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                  errors.email ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Masukkan email Anda"
              />
              <div v-if="errors.email" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                :class="[
                  'appearance-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                  errors.password ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Masukkan password Anda"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none"
                  :disabled="isLoading"
                >
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember_me"
              type="checkbox"
              :disabled="isLoading"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ingat saya
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
              Lupa password?
            </router-link>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-300 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Belum punya akun?
            <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 ml-1">
              Daftar sekarang
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Form state
const form = ref({
  email: '',
  password: '',
  remember_me: false
})

const errors = ref({})
const message = ref('')
const messageType = ref('error')
const showPassword = ref(false)
const isLoading = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.email && form.value.password && Object.keys(errors.value).length === 0
})

// Methods
const validateForm = () => {
  errors.value = {}

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email wajib diisi'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password wajib diisi'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
  }

  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  clearMessage()

  try {
    await authStore.login(form.value)
    
    // Show success message
    showMessage('Login berhasil! Mengarahkan...', 'success')
    
    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect || '/dashboard'
    setTimeout(() => {
      router.push(redirectTo)
    }, 1000)

  } catch (error) {
    console.error('Login error:', error)
    
    // Handle different error types
    if (error.status === 401) {
      showMessage('Email atau password salah', 'error')
    } else if (error.status === 422) {
      // Validation errors from server
      if (error.data && error.data.errors) {
        errors.value = error.data.errors
      } else {
        showMessage(error.message || 'Data yang dimasukkan tidak valid', 'error')
      }
    } else if (error.status === 429) {
      showMessage('Terlalu banyak percobaan login. Silakan coba lagi nanti.', 'error')
    } else {
      showMessage(error.message || 'Terjadi kesalahan saat login', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const showMessage = (msg, type = 'error') => {
  message.value = msg
  messageType.value = type
}

const clearMessage = () => {
  message.value = ''
  messageType.value = 'error'
}

// Handle query parameters
onMounted(() => {
  // Check for logout message
  if (route.query.message === 'logged_out') {
    showMessage('Anda telah logout berhasil', 'success')
  }
  
  // Check for registration success
  if (route.query.message === 'registered') {
    showMessage('Registrasi berhasil! Silakan login dengan akun Anda.', 'success')
  }
  
  // Check for unauthorized access
  if (route.query.error === 'unauthorized') {
    showMessage('Anda perlu login untuk mengakses halaman tersebut', 'error')
  }

  // Pre-fill email if provided
  if (route.query.email) {
    form.value.email = route.query.email
  }
})

// Watch form changes to clear errors
import { watch } from 'vue'
watch(() => form.value.email, () => {
  if (errors.value.email) {
    delete errors.value.email
  }
})

watch(() => form.value.password, () => {
  if (errors.value.password) {
    delete errors.value.password
  }
})
</script>