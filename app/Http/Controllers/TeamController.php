<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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

        // Fetch upcoming matches from API
        $upcomingMatches = $this->fetchUpcomingMatches($team);

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
     *
     * You'll need to:
     * 1. Sign up at https://www.api-football.com/ for a free API key
     * 2. Add FOOTBALL_API_KEY to your .env file
     * 3. You may need to map your team names to API team IDs
     */
    private function fetchUpcomingMatches(Team $team): array
    {
        try {
            $apiKey = config('services.football_api.key');

            if (!$apiKey) {
                Log::warning('Football API key not configured');
                return [];
            }

            // Note: You'll need to map your team names to API team IDs
            // For demo purposes, this returns empty array
            // In production, you should:
            // 1. Store API team IDs in your teams table
            // 2. Or create a mapping service
            // 3. Or search for the team first using the API

            $teamApiId = $this->getTeamApiId($team);

            if (!$teamApiId) {
                return [];
            }

            $response = Http::withHeaders([
                'x-rapidapi-key' => $apiKey,
                'x-rapidapi-host' => 'api-football-v1.p.rapidapi.com'
            ])->get('https://api-football-v1.p.rapidapi.com/v3/fixtures', [
                'team' => $teamApiId,
                'next' => 5, // Get next 5 matches
                'timezone' => 'UTC'
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['response']) && is_array($data['response'])) {
                    return array_map(function ($fixture) {
                        return [
                            'id' => $fixture['fixture']['id'],
                            'date' => $fixture['fixture']['date'],
                            'timestamp' => $fixture['fixture']['timestamp'],
                            'venue' => $fixture['fixture']['venue']['name'] ?? 'TBD',
                            'status' => $fixture['fixture']['status']['long'] ?? 'Scheduled',
                            'competition' => $fixture['league']['name'] ?? '',
                            'competition_logo' => $fixture['league']['logo'] ?? null,
                            'home_team' => [
                                'name' => $fixture['teams']['home']['name'],
                                'logo' => $fixture['teams']['home']['logo'],
                            ],
                            'away_team' => [
                                'name' => $fixture['teams']['away']['name'],
                                'logo' => $fixture['teams']['away']['logo'],
                            ],
                        ];
                    }, $data['response']);
                }
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Error fetching upcoming matches: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get the API team ID for a team
     * This method checks if the team has an api_team_id stored,
     * otherwise falls back to a predefined mapping
     */
    private function getTeamApiId(Team $team): ?int
    {
        // If api_team_id column exists and has a value, use it
        if (isset($team->api_team_id) && $team->api_team_id) {
            return $team->api_team_id;
        }

        // Fallback mapping for demo purposes
        // You should populate api_team_id in your database instead
        $mapping = [
            'Manchester United' => 33,
            'Liverpool FC' => 40,
            'Real Madrid' => 541,
            'FC Barcelona' => 529,
            'Bayern Munich' => 157,
        ];

        return $mapping[$team->name] ?? null;
    }

    /**
     * Search for a team in the API by name (helper method)
     * You can use this to find team IDs and update your database
     */
    private function searchTeamInApi(string $teamName): ?array
    {
        try {
            $apiKey = config('services.football_api.key');

            if (!$apiKey) {
                return null;
            }

            $response = Http::withHeaders([
                'x-rapidapi-key' => $apiKey,
                'x-rapidapi-host' => 'api-football-v1.p.rapidapi.com'
            ])->get('https://api-football-v1.p.rapidapi.com/v3/teams', [
                'search' => $teamName
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['response']) && count($data['response']) > 0) {
                    return $data['response'][0]['team'];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Error searching team in API: ' . $e->getMessage());
            return null;
        }
    }
}
