<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Buat Akun Baru
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Daftar untuk mengakses Sistem Manajemen Klinik
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

      <!-- Registration Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <div class="mt-1 relative">
              <input
                id="name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                required
                :disabled="isLoading"
                :class="[
                  'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm',
                  errors.name ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Masukkan nama lengkap Anda"
              />
              <div v-if="errors.name" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

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
                  'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm',
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
                autocomplete="new-password"
                required
                :disabled="isLoading"
                :class="[
                  'appearance-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm',
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
            
            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="text-xs text-gray-600 mb-1">Kekuatan password:</div>
              <div class="flex space-x-1">
                <div 
                  v-for="(strength, index) in passwordStrengthBars" 
                  :key="index"
                  :class="[
                    'h-1 flex-1 rounded',
                    strength ? getPasswordStrengthColor() : 'bg-gray-200'
                  ]"
                ></div>
              </div>
              <div class="text-xs mt-1" :class="getPasswordStrengthTextColor()">
                {{ passwordStrengthText }}
              </div>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <div class="mt-1 relative">
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                :type="showPasswordConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                required
                :disabled="isLoading"
                :class="[
                  'appearance-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm',
                  errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Konfirmasi password Anda"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none"
                  :disabled="isLoading"
                >
                  <svg v-if="showPasswordConfirm" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
          </div>

          <!-- Role Selection -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <div class="mt-1">
              <select
                id="role"
                v-model="form.role"
                :disabled="isLoading"
                :class="[
                  'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm',
                  errors.role ? 'border-red-300' : 'border-gray-300'
                ]"
              >
                <option value="">Pilih Role</option>
                <option value="staff">Staff</option>
                <option value="nurse">Perawat</option>
                <option value="doctor">Dokter</option>
              </select>
            </div>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.terms"
            type="checkbox"
            :disabled="isLoading"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            Saya setuju dengan 
            <a href="#" class="text-green-600 hover:text-green-500 font-medium">Syarat & Ketentuan</a>
            dan 
            <a href="#" class="text-green-600 hover:text-green-500 font-medium">Kebijakan Privasi</a>
          </label>
        </div>
        <p v-if="errors.terms" class="mt-1 text-sm text-red-600">{{ errors.terms }}</p>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-green-300 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Memproses...' : 'Daftar' }}
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Sudah punya akun?
            <router-link to="/login" class="font-medium text-green-600 hover:text-green-500 ml-1">
              Masuk sekarang
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  terms: false
})

const errors = ref({})
const message = ref('')
const messageType = ref('error')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isLoading = ref(false)

// Password strength
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0
  
  let strength = 0
  
  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthBars = computed(() => {
  return Array.from({ length: 4 }, (_, i) => i < passwordStrength.value)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength === 1) return 'Sangat Lemah'
  if (strength === 2) return 'Lemah'
  if (strength === 3) return 'Sedang'
  return 'Kuat'
})

const getPasswordStrengthColor = () => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'bg-red-400'
  if (strength === 2) return 'bg-yellow-400'
  if (strength === 3) return 'bg-blue-400'
  return 'bg-green-400'
}

const getPasswordStrengthTextColor = () => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'text-red-600'
  if (strength === 2) return 'text-yellow-600'
  if (strength === 3) return 'text-blue-600'
  return 'text-green-600'
}

// Computed
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password && 
         form.value.password_confirmation &&
         form.value.role &&
         form.value.terms &&
         Object.keys(errors.value).length === 0
})

// Methods
const validateForm = () => {
  errors.value = {}

  // Name validation
  if (!form.value.name) {
    errors.value.name = 'Nama lengkap wajib diisi'
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Nama minimal 2 karakter'
  }

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email wajib diisi'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password wajib diisi'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password minimal 8 karakter'
  } else if (passwordStrength.value < 3) {
    errors.value.password = 'Password terlalu lemah'
  }

  // Password confirmation validation
  if (!form.value.password_confirmation) {
    errors.value.password_confirmation = 'Konfirmasi password wajib diisi'
  } else if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Konfirmasi password tidak cocok'
  }

  // Role validation
  if (!form.value.role) {
    errors.value.role = 'Role wajib dipilih'
  }

  // Terms validation
  if (!form.value.terms) {
    errors.value.terms = 'Anda harus menyetujui syarat & ketentuan'
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  clearMessage()

  try {
    await authStore.register(form.value)
    
    // Show success message
    showMessage('Registrasi berhasil! Mengarahkan ke dashboard...', 'success')
    
    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)

  } catch (error) {
    console.error('Register error:', error)
    
    // Handle different error types
    if (error.status === 422) {
      // Validation errors from server
      if (error.data && error.data.errors) {
        errors.value = error.data.errors
      } else {
        showMessage(error.message || 'Data yang dimasukkan tidak valid', 'error')
      }
    } else if (error.status === 409) {
      showMessage('Email sudah terdaftar. Silakan gunakan email lain.', 'error')
    } else {
      showMessage(error.message || 'Terjadi kesalahan saat registrasi', 'error')
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

// Watch form changes to clear errors
watch(() => form.value.name, () => {
  if (errors.value.name) delete errors.value.name
})

watch(() => form.value.email, () => {
  if (errors.value.email) delete errors.value.email
})

watch(() => form.value.password, () => {
  if (errors.value.password) delete errors.value.password
})

watch(() => form.value.password_confirmation, () => {
  if (errors.value.password_confirmation) delete errors.value.password_confirmation
})

watch(() => form.value.role, () => {
  if (errors.value.role) delete errors.value.role
})

watch(() => form.value.terms, () => {
  if (errors.value.terms) delete errors.value.terms
})
</script>