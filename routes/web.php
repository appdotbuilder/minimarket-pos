<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // POS System - accessible by both admin and kasir
    Route::resource('pos', PosController::class)->only(['index', 'show', 'store', 'update']);
    
    // Admin-only routes
    Route::group(['middleware' => function ($request, $next) {
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            abort(403, 'Access denied. Admin role required.');
        }
        return $next($request);
    }], function () {
        // Product Management
        Route::resource('products', ProductController::class);
        
        // Category Management
        Route::resource('categories', CategoryController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';