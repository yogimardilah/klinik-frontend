import axios from 'axios'

// Buat instance axios dengan baseURL yang sudah ditentukan
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Timeout 10 detik (optional)
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
