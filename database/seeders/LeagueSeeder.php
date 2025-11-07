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
        DB::table('leagues')->insert([
            [
                'country_id' => 1,
                'name' => 'Premier League',
                'logo' => 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png',
                'founded_year' => '1992-02-20',
                'description' => 'The top level of the English football league system, contested by 20 clubs.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 2,
                'name' => 'La Liga',
                'logo' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ157bazeHVrTqhMy5hl5HR2-_81U0PoQOnnw&s',
                'founded_year' => '1929-01-01',
                'description' => 'The men\'s top professional football division of the Spanish football league system.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 3,
                'name' => 'Bundesliga',
                'logo' => 'https://upload.wikimedia.org/wikipedia/lv/d/df/Bundesliga_logo_%282017%29.svg',
                'founded_year' => '1962-01-01',
                'description' => 'A professional association football league in Germany at the top of the German football league system.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 4,
                'name' => 'Serie A',
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Serie_A.svg/966px-Serie_A.svg.png',
                'founded_year' => '1898-01-01',
                'description' => 'A professional league competition for football clubs located at the top of the Italian football league system.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 5,
                'name' => 'Ligue 1',
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Logo_Ligue_1_McDonald%27s_2024.svg',
                'founded_year' => '1932-09-11',
                'description' => 'A French professional league for men\'s association football clubs at the top of the French football league system.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 6,
                'name' => 'Campeonato Brasileiro Série A',
                'logo' => 'https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Logo_-_Brasileir%C3%A3o_Serie_A_%282024%29.svg/930px-Logo_-_Brasileir%C3%A3o_Serie_A_%282024%29.svg.png',
                'founded_year' => '1971-01-01',
                'description' => 'The top tier of the Brazilian football league system, contested by 20 clubs.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 7,
                'name' => 'Primera División',
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Logo_Primera_Divisi%C3%B3n_de_El_Salvador.jpg/250px-Logo_Primera_Divisi%C3%B3n_de_El_Salvador.jpg',
                'founded_year' => '1891-04-12',
                'description' => 'The top division of the Argentine football league system.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
