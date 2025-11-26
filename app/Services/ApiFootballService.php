<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ApiFootballService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.api_football.key');
        $this->baseUrl = config('services.api_football.base_url');
    }

    /**
     * Search for a team by name
     */
    public function searchTeam(string $teamName): ?array
    {
        try {
            $response = Http::withHeaders([
                'x-apisports-key' => $this->apiKey,
            ])->get("{$this->baseUrl}/teams", [
                'search' => $teamName,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['response']) && count($data['response']) > 0) {
                    // Return the first match
                    return $data['response'][0];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error("API Football search team error: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Get upcoming fixtures for a team
     */
    public function getUpcomingFixtures(int $teamId, int $limit = 5): array
    {
        try {
            $cacheKey = "api_football_fixtures_{$teamId}";

            return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($teamId, $limit) {
                $response = Http::withHeaders([
                    'x-apisports-key' => $this->apiKey,
                ])->get("{$this->baseUrl}/fixtures", [
                    'team' => $teamId,
                    'next' => $limit,
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if (isset($data['response']) && is_array($data['response'])) {
                        return $data['response'];
                    }
                }

                return [];
            });
        } catch (\Exception $e) {
            Log::error("API Football get fixtures error: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Get team statistics
     */
    public function getTeamStatistics(int $teamId, int $season, int $leagueId): ?array
    {
        try {
            $cacheKey = "api_football_stats_{$teamId}_{$season}_{$leagueId}";

            return Cache::remember($cacheKey, now()->addHours(24), function () use ($teamId, $season, $leagueId) {
                $response = Http::withHeaders([
                    'x-apisports-key' => $this->apiKey,
                ])->get("{$this->baseUrl}/teams/statistics", [
                    'team' => $teamId,
                    'season' => $season,
                    'league' => $leagueId,
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if (isset($data['response'])) {
                        return $data['response'];
                    }
                }

                return null;
            });
        } catch (\Exception $e) {
            Log::error("API Football get team statistics error: {$e->getMessage()}");
            return null;
        }
    }
}
