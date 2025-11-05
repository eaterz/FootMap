<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assuming league IDs: 1=Premier League, 2=La Liga, etc.
        // Stadium IDs: 1=Wembley, 2=Old Trafford, 3=Anfield, 4=Santiago Bernabéu, 5=Camp Nou, 6=Allianz Arena
        DB::table('teams')->insert([
            [
                'league_id' => 1,
                'stadium_id' => 2,
                'name' => 'Manchester United',
                'logo' => 'man_utd_logo.png',
                'founded_year' => '1878-01-01',
                'website' => 'https://www.manutd.com',
            ],
            [
                'league_id' => 1,
                'stadium_id' => 3,
                'name' => 'Liverpool FC',
                'logo' => 'liverpool_logo.png',
                'founded_year' => '1892-01-01',
                'website' => 'https://www.liverpoolfc.com',
            ],
            [
                'league_id' => 2,
                'stadium_id' => 4,
                'name' => 'Real Madrid',
                'logo' => 'real_madrid_logo.png',
                'founded_year' => '1902-01-01',
                'website' => 'https://www.realmadrid.com',
            ],
            [
                'league_id' => 2,
                'stadium_id' => 5,
                'name' => 'FC Barcelona',
                'logo' => 'barcelona_logo.png',
                'founded_year' => '1899-01-01',
                'website' => 'https://www.fcbarcelona.com',
            ],
            [
                'league_id' => 3,
                'stadium_id' => 6,
                'name' => 'Bayern Munich',
                'logo' => 'bayern_logo.png',
                'founded_year' => '1900-01-01',
                'website' => 'https://fcbayern.com',
            ],
            // Add more as needed
        ]);
    }
}
