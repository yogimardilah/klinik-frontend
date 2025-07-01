<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

    <!-- Recent Activities -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 class="text-xl font-semibold mb-4 text-gray-900">Aktivitas Terbaru</h2>
      <div class="space-y-3">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 bg-gray-50 rounded-lg">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span class="text-sm">{{ activity.icon }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Chart Placeholder -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 class="text-xl font-semibold mb-4 text-gray-900">Statistik Mingguan</h2>
      <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <span class="text-4xl mb-2 block">📈</span>
          <p class="text-lg font-medium">Grafik akan ditambahkan</p>
          <p class="text-sm">Chart.js atau library grafik lainnya</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardStats from '@/components/dashboard/CardStats.vue'

// Reactive data
const stats = ref({
  totalPasien: 0,
  totalDokter: 0,
  antrianHariIni: 0
})

const recentActivities = ref([
  {
    id: 1,
    title: 'Pasien baru terdaftar: John Doe',
    time: '5 menit yang lalu',
    icon: '👤'
  },
  {
    id: 2,
    title: 'Appointment selesai: Jane Smith',
    time: '15 menit yang lalu',
    icon: '✅'
  },
  {
    id: 3,
    title: 'Rekam medis diperbarui: Bob Johnson',
    time: '30 menit yang lalu',
    icon: '📝'
  },
  {
    id: 4,
    title: 'Dokter Dr. Wilson check-in',
    time: '1 jam yang lalu',
    icon: '🩺'
  }
])

// Simulate fetching data
const fetchDashboardData = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - replace with actual API calls
    stats.value = {
      totalPasien: 123,
      totalDokter: 12,
      antrianHariIni: 27
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Set default values on error
    stats.value = {
      totalPasien: 0,
      totalDokter: 0,
      antrianHariIni: 0
    }
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
