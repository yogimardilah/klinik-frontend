<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          🚀 API Integration Test
        </h1>
        <p class="text-gray-600">
          Test koneksi dan endpoint Laravel backend API
        </p>
        <div class="mt-4 flex justify-center space-x-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Backend: {{ apiBaseUrl }}
          </span>
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            connectionStatus === 'success' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          ]">
            Status: {{ connectionStatus || 'Not tested' }}
          </span>
        </div>
      </div>

      <!-- Test Controls -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div class="flex flex-wrap gap-4 justify-center">
          <button
            @click="runAllTests"
            :disabled="isLoading"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Testing...' : 'Run All Tests' }}
          </button>

          <button
            @click="testConnection"
            :disabled="isLoading"
            class="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Connection
          </button>

          <button
            @click="testAuth"
            :disabled="isLoading"
            class="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Test Auth
          </button>

          <button
            @click="clearResults"
            class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>
      </div>

      <!-- Results Display -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Connection Status -->
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div class="bg-gray-50 px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">🔗 Connection Status</h3>
          </div>
          <div class="p-6">
            <div v-if="!connectionResult" class="text-gray-500 text-center py-8">
              No connection test performed yet
            </div>
            <div v-else>
              <div class="flex items-center mb-4">
                <div :class="[
                  'w-3 h-3 rounded-full mr-3',
                  connectionResult.status === 'success' ? 'bg-green-500' :
                  connectionResult.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                ]"></div>
                <span class="font-medium">{{ connectionResult.message }}</span>
              </div>
              <div class="text-sm text-gray-600">
                <p><strong>URL:</strong> {{ apiBaseUrl }}</p>
                <p><strong>Tested at:</strong> {{ connectionResult.timestamp }}</p>
                <div v-if="connectionResult.error" class="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                  <p class="text-red-800 text-sm">{{ connectionResult.error }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoint Tests -->
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div class="bg-gray-50 px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">📡 Endpoint Tests</h3>
          </div>
          <div class="p-6">
            <div v-if="Object.keys(endpointResults).length === 0" class="text-gray-500 text-center py-8">
              No endpoint tests performed yet
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="(result, endpoint) in endpointResults" 
                :key="endpoint"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <div :class="[
                    'w-2 h-2 rounded-full mr-3',
                    result.status === 200 ? 'bg-green-500' :
                    result.status === 401 ? 'bg-yellow-500' :
                    result.status === 404 ? 'bg-red-500' : 'bg-gray-500'
                  ]"></div>
                  <span class="text-sm font-medium">{{ endpoint }}</span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ result.status }} {{ result.message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Logs -->
      <div class="mt-8 bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">📋 Test Logs</h3>
        </div>
        <div class="p-6">
          <div v-if="logs.length === 0" class="text-gray-500 text-center py-8">
            No logs yet. Run a test to see detailed results.
          </div>
          <div v-else class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="(log, index) in logs" 
              :key="index"
              :class="[
                'text-sm p-3 rounded font-mono',
                log.type === 'success' ? 'bg-green-50 text-green-800' :
                log.type === 'error' ? 'bg-red-50 text-red-800' :
                log.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                'bg-gray-50 text-gray-800'
              ]"
            >
              <span class="text-gray-500">{{ log.timestamp }}</span> - {{ log.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Guide -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">💡 Setup Guide</h3>
        <div class="space-y-3 text-sm text-blue-800">
          <div>
            <strong>1. Start Laravel Backend:</strong>
            <code class="ml-2 px-2 py-1 bg-blue-100 rounded">php artisan serve</code>
          </div>
          <div>
            <strong>2. Configure CORS:</strong>
            <p class="ml-4 mt-1">Enable CORS for frontend domain in Laravel config</p>
          </div>
          <div>
            <strong>3. Setup Authentication:</strong>
            <p class="ml-4 mt-1">Install Laravel Sanctum for API authentication</p>
          </div>
          <div>
            <strong>4. Environment:</strong>
            <p class="ml-4 mt-1">Check .env file for correct API_BASE_URL</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ApiTester } from '@/utils/testApi'

// State
const isLoading = ref(false)
const connectionResult = ref(null)
const endpointResults = ref({})
const logs = ref([])
const tester = ref(null)

// Computed
const apiBaseUrl = computed(() => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
})

const connectionStatus = computed(() => {
  return connectionResult.value?.status || null
})

// Methods
const addLog = (message, type = 'info') => {
  logs.value.push({
    message,
    type,
    timestamp: new Date().toLocaleTimeString()
  })
}

const testConnection = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  addLog('Starting connection test...', 'info')

  try {
    tester.value = new ApiTester()
    const success = await tester.value.testConnection()
    
    connectionResult.value = {
      status: success ? 'success' : 'failed',
      message: success ? 'Connection successful' : 'Connection failed',
      timestamp: new Date().toLocaleString(),
      error: success ? null : tester.value.results.errors.join(', ')
    }

    addLog(
      success ? 'Connection test passed' : 'Connection test failed', 
      success ? 'success' : 'error'
    )

  } catch (error) {
    connectionResult.value = {
      status: 'error',
      message: 'Connection error',
      timestamp: new Date().toLocaleString(),
      error: error.message
    }
    addLog(`Connection error: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
  }
}

const testAuth = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  addLog('Testing authentication endpoints...', 'info')

  try {
    if (!tester.value) {
      tester.value = new ApiTester()
    }

    await tester.value.testAuthEndpoints()
    endpointResults.value = { ...tester.value.results.endpoints }
    
    addLog('Authentication endpoints tested', 'success')

  } catch (error) {
    addLog(`Auth test error: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
  }
}

const runAllTests = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  clearResults()
  addLog('Starting comprehensive API tests...', 'info')

  try {
    tester.value = new ApiTester()
    const results = await tester.value.runAllTests()
    
    // Update results
    connectionResult.value = {
      status: results.connection,
      message: results.connection === 'success' ? 'Connection successful' : 'Connection failed',
      timestamp: new Date().toLocaleString(),
      error: results.errors.length > 0 ? results.errors.join(', ') : null
    }
    
    endpointResults.value = { ...results.endpoints }
    
    addLog('All tests completed', 'success')

    // Add summary to logs
    const successCount = Object.values(results.endpoints).filter(r => r.status === 200).length
    const totalCount = Object.keys(results.endpoints).length
    addLog(`Results: ${successCount}/${totalCount} endpoints successful`, 'info')

  } catch (error) {
    addLog(`Test suite error: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
  }
}

const clearResults = () => {
  connectionResult.value = null
  endpointResults.value = {}
  logs.value = []
  addLog('Results cleared', 'info')
}

// Mount
onMounted(() => {
  addLog('API Test page loaded', 'info')
  addLog(`Target API: ${apiBaseUrl.value}`, 'info')
})
</script>