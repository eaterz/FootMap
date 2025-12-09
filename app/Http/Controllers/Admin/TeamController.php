<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\League;
use App\Models\Stadium;
use App\Services\FootballDataService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    private FootballDataService $footballDataService;

    public function __construct(FootballDataService $footballDataService)
    {
        $this->footballDataService = $footballDataService;
    }

    public function index(): Response
    {
        $teams = Team::with(['league.country', 'stadium'])
            ->latest()
            ->paginate(10)
            ->through(function ($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo' => $team->logo,
                    'founded_year' => $team->founded_year?->format('Y'),
                    'website' => $team->website,
                    'league' => $team->league?->name,
                    'country' => $team->league?->country?->name,
                    'stadium' => $team->stadium?->name,
                    'football_data_id' => $team->football_data_id,
                    'created_at' => $team->created_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('admin/teams/index', [
            'teams' => $teams,
        ]);
    }

    public function create(): Response
    {
        $leagues = League::with('country')
            ->select('id', 'name', 'country_id')
            ->orderBy('name')
            ->get()
            ->map(function ($league) {
                return [
                    'id' => $league->id,
                    'name' => $league->name,
                    'country' => $league->country?->name,
                ];
            });

        $stadiums = Stadium::with('country')
            ->select('id', 'name', 'country_id', 'city')
            ->orderBy('name')
            ->get()
            ->map(function ($stadium) {
                return [
                    'id' => $stadium->id,
                    'name' => $stadium->name,
                    'city' => $stadium->city,
                    'country' => $stadium->country?->name,
                ];
            });

        return Inertia::render('admin/teams/create', [
            'leagues' => $leagues,
            'stadiums' => $stadiums,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'stadium_id' => 'required|exists:stadiums,id',
            'name' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'founded_year' => 'required|date',
            'website' => 'nullable|url|max:250',
        ]);

        // Handle file upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('teams/logos', 'public');
        }

        // Create the team
        $team = Team::create($validated);

        // Automatically find and assign Football-Data ID
        try {
            $footballDataId = $this->footballDataService->findTeamId($team->name);

            if ($footballDataId) {
                $team->update(['football_data_id' => $footballDataId]);

                Log::info("Successfully assigned Football-Data ID for team: {$team->name} -> {$footballDataId}");

                return redirect()
                    ->route('admin.teams.index')
                    ->with('success', "Team created successfully! Football-Data API integrated (ID: {$footballDataId}).");
            } else {
                Log::warning("Could not find Football-Data ID for team: {$team->name}");

                return redirect()
                    ->route('admin.teams.index')
                    ->with('warning', 'Team created successfully, but no matching team found in Football-Data API. Upcoming matches may not be available.');
            }
        } catch (\Exception $e) {
            Log::error("Error finding Football-Data ID for team {$team->name}: {$e->getMessage()}");

            return redirect()
                ->route('admin.teams.index')
                ->with('warning', 'Team created successfully, but there was an error connecting to Football-Data API. You can try syncing later.');
        }
    }

    public function show(Team $team): Response
    {
        $team->load(['league.country', 'stadium']);

        return Inertia::render('admin/teams/show', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'logo' => $team->logo ? Storage::url($team->logo) : null,
                'founded_year' => $team->founded_year?->format('Y'),
                'website' => $team->website,
                'league' => $team->league?->name,
                'country' => $team->league?->country?->name,
                'stadium' => $team->stadium?->name,
                'football_data_id' => $team->football_data_id,
                'created_at' => $team->created_at?->format('M d, Y H:i'),
                'updated_at' => $team->updated_at?->format('M d, Y H:i'),
            ],
        ]);
    }

    public function edit(Team $team): Response
    {
        $leagues = League::with('country')
            ->select('id', 'name', 'country_id')
            ->orderBy('name')
            ->get()
            ->map(function ($league) {
                return [
                    'id' => $league->id,
                    'name' => $league->name,
                    'country' => $league->country?->name,
                ];
            });

        $stadiums = Stadium::with('country')
            ->select('id', 'name', 'country_id', 'city')
            ->orderBy('name')
            ->get()
            ->map(function ($stadium) {
                return [
                    'id' => $stadium->id,
                    'name' => $stadium->name,
                    'city' => $stadium->city,
                    'country' => $stadium->country?->name,
                ];
            });

        return Inertia::render('admin/teams/edit', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'league_id' => $team->league_id,
                'stadium_id' => $team->stadium_id,
                'logo' => $team->logo ? Storage::url($team->logo) : null,
                'logo_path' => $team->logo,
                'founded_year' => $team->founded_year?->format('Y-m-d'),
                'website' => $team->website,
                'football_data_id' => $team->football_data_id,
            ],
            'leagues' => $leagues,
            'stadiums' => $stadiums,
        ]);
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'stadium_id' => 'required|exists:stadiums,id',
            'name' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'founded_year' => 'required|date',
            'website' => 'nullable|url|max:250',
        ]);

        $oldName = $team->name;
        $nameChanged = $oldName !== $validated['name'];

        // Handle file upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($team->logo && !filter_var($team->logo, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($team->logo);
            }
            $validated['logo'] = $request->file('logo')->store('teams/logos', 'public');
        }

        $team->update($validated);

        // If team name changed, try to find new Football-Data ID
        if ($nameChanged) {
            try {
                $footballDataId = $this->footballDataService->findTeamId($team->name);

                if ($footballDataId) {
                    $team->update(['football_data_id' => $footballDataId]);

                    Log::info("Updated Football-Data ID for renamed team: {$oldName} -> {$team->name} (ID: {$footballDataId})");

                    return redirect()
                        ->route('admin.teams.index')
                        ->with('success', "Team updated successfully! Football-Data API re-synced (ID: {$footballDataId}).");
                } else {
                    // Clear the old football_data_id if no match found
                    $team->update(['football_data_id' => null]);

                    Log::warning("Could not find Football-Data ID for renamed team: {$team->name}");

                    return redirect()
                        ->route('admin.teams.index')
                        ->with('warning', 'Team updated successfully, but no matching team found in Football-Data API.');
                }
            } catch (\Exception $e) {
                Log::error("Error finding Football-Data ID for renamed team {$team->name}: {$e->getMessage()}");
            }
        }

        return redirect()
            ->route('admin.teams.index')
            ->with('success', 'Team updated successfully.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        // Delete logo file if exists
        if ($team->logo && !filter_var($team->logo, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($team->logo);
        }

        $team->delete();

        return redirect()
            ->route('admin.teams.index')
            ->with('success', 'Team deleted successfully.');
    }
}
