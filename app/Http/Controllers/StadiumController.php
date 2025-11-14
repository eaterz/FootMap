<?php

namespace App\Http\Controllers;

use App\Models\Stadium;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StadiumController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Stadium::with(['country', 'teams']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Country filter
        if ($request->filled('country')) {
            $query->where('country_id', $request->input('country'));
        }

        // Paginate results
        $stadiums = $query->paginate(15)->through(function ($stadium) {
            return [
                'id' => $stadium->id,
                'name' => $stadium->name,
                'city' => $stadium->city,
                'country' => $stadium->country?->name,
                'country_flag' => $stadium->country?->flag,
                'country_id' => $stadium->country_id,
                'latitude' => $stadium->latitude,
                'longitude' => $stadium->longitude,
                'capacity' => $stadium->capacity,
                'image' => $stadium->image,
                'teams_count' => $stadium->teams->count(),
                'teams' => $stadium->teams->map(function ($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'logo' => $team->logo,
                    ];
                }),
            ];
        });

        $countries = Country::whereHas('stadiums')
            ->orderBy('name')
            ->get(['id', 'name', 'flag']);

        return Inertia::render('stadiums/index', [
            'stadiums' => $stadiums,
            'countries' => $countries,
            'filters' => [
                'search' => $request->input('search'),
                'country' => $request->input('country'),
            ],
        ]);
    }

    public function show(Stadium $stadium): Response
    {
        $stadium->load(['country', 'teams.league']);

        return Inertia::render('stadiums/show', [
            'stadium' => [
                'id' => $stadium->id,
                'name' => $stadium->name,
                'city' => $stadium->city,
                'country' => $stadium->country?->name,
                'country_flag' => $stadium->country?->flag,
                'latitude' => $stadium->latitude,
                'longitude' => $stadium->longitude,
                'capacity' => $stadium->capacity,
                'image' => $stadium->image,
                'teams' => $stadium->teams->map(function ($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'logo' => $team->logo,
                        'league' => $team->league?->name,
                        'founded_year' => $team->founded_year?->format('Y'),
                    ];
                }),
            ],
        ]);
    }
}
