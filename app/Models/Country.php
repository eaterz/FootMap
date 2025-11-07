<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'continent_id',
        'name',
        'flag',
    ];

    public function continent()
    {
        return $this->belongsTo(Continent::class);
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function leagues()
    {
        return $this->hasMany(League::class);
    }

    public function stadiums()
    {
        return $this->hasMany(Stadium::class);
    }
}
