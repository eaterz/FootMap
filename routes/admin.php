<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LeagueController;
use App\Http\Controllers\Admin\StadiumController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    //leagues
    Route::resource('leagues', LeagueController::class);
    //stadiums
    Route::resource('stadiums', StadiumController::class);
});
