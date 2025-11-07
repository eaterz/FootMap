<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\Country;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    /**
     * Display a listing of the leagues.
     */
    public function index(): Response
    {
        $leagues = League::with('country')
            ->latest()
            ->paginate(10)
            ->through(function ($league) {
                return [
                    'id' => $league->id,
                    'name' => $league->name,
                    'logo' => $league->logo,
                    'founded_year' => $league->founded_year?->format('Y'),
                    'description' => $league->description,
                    'country' => $league->country?->name,
                    'created_at' => $league->created_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('admin/leagues/index', [
            'leagues' => $leagues,
        ]);
    }

    /**
     * Show the form for creating a new league.
     */
    public function create(): Response
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/leagues/create', [
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created league in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:100',
            'logo' => 'nullable|string|max:255',
            'founded_year' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        League::create($validated);

        return redirect()->route('admin.leagues.index')->with('success', 'League created successfully.');
    }

    /**
     * Display the specified league.
     */
    public function show(League $league): Response
    {
        $league->load('country');

        return Inertia::render('admin/leagues/show', [
            'league' => [
                'id' => $league->id,
                'name' => $league->name,
                'logo' => $league->logo,
                'founded_year' => $league->founded_year?->format('Y'),
                'description' => $league->description,
                'country' => $league->country?->name,
                'created_at' => $league->created_at?->format('M d, Y H:i'),
                'updated_at' => $league->updated_at?->format('M d, Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified league.
     */
    public function edit(League $league): Response
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/leagues/edit', [
            'league' => $league,
            'countries' => $countries,
        ]);
    }

    /**
     * Update the specified league in storage.
     */
    public function update(Request $request, League $league): RedirectResponse
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:100',
            'logo' => 'nullable|string|max:255',
            'founded_year' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $league->update($validated);

        return redirect()->route('admin.leagues.index')->with('success', 'League updated successfully.');
    }

    /**
     * Remove the specified league from storage.
     */
    public function destroy(League $league): RedirectResponse
    {
        $league->delete();

        return redirect()->route('admin.leagues.index')->with('success', 'League deleted successfully.');
    }
}
