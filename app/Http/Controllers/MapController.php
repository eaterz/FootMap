<?php

namespace App\Http\Controllers;

use App\Models\Stadium;
use Inertia\Inertia;
use Inertia\Response;

class MapController extends Controller
{
    public function index(): Response
    {
        $stadiums = Stadium::with(['country', 'teams'])
            ->get()
            ->map(function ($stadium) {
                return [
                    'id' => $stadium->id,
                    'name' => $stadium->name,
                    'city' => $stadium->city,
                    'country' => $stadium->country?->name,
                    'country_flag' => $stadium->country?->flag,
                    'latitude' => (float) $stadium->latitude,
                    'longitude' => (float) $stadium->longitude,
                    'capacity' => $stadium->capacity,
                    'image' => $stadium->image,
                    'teams' => $stadium->teams->map(function ($team) {
                        return [
                            'id' => $team->id,
                            'name' => $team->name,
                            'logo' => $team->logo,
                            'founded_year' => $team->founded_year?->format('Y'),
                        ];
                    }),
                ];
            });

        return Inertia::render('map/index', [
            'stadiums' => $stadiums,
        ]);
    }
}
