<?php

use App\Http\Controllers\LeagueController;
use App\Http\Controllers\StadiumController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'regular'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Leagues routes for authenticated users
    Route::get('leagues', [LeagueController::class, 'index'])->name('leagues.index');
    Route::get('leagues/{league}', [LeagueController::class, 'show'])->name('leagues.show');

    // Stadiums routes for authenticated users - ADD THESE
    Route::get('stadiums', [StadiumController::class, 'index'])->name('stadiums.index');
    Route::get('stadiums/{stadium}', [StadiumController::class, 'show'])->name('stadiums.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
