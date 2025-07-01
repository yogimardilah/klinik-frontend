// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css' // Pastikan file ini mengimpor Tailwind CSS

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize authentication
import { useAuthStore } from '@/stores/auth'
router.isReady().then(() => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
})

app.mount('#app')
