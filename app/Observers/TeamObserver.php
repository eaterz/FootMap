<?php

namespace App\Observers;

use App\Models\Team;
use App\Services\FootballDataService;
use Illuminate\Support\Facades\Log;

class TeamObserver
{
    private FootballDataService $footballDataService;

    public function __construct(FootballDataService $footballDataService)
    {
        $this->footballDataService = $footballDataService;
    }

    /**
     * Handle the Team "created" event.
     */
    public function created(Team $team): void
    {
        // Only try to find Football-Data ID if not already set
        if (!$team->football_data_id) {
            $this->findAndSetFootballDataId($team);
        }
    }

    /**
     * Handle the Team "updated" event.
     */
    public function updated(Team $team): void
    {
        // If the team name changed and we don't have a Football-Data ID, try to find it
        if ($team->wasChanged('name') && !$team->football_data_id) {
            $this->findAndSetFootballDataId($team);
        }
    }

    /**
     * Find and set the Football-Data ID for a team
     */
    private function findAndSetFootballDataId(Team $team): void
    {
        try {
            $teamId = $this->footballDataService->findTeamId($team->name);

            if ($teamId) {
                // Use updateQuietly to avoid triggering the observer again
                $team->updateQuietly([
                    'football_data_id' => $teamId
                ]);

                Log::info("Auto-assigned Football-Data ID for team: {$team->name} -> {$teamId}");
            } else {
                Log::warning("Could not find Football-Data ID for team: {$team->name}");
            }
        } catch (\Exception $e) {
            Log::error("Error auto-assigning Football-Data ID for team {$team->name}: {$e->getMessage()}");
        }
    }
}
