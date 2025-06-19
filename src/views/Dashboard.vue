<template>
  <AdminLayout>
    <section class="space-y-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardStats title="Total Pasien" value="123" icon="👨‍⚕️" />
        <CardStats title="Total Dokter" value="12" icon="🩺" />
        <CardStats title="Antrian Hari Ini" value="27" icon="📋" />
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Statistik Mingguan</h2>
        <!-- Placeholder grafik -->
        <div class="bg-gray-100 rounded h-40 flex items-center justify-center text-gray-500">
          [Grafik akan ditambahkan]
        </div>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup>
// import AdminLayout from '@/layouts/AdminLayout.vue'

// Komponen ini bisa kamu buat atau generate nanti
// import CardStats from '@/components/dashboard/CardStats.vue'
</script>
