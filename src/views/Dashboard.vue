<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div class="flex items-center space-x-2">
        <button 
          @click="refreshData"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Memuat...' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardStats 
        title="Total Pasien" 
        :value="stats.totalPasien" 
        icon="👨‍⚕️"
        subtitle="Pasien terdaftar"
        :trend="trends.totalPasien"
      />
      <CardStats 
        title="Total Dokter" 
        :value="stats.totalDokter" 
        icon="🩺"
        subtitle="Dokter aktif"
        :trend="trends.totalDokter"
      />
      <CardStats 
        title="Antrian Hari Ini" 
        :value="stats.antrianHariIni" 
        icon="📋"
        subtitle="Pasien menunggu"
        :trend="trends.antrianHariIni"
      />
      <CardStats 
        title="Total Appointment" 
        :value="stats.totalAppointment" 
        icon="📅"
        subtitle="Bulan ini"
        :trend="trends.totalAppointment"
      />
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded">
            <span class="text-green-600 text-xl">✅</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-900">Selesai Hari Ini</p>
            <p class="text-lg font-bold text-green-700">{{ quickStats.completedAppointments }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded">
            <span class="text-yellow-600 text-xl">⏳</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-yellow-900">Sedang Menunggu</p>
            <p class="text-lg font-bold text-yellow-700">{{ quickStats.waitingPatients }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded">
            <span class="text-blue-600 text-xl">👨‍⚕️</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-900">Dokter Tersedia</p>
            <p class="text-lg font-bold text-blue-700">{{ quickStats.availableDoctors }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded">
            <span class="text-red-600 text-xl">🚨</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-900">Emergency</p>
            <p class="text-lg font-bold text-red-700">{{ quickStats.emergencyCases }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 class="text-xl font-semibold mb-4 text-gray-900">Aksi Cepat</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link 
          to="/pasien" 
          class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
        >
          <span class="text-2xl mr-3">👥</span>
          <span class="font-medium text-blue-900">Kelola Pasien</span>
        </router-link>
        
        <button class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200">
          <span class="text-2xl mr-3">📅</span>
          <span class="font-medium text-green-900">Buat Appointment</span>
        </button>
        
        <button class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 border border-purple-200">
          <span class="text-2xl mr-3">📋</span>
          <span class="font-medium text-purple-900">Rekam Medis</span>
        </button>
        
        <button class="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 border border-orange-200">
          <span class="text-2xl mr-3">📊</span>
          <span class="font-medium text-orange-900">Laporan</span>
        </button>
      </div>
    </div>

    <!-- Recent Activities & Notifications Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activities -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
          <button @click="loadActivities" class="text-sm text-blue-600 hover:text-blue-800">
            Muat Ulang
          </button>
        </div>
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div v-if="loadingActivities" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-sm text-gray-500 mt-2">Memuat aktivitas...</p>
          </div>
          <div v-else-if="recentActivities.length === 0" class="text-center py-8">
            <p class="text-gray-500">Tidak ada aktivitas terbaru</p>
          </div>
          <div v-else v-for="activity in recentActivities" :key="activity.id" class="flex items-start p-3 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span class="text-sm">{{ activity.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
              <p v-if="activity.description" class="text-xs text-gray-600 mt-1">{{ activity.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Notifikasi</h2>
          <span v-if="unreadCount > 0" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {{ unreadCount }} baru
          </span>
        </div>
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div v-if="notifications.length === 0" class="text-center py-8">
            <p class="text-gray-500">Tidak ada notifikasi</p>
          </div>
          <div 
            v-else 
            v-for="notification in notifications" 
            :key="notification.id" 
            :class="[
              'p-3 rounded-lg border cursor-pointer transition-colors',
              notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
            ]"
            @click="markAsRead(notification.id)"
          >
            <div class="flex items-start">
              <div :class="[
                'w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0',
                notification.read ? 'bg-gray-400' : 'bg-blue-500'
              ]"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Statistik Mingguan</h2>
        <select v-model="selectedMetric" @change="loadChartData" class="border border-gray-300 rounded px-3 py-1 text-sm">
          <option value="patients">Pasien</option>
          <option value="appointments">Appointment</option>
          <option value="revenue">Pendapatan</option>
        </select>
      </div>
      <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <span class="text-4xl mb-2 block">📈</span>
          <p class="text-lg font-medium">Chart untuk {{ selectedMetric }}</p>
          <p class="text-sm">Integrasikan dengan Chart.js atau library grafik lainnya</p>
          <button 
            @click="loadChartData" 
            class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Load Chart Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CardStats from '@/components/dashboard/CardStats.vue'
import DashboardService from '@/services/dashboardService'

// Reactive data
const isLoading = ref(false)
const loadingActivities = ref(false)

const stats = ref({
  totalPasien: 0,
  totalDokter: 0,
  antrianHariIni: 0,
  totalAppointment: 0
})

const quickStats = ref({
  completedAppointments: 0,
  waitingPatients: 0,
  availableDoctors: 0,
  emergencyCases: 0
})

const trends = ref({
  totalPasien: null,
  totalDokter: null,
  antrianHariIni: null,
  totalAppointment: null
})

const recentActivities = ref([])
const notifications = ref([])
const selectedMetric = ref('patients')
const chartData = ref(null)

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
const refreshData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadQuickStats(),
      loadActivities(),
      loadNotifications(),
      loadTrends()
    ])
  } catch (error) {
    console.error('Error refreshing dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await DashboardService.getStats()
    stats.value = response
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadQuickStats = async () => {
  try {
    const response = await DashboardService.getQuickStats()
    quickStats.value = response
  } catch (error) {
    console.error('Error loading quick stats:', error)
  }
}

const loadActivities = async () => {
  loadingActivities.value = true
  try {
    const response = await DashboardService.getRecentActivities(5)
    recentActivities.value = response
  } catch (error) {
    console.error('Error loading activities:', error)
  } finally {
    loadingActivities.value = false
  }
}

const loadNotifications = async () => {
  try {
    const response = await DashboardService.getNotifications()
    notifications.value = response
  } catch (error) {
    console.error('Error loading notifications:', error)
  }
}

const loadTrends = async () => {
  try {
    const [pasienTrend, dokterTrend, antrianTrend, appointmentTrend] = await Promise.all([
      DashboardService.getTrendData('patients'),
      DashboardService.getTrendData('doctors'),
      DashboardService.getTrendData('queue'),
      DashboardService.getTrendData('appointments')
    ])
    
    trends.value = {
      totalPasien: pasienTrend,
      totalDokter: dokterTrend,
      antrianHariIni: antrianTrend,
      totalAppointment: appointmentTrend
    }
  } catch (error) {
    console.error('Error loading trends:', error)
  }
}

const loadChartData = async () => {
  try {
    const response = await DashboardService.getChartData('weekly', selectedMetric.value)
    chartData.value = response
    console.log('Chart data loaded:', response)
  } catch (error) {
    console.error('Error loading chart data:', error)
  }
}

const markAsRead = async (notificationId) => {
  try {
    await DashboardService.markNotificationAsRead(notificationId)
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

// Initialize data
onMounted(() => {
  refreshData()
})
</script>
