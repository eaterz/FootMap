<?php

namespace App\Console\Commands;

use App\Models\Team;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PopulateApiTeamIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teams:populate-api-ids {--team= : Specific team ID to update}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate API team IDs for teams by searching the Football API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apiKey = config('services.football_api.key');

        if (!$apiKey) {
            $this->error('Football API key not configured. Please add FOOTBALL_API_KEY to your .env file.');
            return 1;
        }

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

        $this->info("✓ Complete! {$updated}/{$total} teams now have API IDs.");

        return 0;
    }

    /**
     * Update a single team with API ID
     */
    private function updateTeam(Team $team, string $apiKey): void
    {
        try {
            $response = Http::withHeaders([
                'x-rapidapi-key' => $apiKey,
                'x-rapidapi-host' => 'api-football-v1.p.rapidapi.com'
            ])->get('https://api-football-v1.p.rapidapi.com/v3/teams', [
                'search' => $team->name
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['response']) && count($data['response']) > 0) {
                    $apiTeam = $data['response'][0]['team'];

                    $team->update([
                        'api_team_id' => $apiTeam['id']
                    ]);

                    if (!$this->option('quiet')) {
                        $this->line("\n✓ {$team->name} → API ID: {$apiTeam['id']}");
                    }

                    Log::info("Updated team API ID: {$team->name} → {$apiTeam['id']}");
                } else {
                    if (!$this->option('quiet')) {
                        $this->line("\n✗ {$team->name} → Not found in API");
                    }
                    Log::warning("Team not found in API: {$team->name}");
                }
            } else {
                $this->warn("\n✗ API request failed for {$team->name}");
                Log::error("API request failed for team: {$team->name}");
            }
        } catch (\Exception $e) {
            $this->error("\n✗ Error updating {$team->name}: {$e->getMessage()}");
            Log::error("Error updating team API ID: {$team->name} - {$e->getMessage()}");
        }
    }
}
