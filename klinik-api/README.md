# Klinik API Backend

Backend API untuk sistem manajemen klinik yang dibangun dengan Laravel 10 dan menggunakan Laravel Sanctum untuk autentikasi.

## 📋 Fitur

- **Autentikasi & Otorisasi**
  - JWT-based authentication dengan Laravel Sanctum
  - Role-based access control (Admin, Doctor, Nurse, Staff)
  - Password reset dan email verification
  - Token refresh mechanism

- **Manajemen Pasien**
  - CRUD lengkap untuk data pasien
  - Pencarian dan filtering advanced
  - Nomor rekam medis otomatis
  - Riwayat medis dan informasi darurat
  - Soft delete untuk data historis

- **Manajemen Dokter**
  - Profil dokter dengan spesialisasi
  - Jadwal praktek
  - Assignment pasien
  - Statistik beban kerja

- **Dashboard & Statistik**
  - Real-time statistics
  - Grafik dan chart data
  - Notifikasi sistem
  - Activity logs

## 🚀 Quick Start

### Persyaratan Sistem

- PHP 8.1 atau lebih tinggi
- Composer
- MySQL 5.7+ atau MariaDB
- Node.js & NPM (opsional, untuk development)

### Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd klinik-api
```

2. **Install dependencies**
```bash
composer install
```

3. **Setup environment**
```bash
cp .env.example .env
```

4. **Configure database di .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=klinik_api
DB_USERNAME=root
DB_PASSWORD=your_password

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000
SANCTUM_TOKEN_EXPIRATION=1440

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

5. **Generate application key**
```bash
php artisan key:generate
```

6. **Run migrations dan seeder**
```bash
php artisan migrate:fresh --seed
```

7. **Start development server**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

API akan tersedia di `http://localhost:8000`

## 🔑 Default Login Credentials

Setelah menjalankan seeder, gunakan kredensial berikut:

- **Admin**: `admin@klinik.com` / `admin123`
- **Doctor**: `ahmad.hidayat@klinik.com` / `doctor123`
- **Nurse**: `maria.magdalena@klinik.com` / `nurse123`
- **Staff**: `dewi.sartika@klinik.com` / `staff123`

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@klinik.com",
  "password": "admin123",
  "remember_me": false
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "staff"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Patient Management

#### List Patients
```http
GET /api/pasien?page=1&per_page=15&search=john&status=aktif
Authorization: Bearer {token}
```

#### Create Patient
```http
POST /api/pasien
Authorization: Bearer {token}
Content-Type: application/json

{
  "nama": "John Doe",
  "email": "john@example.com",
  "telepon": "08123456789",
  "alamat": "Jl. Example No. 1",
  "tanggal_lahir": "1990-01-01",
  "jenis_kelamin": "L",
  "nomor_identitas": "1234567890123456",
  "jenis_identitas": "ktp",
  "golongan_darah": "A+",
  "kontak_darurat_nama": "Jane Doe",
  "kontak_darurat_telepon": "08123456788",
  "kontak_darurat_hubungan": "Istri"
}
```

#### Get Patient
```http
GET /api/pasien/{id}
Authorization: Bearer {token}
```

#### Update Patient
```http
PUT /api/pasien/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nama": "John Doe Updated",
  "status": "aktif"
}
```

#### Delete Patient (Soft Delete)
```http
DELETE /api/pasien/{id}
Authorization: Bearer {token}
```

### Dashboard Endpoints

#### Get Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

#### Get Activities
```http
GET /api/dashboard/activities
Authorization: Bearer {token}
```

#### Get Notifications
```http
GET /api/dashboard/notifications
Authorization: Bearer {token}
```

### Doctor Management

#### List Doctors
```http
GET /api/doctor?specialization=Penyakit%20Dalam
Authorization: Bearer {token}
```

#### Create Doctor (Admin only)
```http
POST /api/doctor
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "email": "john.smith@klinik.com",
  "password": "doctor123",
  "password_confirmation": "doctor123",
  "specialization": "Cardiologist",
  "license_number": "STR123456789"
}
```

## 🔒 Role-Based Permissions

### Admin
- Full access ke semua endpoints
- User management
- System configuration

### Doctor
- Patient management (assigned patients)
- Own profile management
- Schedule management
- Medical records

### Nurse
- Patient data viewing and updating
- Basic patient management
- Dashboard access

### Staff
- Patient data viewing
- Basic dashboard access
- Registration assistance

## 🛠️ Development Commands

### Database
```bash
# Fresh migration dengan seeder
php artisan migrate:fresh --seed

# Rollback migration
php artisan migrate:rollback

# Create new migration
php artisan make:migration create_table_name

# Create new seeder
php artisan make:seeder TableSeeder
```

### Artisan Commands
```bash
# Create controller
php artisan make:controller Api/ExampleController --api

# Create model dengan migration
php artisan make:model Example -m

# Create middleware
php artisan make:middleware ExampleMiddleware

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Testing
```bash
# Run tests
php artisan test

# Run specific test
php artisan test --filter=ExampleTest
```

## 📁 Struktur Project

```
klinik-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── PasienController.php
│   │   │       └── DoctorController.php
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   └── Models/
│       ├── User.php
│       └── Pasien.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
└── config/
    ├── cors.php
    └── sanctum.php
```

## 🔧 Configuration

### CORS Setup
File `config/cors.php` sudah dikonfigurasi untuk frontend Vue.js:
- `localhost:3000` (Vue dev server)
- `localhost:5173` (Vite dev server)

### Sanctum Setup
File `config/sanctum.php` dikonfigurasi untuk:
- Token expiration: 24 jam (configurable)
- Stateful domains untuk SPA authentication
- CSRF protection

## 🚨 Troubleshooting

### Common Issues

1. **CORS Error**
   ```bash
   # Pastikan FRONTEND_URL di .env sesuai
   FRONTEND_URL=http://localhost:3000
   
   # Clear config cache
   php artisan config:clear
   ```

2. **Database Connection**
   ```bash
   # Check database credentials di .env
   # Pastikan MySQL service running
   # Test connection:
   php artisan migrate:status
   ```

3. **Permission Denied**
   ```bash
   # Set proper permissions
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

4. **Sanctum Token Issues**
   ```bash
   # Clear cache
   php artisan cache:clear
   php artisan config:clear
   
   # Publish Sanctum config
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

## 🔄 Integration dengan Frontend

Backend ini dirancang untuk berintegrasi dengan frontend Vue.js yang tersedia di repository terpisah. Pastikan:

1. Frontend URL dikonfigurasi di `.env`
2. CORS settings sesuai dengan domain frontend
3. Sanctum stateful domains mencakup frontend domain

## 📝 API Response Format

### Success Response
```json
{
  "data": {
    // response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["validation error message"]
  }
}
```

### Pagination Response
```json
{
  "current_page": 1,
  "data": [...],
  "first_page_url": "...",
  "from": 1,
  "last_page": 5,
  "last_page_url": "...",
  "links": [...],
  "next_page_url": "...",
  "path": "...",
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 67
}
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer**: Yogi Mardilah
- **Project**: Klinik Management System
- **Version**: 1.0.0

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository atau hubungi tim development.