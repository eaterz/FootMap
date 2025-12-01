<?php

namespace App\Console\Commands;

use App\Services\FootballDataService;
use Illuminate\Console\Command;

class FindFootballDataTeams extends Command
{
    protected $signature = 'teams:find-football-data-ids {competition=PL}';
    protected $description = 'Find Football-Data team IDs from a competition';

    private FootballDataService $footballDataService;

    public function __construct(FootballDataService $footballDataService)
    {
        parent::__construct();
        $this->footballDataService = $footballDataService;
    }

    public function handle()
    {
        $competition = $this->argument('competition');

        $this->info("Fetching teams from competition: {$competition}");
        $this->newLine();

        // Competition codes:
        // PL = Premier League
        // PD = La Liga
        // BL1 = Bundesliga
        // SA = Serie A
        // FL1 = Ligue 1
        // CL = Champions League

        $teams = $this->footballDataService->getTeamsFromCompetition($competition);

        if (empty($teams)) {
            $this->error("No teams found for competition: {$competition}");
            $this->newLine();
            $this->info("Available competition codes:");
            $this->line("PL   - Premier League (England)");
            $this->line("PD   - La Liga (Spain)");
            $this->line("BL1  - Bundesliga (Germany)");
            $this->line("SA   - Serie A (Italy)");
            $this->line("FL1  - Ligue 1 (France)");
            $this->line("CL   - Champions League");
            return 1;
        }

        $this->info("Found " . count($teams) . " teams:");
        $this->newLine();

        $mapping = [];
        foreach ($teams as $team) {
            $this->line("'{$team['name']}' => {$team['id']},");
            $mapping[$team['name']] = $team['id'];
        }

        $this->newLine();
        $this->info("✓ Copy these lines to the \$teamMapping array in FootballDataService.php");

        return 0;
    }
}
