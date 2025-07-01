# 📥 Download Backend Files - Step by Step

## 🎯 File Structure yang Harus Dibuat

```
klinik-api/
├── composer.json
├── .env
├── .env.example
├── README.md
├── routes/
│   ├── api.php
│   └── web.php
├── app/
│   ├── Models/
│   │   ├── User.php
│   │   └── Pasien.php
│   └── Http/
│       ├── Controllers/
│       │   └── Api/
│       │       ├── AuthController.php
│       │       ├── DashboardController.php
│       │       ├── PasienController.php
│       │       └── DoctorController.php
│       └── Middleware/
│           └── RoleMiddleware.php
├── database/
│   ├── migrations/
│   │   ├── 2019_12_14_000001_create_personal_access_tokens_table.php
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   └── 2024_01_01_000001_create_pasiens_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── config/
│   ├── cors.php
│   └── sanctum.php
└── bootstrap/
    └── app.php
```

## 📋 Download Checklist

### ✅ Step 1: Core Files
- [ ] `composer.json`
- [ ] `.env`
- [ ] `.env.example`
- [ ] `README.md`

### ✅ Step 2: Routes
- [ ] `routes/api.php`
- [ ] `routes/web.php`

### ✅ Step 3: Models
- [ ] `app/Models/User.php`
- [ ] `app/Models/Pasien.php`

### ✅ Step 4: Controllers
- [ ] `app/Http/Controllers/Api/AuthController.php`
- [ ] `app/Http/Controllers/Api/DashboardController.php`
- [ ] `app/Http/Controllers/Api/PasienController.php`
- [ ] `app/Http/Controllers/Api/DoctorController.php`

### ✅ Step 5: Middleware
- [ ] `app/Http/Middleware/RoleMiddleware.php`

### ✅ Step 6: Database
- [ ] `database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php`
- [ ] `database/migrations/2024_01_01_000000_create_users_table.php`
- [ ] `database/migrations/2024_01_01_000001_create_pasiens_table.php`
- [ ] `database/seeders/DatabaseSeeder.php`

### ✅ Step 7: Configuration
- [ ] `config/cors.php`
- [ ] `config/sanctum.php`
- [ ] `bootstrap/app.php`

## 🚀 Quick Setup Commands

```bash
# 1. Create project structure
mkdir -p klinik-api/{app/{Models,Http/{Controllers/Api,Middleware}},database/{migrations,seeders},routes,config,bootstrap}

# 2. Install Laravel (alternative method)
composer create-project laravel/laravel klinik-api

# 3. Copy files from conversation above
# 4. Run setup
cd klinik-api
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --host=0.0.0.0 --port=8000
```

## 💾 Alternative: Git Repository

If you want to create a Git repository:

```bash
cd klinik-api
git init
git add .
git commit -m "Initial Laravel API setup"
git branch -M main
```

## 🔗 Files Content Reference

All file contents are available in the conversation above. Each file was created with complete code ready for production use.

## ⚡ Quick Test

After setup, test with:
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Klinik API is running",
  "version": "1.0.0"
}
```