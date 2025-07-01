# Backend Integration Guide

## 🚀 Overview

Panduan lengkap untuk mengintegrasikan frontend Vue.js dengan Laravel backend API `github.com/yogimardilah/klinik-api`.

## 📋 Prerequisites

### Backend Requirements
- Laravel 8+ dengan PHP 8.0+
- MySQL/PostgreSQL Database
- Laravel Sanctum untuk API authentication
- CORS package configured

### Frontend Configuration
- Vue 3 dengan Vite
- Axios HTTP client
- Pinia state management
- Environment variables configured

## 🔧 Setup Laravel Backend

### 1. Clone & Install Backend
```bash
# Clone repository
git clone https://github.com/yogimardilah/klinik-api.git
cd klinik-api

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate
```

### 2. Database Configuration
```env
# .env (Laravel Backend)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=klinik_database
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### 3. Run Migrations & Seeders
```bash
# Create database
php artisan migrate

# Seed with sample data (optional)
php artisan db:seed

# Create storage link
php artisan storage:link
```

### 4. Install & Configure Laravel Sanctum
```bash
# Install Sanctum
composer require laravel/sanctum

# Publish config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Migrate
php artisan migrate
```

#### Configure Sanctum
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),

'api_token_expiration' => env('SANCTUM_TOKEN_EXPIRATION', 60 * 24), // 24 hours
```

#### Add to Kernel
```php
// app/Http/Kernel.php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 5. Configure CORS
```bash
# Install laravel-cors (if not already installed)
composer require fruitcake/laravel-cors

# Publish config
php artisan vendor:publish --tag="cors"
```

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### 6. Create Required API Routes
```php
// routes/api.php
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'OK', 'timestamp' => now()]);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
    Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
    Route::put('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification'])->middleware('auth:sanctum');
});

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activities', [DashboardController::class, 'activities']);
    
    // Patients
    Route::apiResource('pasien', PasienController::class);
    
    // Doctors
    Route::apiResource('doctor', DoctorController::class);
});
```

### 7. Start Laravel Server
```bash
php artisan serve
# Backend will be available at: http://localhost:8000
```

## ⚙️ Frontend Configuration

### 1. Environment Variables
```env
# .env (Vue Frontend)
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:3000
VITE_AUTH_PROVIDER=sanctum
VITE_DEBUG=true
```

### 2. API Service Configuration
File sudah dikonfigurasi di `src/services/api.js` dengan:
- Automatic Bearer token injection
- Token refresh mechanism
- CORS-compatible requests
- Error handling

### 3. Authentication Store
Pinia store sudah dikonfigurasi di `src/stores/auth.js` dengan:
- JWT token management
- User state management
- Role & permission checks
- Auto-logout on token expiry

## 🧪 Testing Integration

### 1. Access API Test Page
```
http://localhost:3000/api-test
```

### 2. Run Tests
- **Connection Test**: Test basic API connectivity
- **Auth Endpoints**: Test authentication endpoints
- **All Tests**: Comprehensive endpoint testing

### 3. Expected Results
```
✅ Connection: success
✅ /auth/login: 405 Method not allowed (expected without data)
✅ /auth/register: 405 Method not allowed (expected without data)
🔒 /auth/profile: 401 Unauthorized (expected without token)
✅ /pasien: 401 Unauthorized (expected without token)
```

## 🔐 Authentication Flow

### 1. Login Process
```javascript
// Frontend login
const response = await authStore.login({
  email: 'user@example.com',
  password: 'password123',
  remember_me: true
})

// Expected response
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  },
  "token": "1|abc123...",
  "refresh_token": "def456..."
}
```

### 2. Authenticated Requests
```javascript
// Token automatically added to headers
const patients = await ApiService.get('/pasien')

// Headers sent:
// Authorization: Bearer 1|abc123...
// Accept: application/json
// Content-Type: application/json
```

### 3. Token Refresh
```javascript
// Auto-refresh on 401 response
// Retry original request with new token
// Logout if refresh fails
```

## 📊 Expected API Endpoints

### Authentication Endpoints
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/change-password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/resend-verification
```

### Data Endpoints
```
GET    /api/dashboard/stats
GET    /api/dashboard/activities
GET    /api/pasien
POST   /api/pasien
GET    /api/pasien/{id}
PUT    /api/pasien/{id}
DELETE /api/pasien/{id}
GET    /api/doctor
POST   /api/doctor
```

### Health Check
```
GET    /api/health
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
```
Access to fetch at 'http://localhost:8000/api' has been blocked by CORS policy
```

**Solution:**
- Check Laravel CORS configuration
- Verify `allowed_origins` includes frontend URL
- Ensure `supports_credentials` is true
- Restart Laravel server after config changes

#### 2. 404 Not Found
```
404 Not Found: The requested URL was not found
```

**Solution:**
- Verify Laravel server is running on port 8000
- Check route definitions in `routes/api.php`
- Ensure API prefix is correct
- Check `.htaccess` configuration

#### 3. 401 Unauthorized
```
401 Unauthorized: Unauthenticated
```

**Solution:**
- Check if token is being sent in headers
- Verify token format (Bearer token)
- Check token expiry
- Ensure Sanctum is properly configured

#### 4. 500 Internal Server Error
```
500 Internal Server Error
```

**Solution:**
- Check Laravel logs: `storage/logs/laravel.log`
- Verify database connection
- Check environment configuration
- Enable debug mode: `APP_DEBUG=true`

### Debug Commands

#### Check Laravel Configuration
```bash
# Check config cache
php artisan config:clear
php artisan config:cache

# Check route cache
php artisan route:clear
php artisan route:cache

# Check logs
tail -f storage/logs/laravel.log
```

#### Test API with curl
```bash
# Test health endpoint
curl -X GET http://localhost:8000/api/health

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Test authenticated endpoint
curl -X GET http://localhost:8000/api/pasien \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

## 📈 Performance Tips

### 1. API Optimization
- Use pagination for large datasets
- Implement API rate limiting
- Add response caching where appropriate
- Optimize database queries

### 2. Frontend Optimization
- Implement request debouncing
- Use loading states
- Cache frequently accessed data
- Implement offline support

### 3. Security Best Practices
- Validate all input data
- Use HTTPS in production
- Implement rate limiting
- Log security events
- Regular security updates

## 🚀 Production Deployment

### 1. Environment Setup
```env
# Production .env (Laravel)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-api-domain.com

# Frontend .env (Vue)
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_URL=https://your-frontend-domain.com
VITE_DEBUG=false
```

### 2. Security Configuration
- Enable HTTPS
- Configure proper CORS origins
- Set secure session cookies
- Implement CSP headers
- Use environment-specific configurations

### 3. Deployment Checklist
- [ ] Database migrations run
- [ ] Config cache cleared and rebuilt
- [ ] Route cache cleared and rebuilt
- [ ] Storage linked
- [ ] File permissions set correctly
- [ ] HTTPS certificates installed
- [ ] Environment variables secured
- [ ] Monitoring and logging configured

## 📚 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel CORS Package](https://github.com/fruitcake/laravel-cors)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Author**: Klinik Frontend Team