<template>
  <div>
    <!-- Pencarian -->
    <div class="toolbar">
      <input v-model="search" @input="onSearchInput" placeholder="Cari nama..." class="search-input" />
      <button @click="exportExcel" class="btn-green">Export Excel</button>
      <button @click="exportPDF" class="btn-red">Export PDF</button>
    </div>

    <!-- Table Pasien -->
    <vue3-easy-data-table :headers="headers" :items="pasiens" :server-options="serverOptions"
      :server-items-length="totalItems" :rows-per-page="perPage" @update:server-options="onServerOptionsUpdate">
      <template #item-actions="{ item }">
      </template>
    </vue3-easy-data-table>

    <!-- Pagination Laravel -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">«</button>
      <span>Halaman {{ currentPage }} / {{ lastPage }}</span>
      <button :disabled="currentPage === lastPage" @click="goToPage(currentPage + 1)">»</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const pasiens = ref([])
const search = ref('')
const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(5)

const sortBy = ref('')
const sortDesc = ref(false)

const headers = [
  { text: 'Nama', value: 'nama', sortable: true },
  { text: 'NIK', value: 'nik', sortable: true },
  { text: 'No HP', value: 'no_hp', sortable: true },
  { text: 'Alamat', value: 'alamat', sortable: false },
  { text: 'Tanggal Lahir', value: 'tanggal_lahir', sortable: true },
  { text: 'Jenis Kelamin', value: 'jenis_kelamin', sortable: true },
  { text: 'Aksi', value: 'actions', sortable: false }
]

const totalItems = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: '',
  sortType: 'asc',
})

const onServerOptionsUpdate = (options) => {
  serverOptions.value = options
  currentPage.value = options.page
  perPage.value = options.rowsPerPage
  sortBy.value = options.sortBy
  sortDesc.value = options.sortType === 'desc'
  getPasiens()
}


const getPasiens = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/pasiens', {
      params: {
        search: search.value,
        page: currentPage.value,
        per_page: perPage.value,
        sort_by: sortBy.value,
        sort_desc: sortDesc.value ? 'desc' : 'asc'
      }
    })
    pasiens.value = response.data.data
    totalItems.value = response.data.total // <-- dari Laravel
    lastPage.value = response.data.last_page
  } catch (error) {
    console.error('Gagal ambil data pasien', error)
  }
}


let typingTimeout = null
const onSearchInput = () => {
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    currentPage.value = 1
    getPasiens()
  }, 300)
}

const onPerPageChange = () => {
  currentPage.value = 1
  getPasiens()
}

const goToPage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
    getPasiens()
  }
}

watch([sortBy, sortDesc], () => {
  currentPage.value = 1
  getPasiens()
})

onMounted(() => {
  getPasiens()
})


const exportExcel = () => {
  const params = new URLSearchParams({
    search: search.value,
    sort_by: sortBy.value,
    sort_desc: sortDesc.value ? 'desc' : 'asc'
  })
  window.open(`http://localhost:8000/api/pasiens/export/excel?${params.toString()}`, '_blank')
}

const exportPDF = () => {
  const params = new URLSearchParams({
    search: search.value,
    sort_by: sortBy.value,
    sort_desc: sortDesc.value ? 'desc' : 'asc'
  })
  window.open(`http://localhost:8000/api/pasiens/export/pdf?${params.toString()}`, '_blank')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-green {
  background-color: green;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
}

.btn-red {
  background-color: crimson;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
}

.btn-warning {
  background-color: orange;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  margin-right: 4px;
}

.btn-danger {
  background-color: red;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
}
</style>
