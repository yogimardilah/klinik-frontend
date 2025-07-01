<template>
  <div class="max-w-7xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Daftar Pasien</h2>
      <div class="flex space-x-2">
        <button 
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Memuat...' : 'Refresh' }}
        </button>
        <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          + Tambah Pasien
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <button 
            @click="clearError" 
            class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded">
            <span class="text-blue-600 text-xl">👥</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-900">Total Pasien</p>
            <p class="text-lg font-bold text-blue-700">{{ pagination.total || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded">
            <span class="text-green-600 text-xl">👤</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-900">Pasien Baru (Minggu Ini)</p>
            <p class="text-lg font-bold text-green-700">{{ stats.pasienBaruMingguIni || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded">
            <span class="text-purple-600 text-xl">📊</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-purple-900">Halaman Saat Ini</p>
            <p class="text-lg font-bold text-purple-700">{{ pagination.current_page || 1 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls: Dropdown perPage + Search -->
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <!-- Left side controls -->
      <div class="flex items-center space-x-4">
        <!-- Dropdown perPage -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-700">Tampilkan:</label>
          <select 
            v-model="perPage" 
            @change="handlePerPageChange" 
            class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span class="text-sm text-gray-500">per halaman</span>
        </div>
      </div>

      <!-- Right side controls -->
      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <!-- Search Input -->
        <div class="relative flex-1 sm:flex-none">
          <input
            type="text"
            v-model="search"
            placeholder="Cari pasien (nama, NIK, no HP)..."
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
          />
          <div v-if="search" class="absolute right-2 top-2">
            <button 
              @click="clearSearch" 
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && pasiens.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="text-gray-500 mt-4">Memuat data pasien...</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  @click="toggleSort('nama')"
                  class="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Nama</span>
                  <svg v-if="sortBy === 'nama'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="sortOrder === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
                  </svg>
                </button>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No HP</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  @click="toggleSort('tanggal_lahir')"
                  class="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Tanggal Lahir</span>
                  <svg v-if="sortBy === 'tanggal_lahir'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="sortOrder === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
                  </svg>
                </button>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- No data state -->
            <tr v-if="!loading && pasiens.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <p class="text-lg font-medium text-gray-900 mb-1">
                    {{ search ? 'Tidak ada pasien yang ditemukan' : 'Belum ada data pasien' }}
                  </p>
                  <p class="text-gray-500">
                    {{ search ? `untuk pencarian "${search}"` : 'Tambahkan pasien baru untuk memulai' }}
                  </p>
                  <button 
                    v-if="search" 
                    @click="clearSearch"
                    class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Hapus Filter
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Data rows -->
            <tr v-else v-for="pasien in pasiens" :key="pasien.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold">{{ getInitials(pasien.nama) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ pasien.nama }}</div>
                    <div v-if="pasien.email" class="text-sm text-gray-500">{{ pasien.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="font-mono">{{ pasien.nik }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ pasien.no_hp || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {{ pasien.alamat || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(pasien.tanggal_lahir) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  pasien.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                ]">
                  {{ pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button class="text-blue-600 hover:text-blue-900">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="text-green-600 hover:text-green-900">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="confirmDelete(pasien)" class="text-red-600 hover:text-red-900">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
      <!-- Pagination Info -->
      <div class="text-sm text-gray-700">
        Menampilkan {{ pagination.from || 0 }} sampai {{ pagination.to || 0 }} 
        dari {{ pagination.total || 0 }} hasil
      </div>
      
      <!-- Pagination Controls -->
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1 || loading"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>
        
        <template v-for="page in paginationPages" :key="page">
          <button
            v-if="page !== '...'"
            @click="changePage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === pagination.current_page
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            ]"
            :disabled="loading"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        </template>
        
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page || loading"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import PasienService from '@/services/pasienService'
import DashboardService from '@/services/dashboardService'

const pasiens = ref([])
const perPage = ref(10)
const loading = ref(false)
const error = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0
})

const stats = ref({
  pasienBaruMingguIni: 0
})

// Search and sorting
const search = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')
let debounceTimeout = null

// Computed pagination pages
const paginationPages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    }
  }
  
  return pages
})

const fetchPasiens = async (page = 1) => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {
      page,
      per_page: perPage.value,
      search: search.value,
      sort_by: sortBy.value,
      sort_order: sortOrder.value
    }
    
    const response = await PasienService.getAll(params)
    pasiens.value = response.data
    pagination.value = response.pagination
  } catch (err) {
    console.error('Gagal fetch data pasien:', err)
    error.value = err.message || 'Gagal memuat data pasien'
    pasiens.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await DashboardService.getStats()
    stats.value.pasienBaruMingguIni = response.pasienBaruMingguIni || 0
  } catch (err) {
    console.error('Gagal memuat statistik:', err)
  }
}

const refreshData = () => {
  fetchPasiens(pagination.value.current_page)
  loadStats()
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page && !loading.value) {
    fetchPasiens(page)
  }
}

const handlePerPageChange = () => {
  fetchPasiens(1) // Reset to page 1 when changing per page
}

const clearSearch = () => {
  search.value = ''
}

const clearError = () => {
  error.value = ''
}

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  fetchPasiens(1)
}

const confirmDelete = (pasien) => {
  if (confirm(`Apakah Anda yakin ingin menghapus pasien ${pasien.nama}?`)) {
    deletePasien(pasien.id)
  }
}

const deletePasien = async (id) => {
  try {
    await PasienService.delete(id)
    // Refresh data after delete
    fetchPasiens(pagination.value.current_page)
  } catch (err) {
    console.error('Gagal menghapus pasien:', err)
    error.value = err.message || 'Gagal menghapus pasien'
  }
}

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Watch search with debounce
watch(search, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchPasiens(1) // Reset to page 1 when searching
  }, 500)
})

onMounted(() => {
  fetchPasiens(1)
  loadStats()
})
</script>
