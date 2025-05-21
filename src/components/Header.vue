<template>
  <header class="flex items-center justify-between p-4 bg-white shadow">
    <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
    <div class="flex items-center">
      <img src="/avatar.png" alt="Profil" class="w-8 h-8 rounded-full" />
    </div>
  </header>
</template>

<script setup>
// Gunakan useRoute untuk mengambil nama rute sebagai judul
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.name || '')
</script>
