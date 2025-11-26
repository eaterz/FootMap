<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Services\ApiFootballService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PopulateApiFootballIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teams:populate-api-football-ids {--team= : Specific team ID to update}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate API Football IDs for teams by searching the API';

    private ApiFootballService $apiFootballService;

    public function __construct(ApiFootballService $apiFootballService)
    {
        parent::__construct();
        $this->apiFootballService = $apiFootballService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $teamId = $this->option('team');

        if ($teamId) {
            // Update specific team
            $team = Team::find($teamId);
            if (!$team) {
                $this->error("Team with ID {$teamId} not found.");
                return 1;
            }
            $this->updateTeam($team);
        } else {
            // Update all teams without API Football ID
            $teams = Team::whereNull('api_football_id')->get();

            if ($teams->isEmpty()) {
                $this->info('All teams already have API Football IDs assigned.');
                return 0;
            }

            $this->info("Found {$teams->count()} teams without API Football IDs.");
            $this->newLine();

            $progressBar = $this->output->createProgressBar($teams->count());
            $progressBar->start();

            foreach ($teams as $team) {
                $this->updateTeam($team);
                $progressBar->advance();

                // Respect API rate limits (100 requests per day on free tier)
                // Wait 1 second between requests to be safe
                sleep(1);
            }

            $progressBar->finish();
            $this->newLine(2);
        }

        $updated = Team::whereNotNull('api_football_id')->count();
        $total = Team::count();

        $this->info("✓ Complete! {$updated}/{$total} teams now have API Football IDs.");

        return 0;
    }

    /**
     * Update a single team with API Football ID
     */
    private function updateTeam(Team $team): void
    {
        try {
            $apiTeam = $this->apiFootballService->searchTeam($team->name);

            if ($apiTeam && isset($apiTeam['team']['id'])) {
                $team->update([
                    'api_football_id' => $apiTeam['team']['id']
                ]);

                if (!$this->option('quiet')) {
                    $this->line("\n✓ {$team->name} → API Football ID: {$apiTeam['team']['id']}");
                }

                Log::info("Updated team API Football ID: {$team->name} → {$apiTeam['team']['id']}");
            } else {
                if (!$this->option('quiet')) {
                    $this->line("\n✗ {$team->name} → Not found in API Football");
                }
                Log::warning("Team not found in API Football: {$team->name}");
            }
        } catch (\Exception $e) {
            $this->error("\n✗ Error updating {$team->name}: {$e->getMessage()}");
            Log::error("Error updating team API Football ID: {$team->name} - {$e->getMessage()}");
        }
    }
}
