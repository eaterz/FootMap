<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    public function index(Request $request): Response
    {
        $query = League::with(['country', 'teams']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('country')) {
            $query->where('country_id', $request->input('country'));
        }

        $leagues = $query->get()->map(function ($league) {
            return [
                'id' => $league->id,
                'name' => $league->name,
                'logo' => $league->logo,
                'country' => $league->country?->name,
                'country_flag' => $league->country?->flag,
                'country_id' => $league->country_id,
                'founded_year' => $league->founded_year?->format('Y'),
                'description' => $league->description,
                'resource_url' => $league->resource_url,
                'teams_count' => $league->teams->count(),
            ];
        });

        $countries = Country::whereHas('leagues')
            ->orderBy('name')
            ->get(['id', 'name', 'flag']);

        return Inertia::render('leagues/index', [
            'leagues' => $leagues,
            'countries' => $countries,
            'filters' => [
                'search' => $request->input('search'),
                'country' => $request->input('country'),
            ],
        ]);
    }

    public function show(League $league): Response
    {
        $league->load(['country', 'teams.stadium']);

        return Inertia::render('leagues/show', [
            'league' => [
                'id' => $league->id,
                'name' => $league->name,
                'logo' => $league->logo,
                'country' => $league->country?->name,
                'country_flag' => $league->country?->flag,
                'founded_year' => $league->founded_year?->format('Y'),
                'description' => $league->description,
                'resource_url' => $league->resource_url,
                'teams' => $league->teams->map(function ($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'logo' => $team->logo,
                        'stadium' => $team->stadium?->name,
                        'founded_year' => $team->founded_year?->format('Y'),
                    ];
                }),
            ],
        ]);
    }
}
