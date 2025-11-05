<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assuming country IDs: 1=England, 2=Spain, etc.
        DB::table('cities')->insert([
            ['country_id' => 1, 'name' => 'London'],
            ['country_id' => 1, 'name' => 'Manchester'],
            ['country_id' => 1, 'name' => 'Liverpool'],
            ['country_id' => 2, 'name' => 'Madrid'],
            ['country_id' => 2, 'name' => 'Barcelona'],
            ['country_id' => 3, 'name' => 'Munich'],
            ['country_id' => 3, 'name' => 'Berlin'],
            ['country_id' => 4, 'name' => 'Milan'],
            ['country_id' => 4, 'name' => 'Rome'],
            ['country_id' => 5, 'name' => 'Paris'],
            ['country_id' => 6, 'name' => 'Rio de Janeiro'],
            ['country_id' => 7, 'name' => 'Buenos Aires'],
            // Add more as needed
        ]);
    }
}
