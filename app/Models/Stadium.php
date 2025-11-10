<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stadium extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'city',
        'name',
        'latitude',
        'longitude',
        'capacity',
        'image',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'capacity' => 'integer',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }


    public function teams()
    {
        return $this->hasMany(Team::class);
    }
}
