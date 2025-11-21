<?php

use App\Http\Controllers\LeagueController;
use App\Http\Controllers\StadiumController;
use App\Http\Controllers\TeamController;
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

    // Leagues routes
    Route::get('leagues', [LeagueController::class, 'index'])->name('leagues.index');
    Route::get('leagues/{league}', [LeagueController::class, 'show'])->name('leagues.show');

    // Stadiums routes
    Route::get('stadiums', [StadiumController::class, 'index'])->name('stadiums.index');
    Route::get('stadiums/{stadium}', [StadiumController::class, 'show'])->name('stadiums.show');

    // Teams routes
    Route::get('teams', [TeamController::class, 'index'])->name('teams.index');
    Route::get('teams/{team}', [TeamController::class, 'show'])->name('teams.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
