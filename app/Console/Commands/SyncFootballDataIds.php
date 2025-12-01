<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Services\FootballDataService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncFootballDataIds extends Command
{
    protected $signature = 'teams:sync-football-data-ids
                            {--team= : Specific team ID to update}
                            {--force : Force update even if Football-Data ID exists}
                            {--limit=10 : Maximum number of teams to process}
                            {--build-db : Build comprehensive team database}';

    protected $description = 'Automatically sync Football-Data IDs for teams';

    private FootballDataService $footballDataService;

    public function __construct(FootballDataService $footballDataService)
    {
        parent::__construct();
        $this->footballDataService = $footballDataService;
    }

    public function handle()
    {
        // Build team database if requested
        if ($this->option('build-db')) {
            return $this->buildTeamDatabase();
        }

        $teamId = $this->option('team');
        $force = $this->option('force');
        $limit = (int) $this->option('limit');

        if ($teamId) {
            return $this->updateSpecificTeam($teamId, $force);
        }

        return $this->updateMultipleTeams($force, $limit);
    }

    /**
     * Build comprehensive team database
     */
    private function buildTeamDatabase(): int
    {
        $this->info("Building comprehensive team database from all competitions...");
        $this->newLine();

        $allTeams = $this->footballDataService->buildTeamDatabase();

        $this->info("Found " . count($allTeams) . " unique teams across all competitions.");
        $this->newLine();

        // Display teams grouped by first letter
        $groupedTeams = collect($allTeams)->groupBy(function ($team) {
            return strtoupper(substr($team['name'], 0, 1));
        })->sortKeys();

        foreach ($groupedTeams as $letter => $teams) {
            $this->line("=== {$letter} ===");
            foreach ($teams as $team) {
                $this->line("'{$team['name']}' => {$team['id']}, // {$team['competition']}");
            }
            $this->newLine();
        }

        $this->info("You can add any of these teams to your \$teamMapping array if needed.");

        return 0;
    }

    /**
     * Update a specific team
     */
    private function updateSpecificTeam(int $teamId, bool $force): int
    {
        $team = Team::find($teamId);

        if (!$team) {
            $this->error("Team with ID {$teamId} not found.");
            return 1;
        }

        if ($team->football_data_id && !$force) {
            $this->info("Team '{$team->name}' already has Football-Data ID: {$team->football_data_id}");
            $this->info("Use --force to update anyway.");
            return 0;
        }

        $this->updateTeam($team);
        return 0;
    }

    /**
     * Update multiple teams
     */
    private function updateMultipleTeams(bool $force, int $limit): int
    {
        $query = Team::query();

        if (!$force) {
            $query->whereNull('football_data_id');
        }

        $teams = $query->limit($limit)->get();

        if ($teams->isEmpty()) {
            $this->info('No teams found to update.');
            return 0;
        }

        $this->info("Found {$teams->count()} teams to process.");
        $this->newLine();

        $progressBar = $this->output->createProgressBar($teams->count());
        $progressBar->start();

        $successful = 0;
        $failed = 0;

        foreach ($teams as $team) {
            if ($this->updateTeam($team)) {
                $successful++;
            } else {
                $failed++;
            }

            $progressBar->advance();

            // Small delay to be respectful to the API
            if ($teams->count() > 1) {
                usleep(500000); // 0.5 second
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        // Summary
        $this->info("✓ Successfully updated: {$successful}");
        if ($failed > 0) {
            $this->warn("✗ Failed to update: {$failed}");
        }

        $total = Team::count();
        $withIds = Team::whereNotNull('football_data_id')->count();
        $this->info("Total: {$withIds}/{$total} teams now have Football-Data IDs.");

        return 0;
    }

    /**
     * Update a single team with Football-Data ID
     */
    private function updateTeam(Team $team): bool
    {
        try {
            $teamId = $this->footballDataService->findTeamId($team->name);

            if ($teamId) {
                $oldId = $team->football_data_id;

                $team->update([
                    'football_data_id' => $teamId
                ]);

                $message = $oldId
                    ? "Updated: {$team->name} ({$oldId} → {$teamId})"
                    : "Assigned: {$team->name} → {$teamId}";

                if (!$this->option('quiet')) {
                    $this->line("\n✓ " . $message);
                }

                Log::info($message);
                return true;
            } else {
                if (!$this->option('quiet')) {
                    $this->line("\n✗ {$team->name} → Not found in Football-Data competitions");
                }
                Log::warning("Team not found in Football-Data: {$team->name}");
                return false;
            }
        } catch (\Exception $e) {
            $this->error("\n✗ Error updating {$team->name}: {$e->getMessage()}");
            Log::error("Error updating team Football-Data ID: {$team->name} - {$e->getMessage()}");
            return false;
        }
    }
}
