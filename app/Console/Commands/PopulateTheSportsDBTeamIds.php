<?php

namespace App\Console\Commands;

use App\Models\Team;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PopulateTheSportsDBTeamIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teams:populate-thesportsdb-ids {--team= : Specific team ID to update}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate TheSportsDB team IDs for teams by searching the API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // TheSportsDB uses '3' for free tier
        $apiKey = config('services.thesportsdb_api.key', '3');

        $teamId = $this->option('team');

        if ($teamId) {
            // Update specific team
            $team = Team::find($teamId);
            if (!$team) {
                $this->error("Team with ID {$teamId} not found.");
                return 1;
            }
            $this->updateTeam($team, $apiKey);
        } else {
            // Update all teams
            $teams = Team::whereNull('api_team_id')->get();

            if ($teams->isEmpty()) {
                $this->info('All teams already have API IDs assigned.');
                return 0;
            }

            $this->info("Found {$teams->count()} teams without API IDs.");
            $this->newLine();

            $progressBar = $this->output->createProgressBar($teams->count());
            $progressBar->start();

            foreach ($teams as $team) {
                $this->updateTeam($team, $apiKey);
                $progressBar->advance();

                // Respect API rate limits (wait 1 second between requests)
                sleep(1);
            }

            $progressBar->finish();
            $this->newLine(2);
        }

        $updated = Team::whereNotNull('api_team_id')->count();
        $total = Team::count();

        $this->info("✓ Complete! {$updated}/{$total} teams now have TheSportsDB IDs.");

        return 0;
    }

    /**
     * Update a single team with TheSportsDB ID
     */
    private function updateTeam(Team $team, string $apiKey): void
    {
        try {
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

                        $team->update([
                            'api_team_id' => $apiTeamId
                        ]);

                        if (!$this->option('quiet')) {
                            $this->line("\n✓ {$team->name} → TheSportsDB ID: {$apiTeamId}");
                        }

                        Log::info("Updated team TheSportsDB ID: {$team->name} → {$apiTeamId}");
                    } else {
                        if (!$this->option('quiet')) {
                            $this->line("\n✗ {$team->name} → No soccer/football team found");
                        }
                        Log::warning("No soccer team found for: {$team->name}");
                    }
                } else {
                    if (!$this->option('quiet')) {
                        $this->line("\n✗ {$team->name} → Not found in API");
                    }
                    Log::warning("Team not found in TheSportsDB: {$team->name}");
                }
            } else {
                $this->warn("\n✗ API request failed for {$team->name}");
                Log::error("TheSportsDB API request failed for team: {$team->name}");
            }
        } catch (\Exception $e) {
            $this->error("\n✗ Error updating {$team->name}: {$e->getMessage()}");
            Log::error("Error updating team TheSportsDB ID: {$team->name} - {$e->getMessage()}");
        }
    }
}
