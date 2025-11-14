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
                'country_id' => 114,
                'city' => "London",
                'name' => 'Wembley Stadium',
                'latitude' => 51.5560,
                'longitude' => -0.2795,
                'capacity' => 90000,
                'image' => 'https://seatpick.com/_next/image?url=https%3A%2F%2Fsp-static-images.s3.amazonaws.com%2FWembley_Stadium_interior_cdngjd%2F1200x630_auto%2FWembley_Stadium_interior_cdngjd.jpg&w=3840&q=75',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 114,
                'city' => "Manchester",
                'name' => 'Old Trafford',
                'latitude' => 53.4631,
                'longitude' => -2.2913,
                'capacity' => 74879,
                'image' => 'https://ik.imagekit.io/enmedia/Football/old-trafford.webp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 114,
                'city' => "Liverpool",
                'name' => 'Anfield',
                'latitude' => 53.4308,
                'longitude' => -2.9608,
                'capacity' => 53394,
                'image' => 'https://www.tottenhamhotspur.com/media/giwiqrww/anfield11.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 114,
                'city' => "London",
                'name' => 'Emirates Stadium',
                'latitude' => 51.5549,
                'longitude' => -0.1084,
                'capacity' => 60704,
                'image' => 'https://www.arsenal.com/sites/default/files/styles/link_image_extra_large/public/images/GettyImages-884411976.jpg?auto=webp&itok=w7-4LWKS',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 114,
                'city' => "London",
                'name' => 'Stamford Bridge',
                'latitude' => 51.4816,
                'longitude' => -0.1909,
                'capacity' => 40834,
                'image' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Stamford_Bridge_Clear_Skies.JPG/1200px-Stamford_Bridge_Clear_Skies.JPG',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 114,
                'city' => "Manchester",
                'name' => 'Etihad Stadium',
                'latitude' => 53.4831,
                'longitude' => -2.2004,
                'capacity' => 53400,
                'image' => 'https://upload.wikimedia.org/wikipedia/commons/1/18/Manchester_city_etihad_stadium_%28cropped%29.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 150,
                'city' => "Madrid",
                'name' => 'Santiago Bernabéu',
                'latitude' => 40.4531,
                'longitude' => -3.6883,
                'capacity' => 81044,
                'image' => 'https://assets.realmadrid.com/is/image/realmadrid/foto%201?$Mobile$&fit=wrap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 150,
                'city' => "Barcelona",
                'name' => 'Camp Nou',
                'latitude' => 41.3809,
                'longitude' => 2.1228,
                'capacity' => 99354,
                'image' => 'https://www.fcbarcelona.com/photo-resources/2021/08/09/276ad270-e5c6-453d-8d9f-212417ad7cb3/Camp-Nou-3.jpg?width=1200&height=750',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 150,
                'city' => "Madrid",
                'name' => 'Wanda Metropolitano',
                'latitude' => 40.4362,
                'longitude' => -3.5995,
                'capacity' => 68456,
                'image' => 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Atleti_vs_Villarreal_-_September_2025.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 120,
                'city' => "Munich",
                'name' => 'Allianz Arena',
                'latitude' => 48.2188,
                'longitude' => 11.6247,
                'capacity' => 75024,
                'image' => 'https://img.fcbayern.com/image/upload/f_auto/q_auto/t_cms-16x9-seo/v1601458426/cms/public/images/allianz-arena/stadion-innenraum/aa_haupttribuene.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'country_id' => 120,
                'city' => "Dortmund",
                'name' => 'Signal Iduna Park',
                'latitude' => 51.4925,
                'longitude' => 7.4517,
                'capacity' => 81365,
                'image' => 'https://upload.wikimedia.org/wikipedia/commons/1/13/Signal_iduna_park_stadium_dortmund_4.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more as needed
        ]);
    }
}
