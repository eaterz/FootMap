<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeagueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assuming country IDs: 1=England, 2=Spain, etc.
        DB::table('leagues')->insert([
            ['country_id' => 1, 'name' => 'Premier League', 'logo' => 'premier_league_logo.png'],
            ['country_id' => 2, 'name' => 'La Liga', 'logo' => 'la_liga_logo.png'],
            ['country_id' => 3, 'name' => 'Bundesliga', 'logo' => 'bundesliga_logo.png'],
            ['country_id' => 4, 'name' => 'Serie A', 'logo' => 'serie_a_logo.png'],
            ['country_id' => 5, 'name' => 'Ligue 1', 'logo' => 'ligue_1_logo.png'],
            ['country_id' => 6, 'name' => 'Campeonato Brasileiro Série A', 'logo' => 'serie_a_br_logo.png'],
            ['country_id' => 7, 'name' => 'Primera División', 'logo' => 'primera_division_ar_logo.png'],
            // Add more as needed
        ]);
    }
}
