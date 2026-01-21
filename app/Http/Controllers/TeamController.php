<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\League;
use App\Models\Country;
use App\Services\FootballDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    private FootballDataService $footballDataService;

    public function __construct(FootballDataService $footballDataService)
    {
        $this->footballDataService = $footballDataService;
    }

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

        // Country filter
        if ($request->filled('country')) {
            $query->whereHas('league', function ($q) use ($request) {
                $q->where('country_id', $request->input('country'));
            });
        }

        $user = Auth::user();
        $favoriteTeamIds = $user ? $user->favoriteTeams()->pluck('team_id')->toArray() : [];

        $teams = $query->paginate(15)->through(function ($team) use ($favoriteTeamIds) {
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
                'is_favorited' => in_array($team->id, $favoriteTeamIds),
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

        // Get countries that have teams (through leagues)
        $countries = Country::whereHas('leagues.teams')
            ->orderBy('name')
            ->get(['id', 'name', 'flag']);

        return Inertia::render('teams/index', [
            'teams' => $teams,
            'leagues' => $leagues,
            'countries' => $countries,
            'filters' => [
                'search' => $request->input('search'),
                'league' => $request->input('league'),
                'country' => $request->input('country'),
            ],
        ]);
    }

    public function show(Team $team): Response
    {
        $team->load(['league.country', 'stadium']);

        $this->ensureFootballDataId($team);

        $upcomingMatches = [];
        if ($team->football_data_id) {
            Log::info("Fetching matches for team: {$team->name} (ID: {$team->football_data_id})");

            $matches = $this->footballDataService->getUpcomingMatches($team->football_data_id, 5);

            if (empty($matches)) {
                Log::warning("No matches found for team: {$team->name} (ID: {$team->football_data_id})");
            } else {
                Log::info("Found " . count($matches) . " matches for team: {$team->name}");
                $upcomingMatches = $this->footballDataService->formatMatches($matches, $team->football_data_id);
            }
        } else {
            Log::warning("No Football-Data ID found for team: {$team->name}");
        }

        $user = Auth::user();
        $isFavorited = $user ? $user->favoriteTeams()->where('team_id', $team->id)->exists() : false;

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
                'is_favorited' => $isFavorited,
            ],
            'upcomingMatches' => $upcomingMatches,
        ]);
    }

    /**
     * Ensure the team has a Football-Data ID
     */
    private function ensureFootballDataId(Team $team): void
    {
        if ($team->football_data_id) {
            return;
        }

        try {
            $teamId = $this->footballDataService->findTeamId($team->name);

            if ($teamId) {
                $team->update([
                    'football_data_id' => $teamId
                ]);

                Log::info("Auto-assigned Football-Data ID for team: {$team->name} -> {$teamId}");
            } else {
                Log::warning("Could not find Football-Data ID for team: {$team->name}");
                Log::warning("Team may not be in any of the tracked competitions");
            }
        } catch (\Exception $e) {
            Log::error("Error finding Football-Data ID for team {$team->name}: {$e->getMessage()}");
        }
    }
}
