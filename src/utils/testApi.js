import ApiService from '@/services/api'

/**
 * Test API Connection & Endpoints
 * Script untuk test koneksi ke Laravel backend
 */

export class ApiTester {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    this.results = {
      connection: null,
      endpoints: {},
      errors: []
    }
  }

  /**
   * Test basic API connection
   */
  async testConnection() {
    console.log('🔍 Testing API connection...')
    console.log(`📡 Base URL: ${this.baseURL}`)

    try {
      // Test basic connection
      const response = await fetch(this.baseURL.replace('/api', '/api/health'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        this.results.connection = 'success'
        console.log('✅ API connection successful')
        return true
      } else {
        this.results.connection = 'failed'
        this.results.errors.push(`HTTP ${response.status}: ${response.statusText}`)
        console.log(`❌ API connection failed: ${response.status}`)
        return false
      }
    } catch (error) {
      this.results.connection = 'error'
      this.results.errors.push(error.message)
      console.log(`❌ Connection error: ${error.message}`)
      return false
    }
  }

  /**
   * Test authentication endpoints
   */
  async testAuthEndpoints() {
    console.log('\n🔐 Testing authentication endpoints...')

    const authEndpoints = [
      { method: 'POST', path: '/auth/login', name: 'Login' },
      { method: 'POST', path: '/auth/register', name: 'Register' },
      { method: 'POST', path: '/auth/logout', name: 'Logout' },
      { method: 'POST', path: '/auth/refresh', name: 'Refresh Token' },
      { method: 'GET', path: '/auth/profile', name: 'Get Profile' }
    ]

    for (const endpoint of authEndpoints) {
      await this.testEndpoint(endpoint)
    }
  }

  /**
   * Test API endpoints
   */
  async testApiEndpoints() {
    console.log('\n📋 Testing API endpoints...')

    const apiEndpoints = [
      { method: 'GET', path: '/pasien', name: 'Get Patients' },
      { method: 'GET', path: '/doctor', name: 'Get Doctors' },
      { method: 'GET', path: '/dashboard/stats', name: 'Dashboard Stats' }
    ]

    for (const endpoint of apiEndpoints) {
      await this.testEndpoint(endpoint)
    }
  }

  /**
   * Test individual endpoint
   */
  async testEndpoint({ method, path, name }) {
    try {
      const url = `${this.baseURL}${path}`
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }

      // Handle different response codes
      if (response.status === 200) {
        result.message = 'Success'
        console.log(`✅ ${name}: Success`)
      } else if (response.status === 401) {
        result.message = 'Unauthorized (expected for protected routes)'
        console.log(`🔒 ${name}: Requires authentication`)
      } else if (response.status === 404) {
        result.message = 'Endpoint not found'
        console.log(`❌ ${name}: Not found`)
      } else if (response.status === 405) {
        result.message = 'Method not allowed'
        console.log(`⚠️  ${name}: Method not allowed`)
      } else {
        result.message = `HTTP ${response.status}`
        console.log(`⚠️  ${name}: ${response.status} ${response.statusText}`)
      }

      this.results.endpoints[path] = result

    } catch (error) {
      const result = {
        status: 'error',
        message: error.message
      }
      
      this.results.endpoints[path] = result
      console.log(`❌ ${name}: ${error.message}`)
    }
  }

  /**
   * Test dengan sample data
   */
  async testSampleLogin() {
    console.log('\n🧪 Testing sample login...')

    try {
      const response = await ApiService.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })

      console.log('✅ Sample login test successful')
      console.log('Response:', response)
      return response

    } catch (error) {
      console.log('⚠️  Sample login failed (expected if no test user):', error.message)
      return null
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting API Integration Tests\n')
    console.log('=' * 50)

    // Test basic connection
    const connectionOk = await this.testConnection()
    
    if (connectionOk) {
      // Test endpoints
      await this.testAuthEndpoints()
      await this.testApiEndpoints()
      
      // Test sample login
      await this.testSampleLogin()
    }

    // Print summary
    this.printSummary()
    
    return this.results
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n' + '=' * 50)
    console.log('📊 TEST SUMMARY')
    console.log('=' * 50)

    // Connection status
    console.log(`🔗 Connection: ${this.results.connection || 'not tested'}`)

    // Endpoint results
    const endpoints = Object.keys(this.results.endpoints)
    if (endpoints.length > 0) {
      console.log(`📡 Endpoints tested: ${endpoints.length}`)
      
      const successful = endpoints.filter(path => 
        this.results.endpoints[path].status === 200
      ).length
      
      const needsAuth = endpoints.filter(path => 
        this.results.endpoints[path].status === 401
      ).length

      console.log(`✅ Successful: ${successful}`)
      console.log(`🔒 Needs Auth: ${needsAuth}`)
    }

    // Errors
    if (this.results.errors.length > 0) {
      console.log(`❌ Errors: ${this.results.errors.length}`)
      this.results.errors.forEach(error => console.log(`   - ${error}`))
    }

    console.log('\n💡 Next Steps:')
    if (this.results.connection === 'success') {
      console.log('   1. ✅ API connection works!')
      console.log('   2. 🔧 Setup authentication endpoints in Laravel')
      console.log('   3. 🎯 Test with real login credentials')
      console.log('   4. 📊 Integrate dashboard data')
    } else {
      console.log('   1. 🚨 Start Laravel backend server')
      console.log('   2. 🔧 Check CORS configuration')
      console.log('   3. 📡 Verify API endpoints are accessible')
    }
  }

  /**
   * Test CORS configuration
   */
  async testCORS() {
    console.log('\n🌐 Testing CORS configuration...')

    try {
      const response = await fetch(this.baseURL, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      })

      if (response.ok) {
        console.log('✅ CORS configuration looks good')
        return true
      } else {
        console.log('⚠️  CORS might need configuration')
        return false
      }
    } catch (error) {
      console.log(`❌ CORS test failed: ${error.message}`)
      return false
    }
  }
}

// Export untuk development testing
export const testApi = async () => {
  const tester = new ApiTester()
  return await tester.runAllTests()
}

// Export untuk browser console
if (typeof window !== 'undefined') {
  window.testApi = testApi
  window.ApiTester = ApiTester
}

export default testApi