<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assuming continent IDs: 1=Africa, 2=Asia, 3=Europe, etc.
        DB::table('countries')->insert([
            ['continent_id' => 3, 'name' => 'England', 'flag' => '🇬🇧'],
            ['continent_id' => 3, 'name' => 'Spain', 'flag' => '🇪🇸'],
            ['continent_id' => 3, 'name' => 'Germany', 'flag' => '🇩🇪'],
            ['continent_id' => 3, 'name' => 'Italy', 'flag' => '🇮🇹'],
            ['continent_id' => 3, 'name' => 'France', 'flag' => '🇫🇷'],
            ['continent_id' => 5, 'name' => 'Brazil', 'flag' => '🇧🇷'],
            ['continent_id' => 5, 'name' => 'Argentina', 'flag' => '🇦🇷'],
            // Add more as needed
        ]);
    }
}
