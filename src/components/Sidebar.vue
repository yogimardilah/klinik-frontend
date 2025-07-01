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
      <router-link to="/demo" class="flex items-center px-4 py-2 hover:bg-gray-700 mt-2">
        <BeakerIcon class="w-6 h-6 mr-3" />
        <span>Demo CardStats</span>
      </router-link>
            <!-- Development Section -->
      <div class="mt-8 px-4">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Development</h3>
      </div>
      <router-link
        to="/api-test"
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        active-class="bg-blue-100 text-blue-700"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        API Test
      </router-link>
    </nav>
  </div>
</template>

<script setup>
// Impor ikon Heroicons yang akan digunakan
import { HomeIcon, UserGroupIcon, BeakerIcon } from '@heroicons/vue/24/outline'
</script>
