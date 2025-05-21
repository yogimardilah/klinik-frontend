<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="p-4 flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// Impor komponen Sidebar dan Header
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>
