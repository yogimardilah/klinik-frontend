<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Daftar Pasien</h1>

    <!-- Form Tambah/Edit -->
    <form @submit.prevent="handleSubmit" class="mb-6 grid gap-4 md:grid-cols-2">
      <input v-model="form.nama" placeholder="Nama" required class="input" />
      <input v-model="form.nik" placeholder="NIK" required class="input" />
      <input v-model="form.no_hp" placeholder="No HP" class="input" />
      <input v-model="form.alamat" placeholder="Alamat" class="input" />
      <input v-model="form.tanggal_lahir" type="date" required class="input" />
      <select v-model="form.jenis_kelamin" class="input">
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
      <button type="submit" class="btn-primary col-span-2">
        {{ isEdit ? 'Update' : 'Tambah' }} Pasien
      </button>
    </form>

    
      <template #item-actions="{ item }">
        <button @click="editPasien(item)" class="btn-warning">Edit</button>
        <button @click="deletePasien(item.id)" class="btn-danger">Hapus</button>
      </template>
    </vue3-easy-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const headers = [
  { text: 'Nama', value: 'nama' },
  { text: 'NIK', value: 'nik' },
  { text: 'No HP', value: 'no_hp' },
  { text: 'Alamat', value: 'alamat' },
  { text: 'Tanggal Lahir', value: 'tanggal_lahir' },
  { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
  { text: 'Aksi', value: 'actions', sortable: false },
]

const pasiens = ref([])
const form = ref({
  id: null,
  nama: '',
  nik: '',
  no_hp: '',
  alamat: '',
  tanggal_lahir: '',
  jenis_kelamin: 'L'
})
const isEdit = ref(false)

const fetchPasiens = async () => {
  const res = await axios.get('http://localhost:8000/api/pasiens')
  pasiens.value = res.data.data
}


const handleSubmit = async () => {
  if (isEdit.value) {
    await axios.put(`http://localhost:8000/api/pasiens/${form.value.id}`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/pasiens', form.value)
  }
  form.value = { id: null, nama: '', nik: '', no_hp: '', alamat: '', tanggal_lahir: '', jenis_kelamin: 'L' }
  isEdit.value = false
  fetchPasiens()
}

const editPasien = (pasien) => {
  form.value = { ...pasien }
  alert(paien)
  isEdit.value = true
}

const deletePasien = async (id) => {
  if (confirm('Yakin hapus data ini?')) {
    await axios.delete(`http://localhost:8000/api/pasiens/${id}`)
    fetchPasiens()
  }
}

onMounted(fetchPasiens)
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.375rem;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
.btn-warning {
  background-color: #facc15;
  padding: 0.25rem 0.75rem;
  margin-right: 0.25rem;
  border-radius: 0.375rem;
}
.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
}
</style>
