<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id',
        'stadium_id',
        'name',
        'logo',
        'founded_year',
        'website',
    ];

    protected $casts = [
        'founded_year' => 'date',
    ];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function stadium()
    {
        return $this->belongsTo(Stadium::class);
    }

    public function country()
    {
        return $this->hasOneThrough(Country::class, League::class, 'country_id', 'id', 'league_id', 'id');
    }
}
