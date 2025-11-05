<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StadiumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assuming country and city IDs
        // England (1): London(1), Manchester(2), Liverpool(3)
        // Spain (2): Madrid(4), Barcelona(5)
        // etc.
        DB::table('stadiums')->insert([
            [
                'country_id' => 1,
                'city_id' => 1,
                'name' => 'Wembley Stadium',
                'latitude' => 51.5560,
                'longitude' => -0.2795,
                'capacity' => 90000,
            ],
            [
                'country_id' => 1,
                'city_id' => 2,
                'name' => 'Old Trafford',
                'latitude' => 53.4631,
                'longitude' => -2.2913,
                'capacity' => 74879,
            ],
            [
                'country_id' => 1,
                'city_id' => 3,
                'name' => 'Anfield',
                'latitude' => 53.4308,
                'longitude' => -2.9608,
                'capacity' => 53394,
            ],
            [
                'country_id' => 2,
                'city_id' => 4,
                'name' => 'Santiago Bernabéu',
                'latitude' => 40.4531,
                'longitude' => -3.6883,
                'capacity' => 81044,
            ],
            [
                'country_id' => 2,
                'city_id' => 5,
                'name' => 'Camp Nou',
                'latitude' => 41.3809,
                'longitude' => 2.1228,
                'capacity' => 99354,
            ],
            [
                'country_id' => 3,
                'city_id' => 6,
                'name' => 'Allianz Arena',
                'latitude' => 48.2188,
                'longitude' => 11.6247,
                'capacity' => 75024,
            ],
            // Add more as needed
        ]);
    }
}
