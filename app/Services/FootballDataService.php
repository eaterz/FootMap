<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class FootballDataService
{
    private string $apiKey;
    private string $baseUrl;

    // Manual mapping of your teams to Football-Data.org team IDs
    private array $teamMapping = [
        'Manchester United' => 66,
        'Liverpool FC' => 64,
        'Liverpool' => 64,
        'Real Madrid' => 86,
        'FC Barcelona' => 81,
        'Barcelona' => 81,
        'Bayern Munich' => 5,
        'Bayern München' => 5,
        'Arsenal' => 57,
        'Arsenal FC' => 57,
        'Chelsea' => 61,
        'Chelsea FC' => 61,
        'Manchester City' => 65,
        'Tottenham' => 73,
        'Tottenham Hotspur' => 73,
        'Juventus' => 109,
        'AC Milan' => 98,
        'Inter Milan' => 108,
        'Paris Saint-Germain' => 524,
        'PSG' => 524,
        'Borussia Dortmund' => 4,
        'Atletico Madrid' => 78,
        'Atlético Madrid' => 78,
        // Add more teams as needed
    ];

    public function __construct()
    {
        $this->apiKey = config('services.football_data.key');
        $this->baseUrl = 'https://api.football-data.org/v4';
    }

    /**
     * Get team ID from mapping or search API
     */
    public function getTeamId(string $teamName): ?int
    {
        // First, check our manual mapping
        if (isset($this->teamMapping[$teamName])) {
            Log::info("Found team in mapping: {$teamName} -> {$this->teamMapping[$teamName]}");
            return $this->teamMapping[$teamName];
        }

        // If not in mapping, try to search (but this is unreliable)
        Log::warning("Team not in mapping, attempting API search: {$teamName}");
        return null;
    }

    /**
     * Get all competitions to find teams
     */
    public function getAllCompetitions(): array
    {
        try {
            $response = Http::withHeaders([
                'X-Auth-Token' => $this->apiKey,
            ])->get("{$this->baseUrl}/competitions");

            if ($response->successful()) {
                return $response->json()['competitions'] ?? [];
            }

            return [];
        } catch (\Exception $e) {
            Log::error("Football-Data get competitions error: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Get teams from a specific competition
     */
    public function getTeamsFromCompetition(string $competitionCode): array
    {
        try {
            $response = Http::withHeaders([
                'X-Auth-Token' => $this->apiKey,
            ])->get("{$this->baseUrl}/competitions/{$competitionCode}/teams");

            if ($response->successful()) {
                $teams = $response->json()['teams'] ?? [];

                // Log teams for mapping
                foreach ($teams as $team) {
                    Log::info("Competition {$competitionCode} - Team: {$team['name']} (ID: {$team['id']})");
                }

                return $teams;
            }

            return [];
        } catch (\Exception $e) {
            Log::error("Football-Data get teams from competition error: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Get upcoming matches for a team
     */
    public function getUpcomingMatches(int $teamId, int $limit = 5): array
    {
        try {
            $cacheKey = "football_data_matches_{$teamId}";

            return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($teamId, $limit) {
                $response = Http::withHeaders([
                    'X-Auth-Token' => $this->apiKey,
                ])->get("{$this->baseUrl}/teams/{$teamId}/matches", [
                    'status' => 'SCHEDULED',
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if (isset($data['matches']) && is_array($data['matches'])) {
                        // Take only the first $limit matches
                        return array_slice($data['matches'], 0, $limit);
                    }
                }

                return [];
            });
        } catch (\Exception $e) {
            Log::error("Football-Data get matches error for team {$teamId}: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Get team by ID
     */
    public function getTeamById(int $teamId): ?array
    {
        try {
            $cacheKey = "football_data_team_{$teamId}";

            return Cache::remember($cacheKey, now()->addHours(24), function () use ($teamId) {
                $response = Http::withHeaders([
                    'X-Auth-Token' => $this->apiKey,
                ])->get("{$this->baseUrl}/teams/{$teamId}");

                if ($response->successful()) {
                    return $response->json();
                }

                return null;
            });
        } catch (\Exception $e) {
            Log::error("Football-Data get team error: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Format matches for frontend consumption
     */
    public function formatMatches(array $matches, int $teamId): array
    {
        return array_map(function ($match) use ($teamId) {
            $isHomeTeam = $match['homeTeam']['id'] === $teamId;

            return [
                'id' => $match['id'],
                'date' => $match['utcDate'],
                'timestamp' => strtotime($match['utcDate']),
                'venue' => $match['venue'] ?? 'TBD',
                'status' => $this->formatStatus($match['status']),
                'competition' => $match['competition']['name'] ?? 'Unknown',
                'competition_logo' => $match['competition']['emblem'] ?? null,
                'home_team' => [
                    'id' => $match['homeTeam']['id'],
                    'name' => $match['homeTeam']['name'],
                    'logo' => $match['homeTeam']['crest'] ?? null,
                ],
                'away_team' => [
                    'id' => $match['awayTeam']['id'],
                    'name' => $match['awayTeam']['name'],
                    'logo' => $match['awayTeam']['crest'] ?? null,
                ],
                'round' => $match['matchday'] ? "Matchday {$match['matchday']}" : null,
                'season' => $match['season']['startDate'] ?? null,
                'is_home_team' => $isHomeTeam,
                'referee' => isset($match['referees'][0]) ? $match['referees'][0]['name'] : null,
            ];
        }, $matches);
    }

    /**
     * Format match status
     */
    private function formatStatus(string $status): string
    {
        return match($status) {
            'SCHEDULED' => 'Scheduled',
            'TIMED' => 'Scheduled',
            'IN_PLAY' => 'Live',
            'PAUSED' => 'Half Time',
            'FINISHED' => 'Finished',
            'POSTPONED' => 'Postponed',
            'CANCELLED' => 'Cancelled',
            'SUSPENDED' => 'Suspended',
            default => $status
        };
    }
}
