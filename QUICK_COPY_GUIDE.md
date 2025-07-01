# 🚀 QUICK COPY GUIDE - Essential Files Only

## ⚡ Priority Order (Copy in this sequence)

### 🔥 **LEVEL 1: SUPER CRITICAL** (Must have to work)

#### **File 1: routes/api.php**
```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\DoctorController;

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'Klinik API is running',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    
    // Protected authentication routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
    });
});

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Dashboard endpoints
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/activities', [DashboardController::class, 'activities']);
        Route::get('/notifications', [DashboardController::class, 'notifications']);
    });
    
    // Pasien (Patient) management
    Route::apiResource('pasien', PasienController::class);
    Route::prefix('pasien')->group(function () {
        Route::get('/export', [PasienController::class, 'export']);
        Route::post('/import', [PasienController::class, 'import']);
        Route::get('/search', [PasienController::class, 'search']);
        Route::get('/statistics', [PasienController::class, 'statistics']);
    });
    
    // Doctor management
    Route::apiResource('doctor', DoctorController::class);
    Route::prefix('doctor')->group(function () {
        Route::get('/{doctor}/schedule', [DoctorController::class, 'schedule']);
        Route::post('/{doctor}/schedule', [DoctorController::class, 'updateSchedule']);
        Route::get('/{doctor}/patients', [DoctorController::class, 'patients']);
        Route::get('/statistics', [DoctorController::class, 'statistics']);
    });
    
    // User management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [AuthController::class, 'users']);
        Route::post('/users', [AuthController::class, 'createUser']);
        Route::put('/users/{user}', [AuthController::class, 'updateUser']);
        Route::delete('/users/{user}', [AuthController::class, 'deleteUser']);
        Route::post('/users/{user}/roles', [AuthController::class, 'assignRole']);
    });
});

// Fallback route for API
Route::fallback(function () {
    return response()->json([
        'message' => 'API endpoint not found',
        'available_endpoints' => [
            'GET /api/health' => 'Health check',
            'POST /api/auth/login' => 'User login',
            'POST /api/auth/register' => 'User registration',
            'GET /api/dashboard/stats' => 'Dashboard statistics (auth required)',
            'GET /api/pasien' => 'List patients (auth required)',
            'GET /api/doctor' => 'List doctors (auth required)',
        ]
    ], 404);
});
```

#### **File 2: .env (Replace existing)**
```env
APP_NAME="Klinik API"
APP_ENV=local
APP_KEY=base64:K/7XqGwqT5l9vYtL2JxAGXrQz5nF8mC4P9vR3dE6iU=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=klinik_api
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000
SANCTUM_TOKEN_EXPIRATION=1440

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 🔴 **LEVEL 2: CRITICAL** (Core functionality)

Copy these files from the conversation above (scroll up to find them):

1. **app/Models/User.php** - User model with roles
2. **app/Models/Pasien.php** - Patient model
3. **app/Http/Controllers/Api/AuthController.php** - Authentication logic
4. **database/migrations/2024_01_01_000000_create_users_table.php** - Users table
5. **database/migrations/2024_01_01_000001_create_pasiens_table.php** - Patients table
6. **database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php** - Sanctum tokens

### 🟡 **LEVEL 3: IMPORTANT** (Extended features)

7. **app/Http/Controllers/Api/DashboardController.php** - Dashboard stats
8. **app/Http/Controllers/Api/PasienController.php** - Patient CRUD
9. **database/seeders/DatabaseSeeder.php** - Sample data
10. **config/cors.php** - CORS configuration

### 🟢 **LEVEL 4: OPTIONAL** (Nice to have)

11. **app/Http/Controllers/Api/DoctorController.php** - Doctor management
12. **app/Http/Middleware/RoleMiddleware.php** - Role protection
13. **config/sanctum.php** - Sanctum config
14. **bootstrap/app.php** - App bootstrap

## 🎯 **SUPER QUICK START** (Minimum viable)

If you want to test ASAP, copy just these 6 files:
1. `routes/api.php`
2. `.env`
3. `app/Models/User.php`
4. `app/Http/Controllers/Api/AuthController.php`
5. `database/migrations/2024_01_01_000000_create_users_table.php`
6. `database/seeders/DatabaseSeeder.php`

Then run:
```bash
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

## 🔥 **Testing Commands**

```bash
# Test health
curl http://localhost:8000/api/health

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@klinik.com","password":"admin123"}'
```

## 📝 **Copy Order Priority**

1. ✅ Copy **routes/api.php** first
2. ✅ Copy **.env** second  
3. ✅ Copy **Models** third
4. ✅ Copy **AuthController** fourth
5. ✅ Copy **migrations** fifth
6. ✅ Copy **seeder** sixth
7. ✅ Test basic functionality
8. 🔄 Add other controllers as needed

This way you can test incrementally rather than copying everything at once!