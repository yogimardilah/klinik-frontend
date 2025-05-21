<template>
  <div class="w-64 bg-gray-800 text-white min-h-screen">
    <div class="p-4 font-bold text-lg">Admin Panel</div>
    <nav class="mt-4">
      <router-link to="/" class="flex items-center px-4 py-2 hover:bg-gray-700">
        <HomeIcon class="w-6 h-6 mr-3" />
        <span>Dashboard</span>
      </router-link>
      <router-link to="/pasien" class="flex items-center px-4 py-2 hover:bg-gray-700 mt-2">
        <UserGroupIcon class="w-6 h-6 mr-3" />
        <span>Pasien</span>
      </router-link>
      <!-- Tambahkan tautan lain sesuai kebutuhan -->
    </nav>
  </div>
</template>

<script setup>
// Impor ikon Heroicons yang akan digunakan
import { HomeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
</script>
