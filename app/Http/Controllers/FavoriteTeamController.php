<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteTeamController extends Controller
{
    /**
     * Display the user's favorite teams
     */
    public function index(): Response
    {
        $favoriteTeams = Auth::user()
            ->favoriteTeams()
            ->with(['league.country', 'stadium'])
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo' => $team->logo,
                    'founded_year' => $team->founded_year?->format('Y'),
                    'website' => $team->website,
                    'description' => $team->description,
                    'league' => $team->league?->name,
                    'country' => $team->league?->country?->name,
                    'country_flag' => $team->league?->country?->flag,
                    'league_id' => $team->league_id,
                    'stadium' => $team->stadium?->name,
                    'stadium_city' => $team->stadium?->city,
                    'favorited_at' => $team->pivot->created_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('favorites/index', [
            'favoriteTeams' => $favoriteTeams,
        ]);
    }

    /**
     * Add a team to favorites
     */
    public function store(Team $team): JsonResponse
    {
        try {
            $user = Auth::user();


            if ($user->favoriteTeams()->where('team_id', $team->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Team is already in your favorites.',
                    'is_favorited' => true
                ], 400);
            }


            $user->favoriteTeams()->attach($team->id);

            Log::info("Team {$team->id} ({$team->name}) added to favorites for user {$user->id}");

            return response()->json([
                'success' => true,
                'message' => "{$team->name} added to favorites!",
                'is_favorited' => true
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error adding team to favorites: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to add team to favorites.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a team from favorites
     */
    public function destroy(Team $team): JsonResponse
    {
        try {
            $user = Auth::user();

            // Remove from favorites
            $user->favoriteTeams()->detach($team->id);

            Log::info("Team {$team->id} ({$team->name}) removed from favorites for user {$user->id}");

            return response()->json([
                'success' => true,
                'message' => "{$team->name} removed from favorites.",
                'is_favorited' => false
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error removing team from favorites: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove team from favorites.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if a team is favorited (for API/AJAX requests)
     */
    public function check(Team $team): JsonResponse
    {
        $isFavorited = Auth::user()
            ->favoriteTeams()
            ->where('team_id', $team->id)
            ->exists();

        return response()->json(['is_favorited' => $isFavorited]);
    }
}
