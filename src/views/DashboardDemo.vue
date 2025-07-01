<template>
  <div class="space-y-8 p-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Demo</h1>
      <p class="text-gray-600">Demonstrasi CardStats Component dengan berbagai fitur</p>
    </div>

    <!-- Basic CardStats -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Basic CardStats</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardStats 
          title="Total Pasien" 
          :value="stats.totalPasien" 
          icon="👨‍⚕️"
          subtitle="Pasien terdaftar"
          :trend="{ type: 'increase', value: 12 }"
        />
        <CardStats 
          title="Total Dokter" 
          :value="stats.totalDokter" 
          icon="🩺"
          subtitle="Dokter aktif"
          :trend="{ type: 'increase', value: 5 }"
        />
        <CardStats 
          title="Antrian Hari Ini" 
          :value="stats.antrianHariIni" 
          icon="📋"
          subtitle="Pasien menunggu"
          :trend="{ type: 'decrease', value: 8 }"
        />
      </div>
    </section>

    <!-- Advanced CardStats -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Advanced CardStats</h2>
      
      <!-- Controls -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button 
          @click="toggleLoading" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ isLoading ? 'Stop Loading' : 'Show Loading' }}
        </button>
        <button 
          @click="toggleError" 
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {{ hasError ? 'Clear Error' : 'Show Error' }}
        </button>
        <button 
          @click="refreshData" 
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Data
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Loading State -->
        <CardStatsAdvanced 
          title="Revenue Bulanan" 
          :value="advancedStats.revenue" 
          icon="💰"
          subtitle="Total pendapatan"
          :loading="isLoading"
          iconColor="bg-green-100"
          :trend="{ type: 'increase', value: 15, period: 'dari bulan lalu' }"
        />
        
        <!-- Error State -->
        <CardStatsAdvanced 
          title="Appointment Selesai" 
          :value="advancedStats.completedAppointments" 
          icon="✅"
          subtitle="Hari ini"
          :error="hasError ? 'Gagal memuat data' : ''"
          :onRetry="retryFetch"
          iconColor="bg-purple-100"
        />
        
        <!-- Clickable -->
        <CardStatsAdvanced 
          title="Rating Kepuasan" 
          :value="advancedStats.satisfaction" 
          icon="⭐"
          subtitle="Rata-rata rating"
          :clickable="true"
          actionLabel="Lihat Detail"
          iconColor="bg-yellow-100"
          :trend="{ type: 'increase', value: 3, period: 'dari minggu lalu' }"
          @click="handleCardClick"
          @action="handleActionClick"
        />
        
        <!-- Animated -->
        <CardStatsAdvanced 
          title="Waktu Tunggu Rata-rata" 
          :value="advancedStats.averageWaitTime"
          icon="⏰"
          subtitle="Menit"
          iconColor="bg-orange-100"
          :animationDuration="2000"
          :trend="{ type: 'decrease', value: 20, period: 'dari kemarin' }"
        />
      </div>
    </section>

    <!-- Different Icon Colors -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Custom Icon Colors</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardStatsAdvanced 
          title="Emergency" 
          value="3" 
          icon="🚨"
          iconColor="bg-red-100"
          :trend="{ type: 'increase', value: 1 }"
        />
        <CardStatsAdvanced 
          title="Surgery" 
          value="8" 
          icon="🏥"
          iconColor="bg-blue-100"
          :trend="{ type: 'decrease', value: 2 }"
        />
        <CardStatsAdvanced 
          title="Lab Tests" 
          value="45" 
          icon="🧪"
          iconColor="bg-green-100"
          :trend="{ type: 'increase', value: 12 }"
        />
        <CardStatsAdvanced 
          title="Pharmacy" 
          value="67" 
          icon="💊"
          iconColor="bg-purple-100"
          :trend="{ type: 'increase', value: 8 }"
        />
        <CardStatsAdvanced 
          title="Radiology" 
          value="23" 
          icon="📷"
          iconColor="bg-gray-100"
          :trend="{ type: 'decrease', value: 5 }"
        />
      </div>
    </section>

    <!-- Notification Area -->
    <div v-if="notification" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ notification }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardStats from '@/components/dashboard/CardStats.vue'
import CardStatsAdvanced from '@/components/dashboard/CardStatsAdvanced.vue'

// Basic stats
const stats = ref({
  totalPasien: 0,
  totalDokter: 0,
  antrianHariIni: 0
})

// Advanced stats
const advancedStats = ref({
  revenue: 0,
  completedAppointments: 0,
  satisfaction: 0,
  averageWaitTime: 0
})

// Component states
const isLoading = ref(false)
const hasError = ref(false)
const notification = ref('')

// Methods
const toggleLoading = () => {
  isLoading.value = !isLoading.value
}

const toggleError = () => {
  hasError.value = !hasError.value
}

const refreshData = async () => {
  isLoading.value = true
  hasError.value = false
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update data with random values
    stats.value = {
      totalPasien: Math.floor(Math.random() * 500) + 100,
      totalDokter: Math.floor(Math.random() * 20) + 10,
      antrianHariIni: Math.floor(Math.random() * 50) + 10
    }
    
    advancedStats.value = {
      revenue: Math.floor(Math.random() * 1000000) + 500000,
      completedAppointments: Math.floor(Math.random() * 50) + 20,
      satisfaction: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      averageWaitTime: Math.floor(Math.random() * 30) + 15
    }
    
    showNotification('Data berhasil diperbarui!')
  } catch (error) {
    hasError.value = true
    showNotification('Gagal memperbarui data')
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => {
  hasError.value = false
  refreshData()
}

const handleCardClick = () => {
  showNotification('Card diklik! Navigasi ke halaman detail...')
}

const handleActionClick = () => {
  showNotification('Action button diklik! Membuka modal detail...')
}

const showNotification = (message) => {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

// Initialize data
onMounted(() => {
  refreshData()
})
</script>