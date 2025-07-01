# Dashboard Components

## CardStats Component

Komponen reusable untuk menampilkan kartu statistik pada dashboard.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | String | ✅ | - | Judul kartu statistik |
| `value` | String/Number | ✅ | - | Nilai statistik yang ditampilkan |
| `icon` | String | ✅ | - | Emoji atau ikon untuk kartu |
| `subtitle` | String | ❌ | '' | Subtitle opsional |
| `trend` | Object | ❌ | null | Object untuk menampilkan trend naik/turun |

### Contoh Penggunaan

#### Basic Usage
```vue
<CardStats 
  title="Total Pasien" 
  value="123" 
  icon="👨‍⚕️"
/>
```

#### With Subtitle
```vue
<CardStats 
  title="Total Dokter" 
  value="12" 
  icon="🩺"
  subtitle="Dokter aktif"
/>
```

#### With Trend
```vue
<CardStats 
  title="Antrian Hari Ini" 
  value="27" 
  icon="📋"
  subtitle="Pasien menunggu"
  :trend="{ type: 'increase', value: 12 }"
/>
```

---

## CardStatsAdvanced Component

Versi advanced dari CardStats dengan fitur loading state, error handling, dan animasi.

### Additional Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `loading` | Boolean | ❌ | false | Menampilkan loading state |
| `error` | String | ❌ | '' | Pesan error yang ditampilkan |
| `clickable` | Boolean | ❌ | false | Membuat kartu dapat diklik |
| `iconColor` | String | ❌ | 'bg-blue-100' | Custom warna background icon |
| `actionLabel` | String | ❌ | '' | Label untuk tombol aksi |
| `animationDuration` | Number | ❌ | 1000 | Durasi animasi counting (ms) |
| `onRetry` | Function | ❌ | null | Callback untuk tombol retry |

### Events

| Event | Description |
|-------|-------------|
| `@click` | Dipanggil ketika kartu diklik (jika clickable=true) |
| `@action` | Dipanggil ketika tombol aksi diklik |

### Contoh Penggunaan Advanced

#### With Loading State
```vue
<CardStatsAdvanced 
  title="Total Pasien" 
  value="123" 
  icon="👨‍⚕️"
  :loading="isLoading"
/>
```

#### With Error Handling
```vue
<CardStatsAdvanced 
  title="Total Pasien" 
  value="0" 
  icon="👨‍⚕️"
  :error="errorMessage"
  :onRetry="fetchData"
/>
```

#### Clickable with Action
```vue
<CardStatsAdvanced 
  title="Total Pasien" 
  value="123" 
  icon="👨‍⚕️"
  :clickable="true"
  actionLabel="Lihat Detail"
  @click="navigateToPatients"
  @action="showPatientDetails"
/>
```

#### Custom Icon Color
```vue
<CardStatsAdvanced 
  title="Total Dokter" 
  value="12" 
  icon="🩺"
  iconColor="bg-green-100"
  :trend="{ type: 'increase', value: 8, period: 'dari minggu lalu' }"
/>
```

### Trend Object Format

```javascript
{
  type: 'increase' | 'decrease',
  value: number, // persentase tanpa simbol %
  period?: string // default: 'dari bulan lalu'
}
```

### Custom Styling

Komponen menggunakan Tailwind CSS dengan tema yang konsisten:
- Background: `bg-white`
- Shadow: `shadow-md` dengan hover `shadow-lg`
- Icon container: `bg-blue-100` (dapat dikustomisasi)
- Trend colors: `text-green-600` untuk increase, `text-red-600` untuk decrease
- Loading: menggunakan `animate-pulse`
- Clickable: menambahkan `hover:scale-105` transform

### Fitur

- ✨ **Animasi counting** untuk nilai numerik
- 🔄 **Loading state** dengan skeleton loading
- ⚠️ **Error handling** dengan tombol retry
- 🖱️ **Clickable cards** dengan hover effects
- 🎨 **Custom icon colors**
- 📊 **Trend indicators** dengan ikon SVG
- 🎯 **Action buttons** untuk navigasi cepat