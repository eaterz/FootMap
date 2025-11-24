<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
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

        $upcomingMatches = Cache::remember(
            "team_{$team->id}_upcoming_matches",
            now()->addMinutes(30),
            function () use ($team) {
                return $this->fetchUpcomingMatches($team);
            }
        );

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
     * Fetch upcoming matches for a team from external API
     */
    private function fetchUpcomingMatches(Team $team): array
    {
        try {
            $apiKey = config('services.football_api.key');

            if (!$apiKey) {
                Log::warning('Football API key not configured');
                return [];
            }

            // Get the API team ID
            $teamApiId = $team->api_team_id;

            // If no API team ID is set, try to find it
            if (!$teamApiId) {
                Log::info("No API team ID for team: {$team->name}, attempting to find it");
                $teamApiId = $this->findAndUpdateTeamApiId($team);

                if (!$teamApiId) {
                    Log::warning("Could not find API ID for team: {$team->name}");
                    return [];
                }
            }

            // Fetch upcoming fixtures
            $response = Http::timeout(10)
                ->withHeaders([
                    'x-rapidapi-key' => $apiKey,
                    'x-rapidapi-host' => 'api-football-v1.p.rapidapi.com'
                ])
                ->get('https://api-football-v1.p.rapidapi.com/v3/fixtures', [
                    'team' => $teamApiId,
                    'next' => 5, // Get next 5 matches
                    'timezone' => 'UTC'
                ]);

            if (!$response->successful()) {
                Log::error("API request failed for team {$team->name}: " . $response->status());
                return [];
            }

            $data = $response->json();

            if (!isset($data['response']) || !is_array($data['response'])) {
                Log::warning("Invalid API response format for team: {$team->name}");
                return [];
            }

            // Transform the API response
            return array_map(function ($fixture) {
                return [
                    'id' => $fixture['fixture']['id'] ?? null,
                    'date' => $fixture['fixture']['date'] ?? null,
                    'timestamp' => $fixture['fixture']['timestamp'] ?? null,
                    'venue' => $fixture['fixture']['venue']['name'] ?? 'TBD',
                    'status' => $fixture['fixture']['status']['long'] ?? 'Scheduled',
                    'competition' => $fixture['league']['name'] ?? 'Unknown',
                    'competition_logo' => $fixture['league']['logo'] ?? null,
                    'home_team' => [
                        'name' => $fixture['teams']['home']['name'] ?? 'Unknown',
                        'logo' => $fixture['teams']['home']['logo'] ?? null,
                    ],
                    'away_team' => [
                        'name' => $fixture['teams']['away']['name'] ?? 'Unknown',
                        'logo' => $fixture['teams']['away']['logo'] ?? null,
                    ],
                ];
            }, $data['response']);

        } catch (\Exception $e) {
            Log::error("Error fetching upcoming matches for team {$team->name}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Find and update the API team ID for a team
     */
    private function findAndUpdateTeamApiId(Team $team): ?int
    {
        try {
            $apiKey = config('services.football_api.key');

            if (!$apiKey) {
                return null;
            }

            $response = Http::timeout(10)
                ->withHeaders([
                    'x-rapidapi-key' => $apiKey,
                    'x-rapidapi-host' => 'api-football-v1.p.rapidapi.com'
                ])
                ->get('https://api-football-v1.p.rapidapi.com/v3/teams', [
                    'search' => $team->name
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['response']) && count($data['response']) > 0) {
                    $apiTeamId = $data['response'][0]['team']['id'];

                    // Update the team with the API ID
                    $team->update(['api_team_id' => $apiTeamId]);

                    Log::info("Updated team {$team->name} with API ID: {$apiTeamId}");

                    return $apiTeamId;
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error("Error finding API ID for team {$team->name}: " . $e->getMessage());
            return null;
        }
    }
}
