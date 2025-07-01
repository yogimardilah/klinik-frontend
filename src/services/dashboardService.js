import ApiService from './api'

/**
 * Service untuk Dashboard data dan statistik
 * Endpoint yang diasumsikan dari backend:
 * GET /api/dashboard/stats     - Statistik umum dashboard
 * GET /api/dashboard/activities - Aktivitas terbaru
 * GET /api/dashboard/charts    - Data untuk charts/grafik
 */
class DashboardService {
  constructor() {
    this.baseUrl = '/dashboard'
  }

  /**
   * Get statistik utama untuk dashboard
   * @returns {Promise<Object>} Statistik dashboard
   */
  async getStats() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/stats`)
      
      // Default fallback jika backend belum ready
      const defaultStats = {
        totalPasien: 0,
        totalDokter: 0,
        antrianHariIni: 0,
        totalAppointment: 0,
        pendapatanBulanIni: 0,
        pasienBaruMingguIni: 0,
        tingkatKepuasan: 0,
        waktuTungguRataRata: 0
      }

      return {
        ...defaultStats,
        ...(response.data || response)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      
      // Return mock data jika API tidak tersedia
      return {
        totalPasien: Math.floor(Math.random() * 500) + 100,
        totalDokter: Math.floor(Math.random() * 30) + 10,
        antrianHariIni: Math.floor(Math.random() * 50) + 5,
        totalAppointment: Math.floor(Math.random() * 200) + 50,
        pendapatanBulanIni: Math.floor(Math.random() * 10000000) + 5000000,
        pasienBaruMingguIni: Math.floor(Math.random() * 20) + 5,
        tingkatKepuasan: (Math.random() * 2 + 3.5).toFixed(1),
        waktuTungguRataRata: Math.floor(Math.random() * 30) + 15
      }
    }
  }

  /**
   * Get aktivitas terbaru untuk dashboard
   * @param {number} limit - Jumlah aktivitas yang ditampilkan
   * @returns {Promise<Array>} Array aktivitas terbaru
   */
  async getRecentActivities(limit = 10) {
    try {
      const response = await ApiService.get(`${this.baseUrl}/activities`, { limit })
      return response.data || response || []
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      
      // Return mock data jika API tidak tersedia
      return [
        {
          id: 1,
          type: 'pasien_baru',
          title: 'Pasien baru terdaftar: John Doe',
          description: 'Pasien baru dengan NIK 1234567890123456',
          time: '5 menit yang lalu',
          icon: '👤',
          user: 'Admin',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          type: 'appointment_selesai',
          title: 'Appointment selesai: Jane Smith',
          description: 'Pemeriksaan umum telah selesai',
          time: '15 menit yang lalu',
          icon: '✅',
          user: 'Dr. Wilson',
          created_at: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          id: 3,
          type: 'rekam_medis',
          title: 'Rekam medis diperbarui: Bob Johnson',
          description: 'Hasil lab telah ditambahkan',
          time: '30 menit yang lalu',
          icon: '📝',
          user: 'Dr. Sarah',
          created_at: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
          id: 4,
          type: 'dokter_checkin',
          title: 'Dokter Dr. Wilson check-in',
          description: 'Dokter telah memulai shift',
          time: '1 jam yang lalu',
          icon: '🩺',
          user: 'System',
          created_at: new Date(Date.now() - 60 * 60000).toISOString()
        }
      ]
    }
  }

  /**
   * Get data untuk chart/grafik dashboard
   * @param {string} type - Tipe chart (weekly, monthly, yearly)
   * @param {string} metric - Metric yang ditampilkan (patients, revenue, appointments)
   * @returns {Promise<Object>} Data chart
   */
  async getChartData(type = 'weekly', metric = 'patients') {
    try {
      const response = await ApiService.get(`${this.baseUrl}/charts`, { type, metric })
      return response.data || response
    } catch (error) {
      console.error('Error fetching chart data:', error)
      
      // Return mock data untuk chart
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      const data = days.map(() => Math.floor(Math.random() * 50) + 10)
      
      return {
        labels: days,
        datasets: [{
          label: this.getMetricLabel(metric),
          data: data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }]
      }
    }
  }

  /**
   * Get summary untuk quick stats cards
   * @returns {Promise<Object>} Quick stats data
   */
  async getQuickStats() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/quick-stats`)
      return response.data || response
    } catch (error) {
      console.error('Error fetching quick stats:', error)
      
      // Return mock quick stats
      return {
        todayAppointments: Math.floor(Math.random() * 20) + 5,
        waitingPatients: Math.floor(Math.random() * 10) + 2,
        availableDoctors: Math.floor(Math.random() * 8) + 3,
        emergencyCases: Math.floor(Math.random() * 3),
        completedAppointments: Math.floor(Math.random() * 15) + 10,
        cancelledAppointments: Math.floor(Math.random() * 3),
        newPatients: Math.floor(Math.random() * 8) + 2,
        revenue: Math.floor(Math.random() * 5000000) + 1000000
      }
    }
  }

  /**
   * Get data untuk notification/alerts
   * @returns {Promise<Array>} Array notifications
   */
  async getNotifications() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/notifications`)
      return response.data || response || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      
      // Return mock notifications
      return [
        {
          id: 1,
          type: 'warning',
          title: 'Stok obat menipis',
          message: 'Paracetamol tersisa 10 tablet',
          time: '2 jam yang lalu',
          read: false
        },
        {
          id: 2,
          type: 'info',
          title: 'Appointment baru',
          message: '3 appointment baru untuk hari ini',
          time: '4 jam yang lalu',
          read: false
        },
        {
          id: 3,
          type: 'success',
          title: 'Backup berhasil',
          message: 'Backup database selesai',
          time: '6 jam yang lalu',
          read: true
        }
      ]
    }
  }

  /**
   * Mark notification sebagai read
   * @param {number} notificationId - ID notification
   * @returns {Promise<Object>} Response
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await ApiService.post(`${this.baseUrl}/notifications/${notificationId}/read`)
      return response
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Get trend data untuk statistik cards
   * @param {string} metric - Metric yang ingin dilihat trendnya
   * @param {string} period - Period comparison (day, week, month)
   * @returns {Promise<Object>} Trend data
   */
  async getTrendData(metric, period = 'month') {
    try {
      const response = await ApiService.get(`${this.baseUrl}/trends`, { metric, period })
      return response.data || response
    } catch (error) {
      console.error('Error fetching trend data:', error)
      
      // Return mock trend data
      const trends = ['increase', 'decrease']
      const randomTrend = trends[Math.floor(Math.random() * trends.length)]
      const value = Math.floor(Math.random() * 30) + 1
      
      return {
        type: randomTrend,
        value: value,
        period: `dari ${period} lalu`
      }
    }
  }

  /**
   * Helper function untuk get label metric
   * @param {string} metric - Metric name
   * @returns {string} Human readable label
   */
  getMetricLabel(metric) {
    const labels = {
      patients: 'Pasien',
      revenue: 'Pendapatan',
      appointments: 'Appointment',
      satisfaction: 'Kepuasan'
    }
    
    return labels[metric] || metric
  }

  /**
   * Get system health status
   * @returns {Promise<Object>} System health data
   */
  async getSystemHealth() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/health`)
      return response.data || response
    } catch (error) {
      console.error('Error fetching system health:', error)
      
      // Return mock system health
      return {
        status: 'healthy',
        uptime: '99.9%',
        lastBackup: '2 jam yang lalu',
        storageUsed: '65%',
        memoryUsage: '45%',
        cpuUsage: '23%'
      }
    }
  }
}

export default new DashboardService()