<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\League;
use App\Services\ApiFootballService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    private ApiFootballService $apiFootballService;

    public function __construct(ApiFootballService $apiFootballService)
    {
        $this->apiFootballService = $apiFootballService;
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

        // Get or find API Football ID
        if (!$team->api_football_id) {
            $this->findAndUpdateApiFootballId($team);
        }

        // Fetch upcoming matches
        $upcomingMatches = [];
        if ($team->api_football_id) {
            $fixtures = $this->apiFootballService->getUpcomingFixtures($team->api_football_id, 5);
            $upcomingMatches = $this->formatFixtures($fixtures, $team);
        }

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
            'upcomingMatches' => $upcomingMatches,
        ]);
    }

    /**
     * Find and update API Football ID for a team
     */
    private function findAndUpdateApiFootballId(Team $team): void
    {
        try {
            $apiTeam = $this->apiFootballService->searchTeam($team->name);

            if ($apiTeam && isset($apiTeam['team']['id'])) {
                $team->update([
                    'api_football_id' => $apiTeam['team']['id']
                ]);

                Log::info("Updated API Football ID for team: {$team->name} -> {$apiTeam['team']['id']}");
            } else {
                Log::warning("Could not find API Football ID for team: {$team->name}");
            }
        } catch (\Exception $e) {
            Log::error("Error finding API Football ID for team {$team->name}: {$e->getMessage()}");
        }
    }

    /**
     * Format fixtures data for frontend
     */
    private function formatFixtures(array $fixtures, Team $team): array
    {
        return array_map(function ($fixture) use ($team) {
            $isHomeTeam = $fixture['teams']['home']['id'] == $team->api_football_id;

            return [
                'id' => $fixture['fixture']['id'],
                'date' => $fixture['fixture']['date'],
                'timestamp' => $fixture['fixture']['timestamp'],
                'venue' => $fixture['fixture']['venue']['name'] ?? 'TBD',
                'status' => $this->formatStatus($fixture['fixture']['status']),
                'competition' => $fixture['league']['name'] ?? 'Unknown',
                'competition_logo' => $fixture['league']['logo'] ?? null,
                'home_team' => [
                    'id' => $fixture['teams']['home']['id'],
                    'name' => $fixture['teams']['home']['name'],
                    'logo' => $fixture['teams']['home']['logo'],
                ],
                'away_team' => [
                    'id' => $fixture['teams']['away']['id'],
                    'name' => $fixture['teams']['away']['name'],
                    'logo' => $fixture['teams']['away']['logo'],
                ],
                'round' => $fixture['league']['round'] ?? null,
                'season' => $fixture['league']['season'] ?? null,
                'is_home_team' => $isHomeTeam,
                'referee' => $fixture['fixture']['referee'] ?? null,
            ];
        }, $fixtures);
    }

    /**
     * Format fixture status for display
     */
    private function formatStatus(array $status): string
    {
        $long = $status['long'] ?? '';
        $short = $status['short'] ?? '';

        return match($short) {
            'TBD' => 'To Be Determined',
            'NS' => 'Not Started',
            'PST' => 'Postponed',
            'CANC' => 'Cancelled',
            'SUSP' => 'Suspended',
            default => $long ?: 'Scheduled'
        };
    }
}
