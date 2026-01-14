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
        'description',
        'football_data_id',
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
        return $this->hasOneThrough(
            Country::class,
            League::class,
            'id',
            'id',
            'league_id',
            'country_id'
        );
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorite_teams')
            ->withTimestamps();
    }

    public function isFavoritedBy($user)
    {
        if (!$user) {
            return false;
        }

        return $this->favoritedBy()->where('user_id', $user->id)->exists();
    }
}
