<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- 404 Icon -->
      <div>
        <div class="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg class="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-6xl font-bold text-gray-900 mb-4">404</h2>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Halaman Tidak Ditemukan</h3>
        <p class="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Mungkin halaman telah dipindahkan atau URL salah.
        </p>
      </div>

      <!-- Actions -->
      <div class="space-y-4">
        <button 
          @click="goBack"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Kembali ke Halaman Sebelumnya
        </button>
        
        <router-link 
          to="/dashboard"
          class="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Ke Dashboard
        </router-link>
        
        <router-link 
          to="/login"
          class="block w-full text-blue-600 hover:text-blue-500 font-medium py-2 px-4"
        >
          Ke Halaman Login
        </router-link>
      </div>

      <!-- Help Links -->
      <div class="pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">Butuh bantuan?</p>
        <div class="flex justify-center space-x-6">
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Kontak Support</a>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500">FAQ</a>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Dokumentasi</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // Check if there's history to go back to
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}
</script>