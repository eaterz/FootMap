<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class FootballDataService
{
    private string $apiKey;
    private string $baseUrl;

    // Competition codes for major leagues
    private array $competitionCodes = [
        'PL',   // Premier League
        'PD',   // La Liga
        'BL1',  // Bundesliga
        'SA',   // Serie A
        'FL1',  // Ligue 1
        'CL',   // Champions League
        'DED',  // Eredivisie
        'PPL',  // Primeira Liga (Portugal)
        'BSA',  // Brasileirão
        'CLI',  // Liga Profesional (Argentina)
    ];

    public function __construct()
    {
        $this->apiKey = config('services.football_data.key');
        $this->baseUrl = 'https://api.football-data.org/v4';
    }

    /**
     * Auto-discover team ID by searching across competitions
     */
    public function findTeamId(string $teamName): ?int
    {
        $normalizedSearchName = $this->normalizeTeamName($teamName);

        Log::info("Auto-searching for team: {$teamName} (normalized: {$normalizedSearchName})");

        // Try each competition until we find a match
        foreach ($this->competitionCodes as $code) {
            $teams = $this->getTeamsFromCompetition($code);

            foreach ($teams as $team) {
                $normalizedApiName = $this->normalizeTeamName($team['name']);

                // Check for exact match
                if ($normalizedApiName === $normalizedSearchName) {
                    Log::info("Found exact match: {$team['name']} (ID: {$team['id']}) in {$code}");
                    return $team['id'];
                }

                // Check for partial match
                if (str_contains($normalizedApiName, $normalizedSearchName) ||
                    str_contains($normalizedSearchName, $normalizedApiName)) {
                    Log::info("Found partial match: {$team['name']} (ID: {$team['id']}) in {$code}");
                    return $team['id'];
                }
            }
        }

        Log::warning("No match found for team: {$teamName}");
        return null;
    }

    /**
     * Normalize team name for better matching
     */
    private function normalizeTeamName(string $name): string
    {
        // Convert to lowercase
        $normalized = strtolower($name);

        // Remove common suffixes/prefixes
        $patterns = [
            '/\b(fc|cf|afc|bfc|cfc|dfc|fk|sc|ac|ss|as|rc|cd|ud|sd)\b/',
            '/\bfootball club\b/',
            '/\bclub\b/',
            '/\bsoccer\b/',
            '/\bsporting\b/',
        ];

        foreach ($patterns as $pattern) {
            $normalized = preg_replace($pattern, '', $normalized);
        }

        // Remove extra spaces and trim
        $normalized = preg_replace('/\s+/', ' ', $normalized);
        $normalized = trim($normalized);

        return $normalized;
    }

    /**
     * Get all competitions
     */
    public function getAllCompetitions(): array
    {
        try {
            $cacheKey = "football_data_all_competitions";

            return Cache::remember($cacheKey, now()->addDays(7), function () {
                $response = Http::withHeaders([
                    'X-Auth-Token' => $this->apiKey,
                ])->get("{$this->baseUrl}/competitions");

                if ($response->successful()) {
                    return $response->json()['competitions'] ?? [];
                }

                return [];
            });
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
            $cacheKey = "football_data_teams_{$competitionCode}";

            return Cache::remember($cacheKey, now()->addDays(7), function () use ($competitionCode) {
                $response = Http::withHeaders([
                    'X-Auth-Token' => $this->apiKey,
                ])->get("{$this->baseUrl}/competitions/{$competitionCode}/teams");

                if ($response->successful()) {
                    return $response->json()['teams'] ?? [];
                }

                return [];
            });
        } catch (\Exception $e) {
            Log::error("Football-Data get teams from competition {$competitionCode} error: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Build comprehensive team database from all competitions
     */
    public function buildTeamDatabase(): array
    {
        $allTeams = [];

        foreach ($this->competitionCodes as $code) {
            $teams = $this->getTeamsFromCompetition($code);

            foreach ($teams as $team) {
                // Use team ID as key to avoid duplicates
                $allTeams[$team['id']] = [
                    'id' => $team['id'],
                    'name' => $team['name'],
                    'short_name' => $team['shortName'] ?? $team['name'],
                    'tla' => $team['tla'] ?? '',
                    'competition' => $code,
                ];
            }
        }

        return $allTeams;
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
     * Verify if a team ID is valid
     */
    public function verifyTeamId(int $teamId): bool
    {
        $team = $this->getTeamById($teamId);
        return $team !== null;
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
