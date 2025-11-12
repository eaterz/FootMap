<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\Country;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
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
                    'resource_url' => $league->resource_url,
                    'country' => $league->country?->name,
                    'created_at' => $league->created_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('admin/leagues/index', [
            'leagues' => $leagues,
        ]);
    }

    public function create(): Response
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/leagues/create', [
            'countries' => $countries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'founded_year' => 'nullable|date',
            'description' => 'nullable|string',
            'resource_url' => 'nullable|url|max:500',
        ]);

        // Handle file upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('leagues/logos', 'public');
        }

        League::create($validated);

        return redirect()->route('admin.leagues.index')->with('success', 'League created successfully.');
    }

    public function show(League $league): Response
    {
        $league->load('country');

        return Inertia::render('admin/leagues/show', [
            'league' => [
                'id' => $league->id,
                'name' => $league->name,
                'logo' => $league->logo ? Storage::url($league->logo) : null,
                'founded_year' => $league->founded_year?->format('Y'),
                'description' => $league->description,
                'resource_url' => $league->resource_url,
                'country' => $league->country?->name,
                'created_at' => $league->created_at?->format('M d, Y H:i'),
                'updated_at' => $league->updated_at?->format('M d, Y H:i'),
            ],
        ]);
    }

    public function edit(League $league): Response
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/leagues/edit', [
            'league' => [
                'id' => $league->id,
                'name' => $league->name,
                'country_id' => $league->country_id,
                'logo' => $league->logo ? Storage::url($league->logo) : null,
                'logo_path' => $league->logo, // Keep original path for deletion
                'founded_year' => $league->founded_year?->format('Y-m-d'),
                'description' => $league->description,
                'resource_url' => $league->resource_url,
            ],
            'countries' => $countries,
        ]);
    }

    public function update(Request $request, League $league): RedirectResponse
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'founded_year' => 'nullable|date',
            'description' => 'nullable|string',
            'resource_url' => 'nullable|url|max:500',
        ]);

        // Handle file upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($league->logo) {
                Storage::disk('public')->delete($league->logo);
            }
            $validated['logo'] = $request->file('logo')->store('leagues/logos', 'public');
        }

        $league->update($validated);

        return redirect()->route('admin.leagues.index')->with('success', 'League updated successfully.');
    }

    public function destroy(League $league): RedirectResponse
    {
        // Delete logo file if exists
        if ($league->logo) {
            Storage::disk('public')->delete($league->logo);
        }

        $league->delete();

        return redirect()->route('admin.leagues.index')->with('success', 'League deleted successfully.');
    }
}
