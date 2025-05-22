<template>
  <div class="max-w-7xl mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Daftar Pasien</h2>

    <!-- Dropdown perPage -->
    <div class="mb-4 flex justify-end items-center space-x-2">
      <label class="text-sm">Tampilkan:</label>
      <select v-model="perPage" @change="fetchPasiens(1)" class="border px-2 py-1 rounded text-sm">
        <option :value="3">3</option>
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>

    <!-- Tabel -->
    <table class="min-w-full border border-gray-300 rounded-md overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="text-left px-4 py-2 border-b border-gray-300">Nama</th>
          <th class="text-left px-4 py-2 border-b border-gray-300">NIK</th>
          <th class="text-left px-4 py-2 border-b border-gray-300">No HP</th>
          <th class="text-left px-4 py-2 border-b border-gray-300">Alamat</th>
          <th class="text-left px-4 py-2 border-b border-gray-300">Tanggal Lahir</th>
          <th class="text-left px-4 py-2 border-b border-gray-300">Jenis Kelamin</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="text-center py-4 text-gray-500">Memuat data...</td>
        </tr>
        <tr v-else-if="pasiens.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">Data tidak ditemukan</td>
        </tr>
        <tr v-else v-for="pasien in pasiens" :key="pasien.id" class="odd:bg-white even:bg-gray-50">
          <td class="px-4 py-2 border-b border-gray-200">{{ pasien.nama }}</td>
          <td class="px-4 py-2 border-b border-gray-200">{{ pasien.nik }}</td>
          <td class="px-4 py-2 border-b border-gray-200">{{ pasien.no_hp }}</td>
          <td class="px-4 py-2 border-b border-gray-200">{{ pasien.alamat }}</td>
          <td class="px-4 py-2 border-b border-gray-200">{{ pasien.tanggal_lahir }}</td>
          <td class="px-4 py-2 border-b border-gray-200">{{ pasien.jenis_kelamin }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center space-x-2">
      <button
        v-for="link in pagination.links"
        :key="link.label"
        :disabled="!link.url"
        @click="changePageFromUrl(link.url)"
        :class="[
          'px-3 py-1 rounded border border-gray-300 hover:bg-gray-200',
          link.active ? 'bg-blue-600 text-white border-blue-600' : '',
          !link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <span v-html="link.label"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const pasiens = ref([])
const perPage = ref(3)
const loading = ref(false)

const pagination = ref({
  current_page: 1,
  links: [],
  prev_page_url: null,
  next_page_url: null
})

const fetchPasiens = async (page = 1) => {
  loading.value = true
  try {
    const response = await axios.get('/pasiens', {
      params: {
        page,
        per_page: perPage.value
      }
    })
    const data = response.data
    pasiens.value = data.data
    pagination.value = {
      current_page: data.current_page,
      links: data.links,
      prev_page_url: data.prev_page_url,
      next_page_url: data.next_page_url
    }
  } catch (error) {
    console.error('Gagal fetch data:', error)
    pasiens.value = []
  } finally {
    loading.value = false
  }
}

const changePageFromUrl = (url) => {
  if (!url) return
  const urlObj = new URL(url)
  const page = urlObj.searchParams.get('page')
  if (page) fetchPasiens(parseInt(page))
}

onMounted(() => {
  fetchPasiens(1)
})
</script>
