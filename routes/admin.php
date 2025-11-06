<?php


use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Admin Dashboard
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('index');


});

