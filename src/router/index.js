import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Pasien from '../views/pasien/Index.vue'
import DashboardDemo from '../views/DashboardDemo.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/pasien',
    name: 'Pasien',
    component: Pasien
  },
  {
    path: '/demo',
    name: 'Demo',
    component: DashboardDemo
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
