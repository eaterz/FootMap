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
     * Fetch upcoming matches for a team from TheSportsDB API
     */
    private function fetchUpcomingMatches(Team $team): array
    {
        try {
            // TheSportsDB uses '3' for free tier (patreon tier uses actual API key)
            $apiKey = config('services.thesportsdb_api.key', '3');

            // Get the API team ID
            $teamApiId = $team->api_team_id;

            // If no API team ID is set, try to find it
            if (!$teamApiId) {
                Log::info("No API team ID for team: {$team->name}, attempting to find it");
                $teamApiId = $this->findAndUpdateTeamApiId($team, $apiKey);

                if (!$teamApiId) {
                    Log::warning("Could not find API ID for team: {$team->name}");
                    return [];
                }
            }

            // Fetch next 5 events for the team
            $response = Http::timeout(10)
                ->get("https://www.thesportsdb.com/api/v1/json/{$apiKey}/eventsnext.php", [
                    'id' => $teamApiId
                ]);

            if (!$response->successful()) {
                Log::error("API request failed for team {$team->name}: " . $response->status());
                return [];
            }

            $data = $response->json();

            if (!isset($data['events']) || !is_array($data['events'])) {
                Log::warning("No upcoming events found for team: {$team->name}");
                return [];
            }

            // Transform the API response
            return array_map(function ($event) {
                return [
                    'id' => $event['idEvent'] ?? null,
                    'date' => $event['dateEvent'] ?? null,
                    'time' => $event['strTime'] ?? null,
                    'timestamp' => isset($event['dateEvent'], $event['strTime'])
                        ? strtotime($event['dateEvent'] . ' ' . $event['strTime'])
                        : null,
                    'venue' => $event['strVenue'] ?? 'TBD',
                    'status' => $this->formatStatus($event),
                    'competition' => $event['strLeague'] ?? 'Unknown',
                    'competition_logo' => $event['strLeagueBadge'] ?? null,
                    'home_team' => [
                        'name' => $event['strHomeTeam'] ?? 'Unknown',
                        'logo' => $event['strHomeTeamBadge'] ?? null,
                    ],
                    'away_team' => [
                        'name' => $event['strAwayTeam'] ?? 'Unknown',
                        'logo' => $event['strAwayTeamBadge'] ?? null,
                    ],
                    'round' => $event['intRound'] ?? null,
                    'season' => $event['strSeason'] ?? null,
                ];
            }, array_slice($data['events'], 0, 5)); // Limit to 5 matches

        } catch (\Exception $e) {
            Log::error("Error fetching upcoming matches for team {$team->name}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Format event status
     */
    private function formatStatus(array $event): string
    {
        // Check if the event has a status field
        if (isset($event['strStatus']) && !empty($event['strStatus'])) {
            return $event['strStatus'];
        }

        // If event is in the future
        if (isset($event['dateEvent'])) {
            $eventDate = strtotime($event['dateEvent']);
            $now = time();

            if ($eventDate > $now) {
                return 'Scheduled';
            }
        }

        return 'Upcoming';
    }

    /**
     * Find and update the API team ID for a team using TheSportsDB
     */
    private function findAndUpdateTeamApiId(Team $team, string $apiKey): ?int
    {
        try {
            // Search for the team by name
            $response = Http::timeout(10)
                ->get("https://www.thesportsdb.com/api/v1/json/{$apiKey}/searchteams.php", [
                    't' => $team->name
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['teams']) && is_array($data['teams']) && count($data['teams']) > 0) {
                    // Find the best match (prefer exact matches and soccer teams)
                    $bestMatch = null;

                    foreach ($data['teams'] as $apiTeam) {
                        // Check if it's a soccer/football team
                        if (isset($apiTeam['strSport']) &&
                            in_array(strtolower($apiTeam['strSport']), ['soccer', 'football'])) {

                            // Check for exact name match
                            if (strtolower($apiTeam['strTeam']) === strtolower($team->name)) {
                                $bestMatch = $apiTeam;
                                break;
                            }

                            // Keep first soccer team as fallback
                            if (!$bestMatch) {
                                $bestMatch = $apiTeam;
                            }
                        }
                    }

                    if ($bestMatch) {
                        $apiTeamId = (int) $bestMatch['idTeam'];

                        // Update the team with the API ID
                        $team->update(['api_team_id' => $apiTeamId]);

                        Log::info("Updated team {$team->name} with TheSportsDB ID: {$apiTeamId}");

                        return $apiTeamId;
                    }
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error("Error finding TheSportsDB ID for team {$team->name}: " . $e->getMessage());
            return null;
        }
    }
}
