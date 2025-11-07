<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'name',
        'logo',
        'founded_year',
        'description',
    ];

    protected $casts = [
        'founded_year' => 'date',
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
