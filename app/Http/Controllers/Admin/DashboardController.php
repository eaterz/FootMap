<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Stadium;
use App\Models\League;
use App\Models\Country;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    public function index(): Response
    {
        // Get statistics
        $stats = [
            'total_teams' => Team::count(),
            'total_stadiums' => Stadium::count(),
            'total_leagues' => League::count(),
            'total_countries' => Country::count(),
            'total_users' => User::count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'regular_users' => User::where('role', 'user')->count(),
        ];

        // Get recent teams (last 5)
        $recent_teams = Team::with(['league', 'stadium', 'country'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo' => $team->logo,
                    'country' => $team->country?->name,
                    'league' => $team->league?->name,
                    'stadium' => $team->stadium?->name,
                    'founded_year' => $team->founded_year,
                    'created_at' => $team->created_at?->format('M d, Y'),
                ];
            });

        // Get teams by country (top 5 countries)
        $teams_by_country_query = Team::query()
            ->join('leagues as l', 'teams.league_id', '=', 'l.id')
            ->select('l.country_id as country_id', DB::raw('count(teams.id) as total'))
            ->groupBy('l.country_id')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        $countryIds = $teams_by_country_query->pluck('country_id')->unique();
        $countries = Country::whereIn('id', $countryIds)->get(['id', 'name'])->keyBy('id');

        $teams_by_country = $teams_by_country_query->map(function ($item) use ($countries) {
            return [
                'country' => $countries->get($item->country_id)?->name ?? 'Unknown',
                'total' => $item->total,
            ];
        });

        // Get teams by league (top 5 leagues)
        $teams_by_league = Team::selectRaw('league_id, count(*) as total')
            ->with('league:id,name')
            ->groupBy('league_id')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'league' => $item->league?->name ?? 'Unknown',
                    'total' => $item->total,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recent_teams' => $recent_teams,
            'teams_by_country' => $teams_by_country,
            'teams_by_league' => $teams_by_league,
        ]);
    }
}
