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
                'logo' => 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
                'founded_year' => '1878-01-01',
                'description' => 'Manchester United Football Club is one of the most successful and popular football clubs in the world. Known as the Red Devils, the club has won numerous domestic and international titles, including multiple Premier League championships and UEFA Champions League trophies. Based in Old Trafford, Manchester United has a rich history and a global fanbase.',
                'website' => 'https://www.manutd.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'league_id' => 1,
                'stadium_id' => 3,
                'name' => 'Liverpool FC',
                'logo' => 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
                'founded_year' => '1892-01-01',
                'description' => 'Liverpool Football Club, known as the Reds, is one of England\'s most decorated clubs with a passionate global following. The club has won numerous league titles and is particularly renowned for its European success, having won the Champions League multiple times. Playing at the iconic Anfield stadium, Liverpool is famous for its passionate supporters and the tradition of "You\'ll Never Walk Alone".',
                'website' => 'https://www.liverpoolfc.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'league_id' => 2,
                'stadium_id' => 4,
                'name' => 'Real Madrid',
                'logo' => 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
                'founded_year' => '1902-01-01',
                'description' => 'Real Madrid Club de Fútbol is one of the most successful football clubs in history. Los Blancos have won a record number of European Cup/Champions League titles and numerous La Liga championships. Based at the Santiago Bernabéu Stadium in Madrid, the club is known for its "Galácticos" policy of signing world-class players and its rich tradition of excellence.',
                'website' => 'https://www.realmadrid.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'league_id' => 2,
                'stadium_id' => 5,
                'name' => 'FC Barcelona',
                'logo' => 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
                'founded_year' => '1899-01-01',
                'description' => 'FC Barcelona, also known as Barça, is a legendary Catalan club with the motto "Més que un club" (More than a club). Famous for its distinctive playing style based on possession and attacking football, Barcelona has won numerous domestic and international titles. The club has been home to some of football\'s greatest players and plays at the iconic Camp Nou stadium.',
                'website' => 'https://www.fcbarcelona.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'league_id' => 3,
                'stadium_id' => 6,
                'name' => 'Bayern Munich',
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
                'founded_year' => '1900-01-01',
                'description' => 'FC Bayern München is Germany\'s most successful football club, dominating the Bundesliga with numerous championships. Known for their efficient and powerful style of play, Bayern has also achieved significant success in European competitions. Based at the modern Allianz Arena in Munich, the club is renowned for its strong organization, youth development, and consistent excellence.',
                'website' => 'https://fcbayern.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more as needed
        ]);
    }
}
