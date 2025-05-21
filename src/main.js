// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css' // Pastikan file ini mengimpor Tailwind CSS

createApp(App)
  .use(router)
  .mount('#app')
