<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\League;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Team::with(['league.country', 'stadium']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        // League filter
        if ($request->filled('league')) {
            $query->where('league_id', $request->input('league'));
        }

        // Paginate results
        $teams = $query->paginate(15)->through(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->name,
                'logo' => $team->logo,
                'founded_year' => $team->founded_year?->format('Y'),
                'website' => $team->website,
                'description' => $team->description,
                'league' => $team->league?->name,
                'country' => $team->league?->country?->name,
                'country_flag' => $team->league?->country?->flag,
                'league_id' => $team->league_id,
                'stadium' => $team->stadium?->name,
                'stadium_city' => $team->stadium?->city,
            ];
        });

        $leagues = League::with('country')
            ->whereHas('teams')
            ->orderBy('name')
            ->get()
            ->map(function ($league) {
                return [
                    'id' => $league->id,
                    'name' => $league->name,
                    'country' => $league->country?->name,
                ];
            });

        return Inertia::render('teams/index', [
            'teams' => $teams,
            'leagues' => $leagues,
            'filters' => [
                'search' => $request->input('search'),
                'league' => $request->input('league'),
            ],
        ]);
    }

    public function show(Team $team): Response
    {
        $team->load(['league.country', 'stadium']);

        return Inertia::render('teams/show', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'logo' => $team->logo,
                'founded_year' => $team->founded_year?->format('Y'),
                'description' => $team->description,
                'website' => $team->website,
                'league' => $team->league?->name,
                'country' => $team->league?->country?->name,
                'country_flag' => $team->league?->country?->flag,
                'stadium' => [
                    'id' => $team->stadium?->id,
                    'name' => $team->stadium?->name,
                    'city' => $team->stadium?->city,
                    'capacity' => $team->stadium?->capacity,
                    'latitude' => $team->stadium?->latitude,
                    'longitude' => $team->stadium?->longitude,
                ],
            ],
        ]);
    }
}
