<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Klinik API Backend',
        'version' => '1.0.0',
        'status' => 'Running',
        'endpoints' => [
            'health' => '/api/health',
            'documentation' => '/api',
            'admin_panel' => '/admin' // if you add admin panel later
        ],
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000')
    ]);
});