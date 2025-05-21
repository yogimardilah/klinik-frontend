<template>
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
</template>

<script setup>
const props = defineProps({
  form: Object,
  isEdit: Boolean
})

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  emit('submit')
}
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
</style>
