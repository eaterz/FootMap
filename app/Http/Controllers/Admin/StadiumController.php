<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Stadium;
use App\Models\Country;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StadiumController extends Controller
{

    public function index(): Response
    {
        $stadiums = Stadium::with('country')
            ->latest()
            ->paginate(10)
            ->through(function ($stadium) {
                return [
                    'id' => $stadium->id,
                    'name' => $stadium->name,
                    'country' => $stadium->country?->name,
                    'city' => $stadium->city,
                    'latitude' => $stadium->latitude,
                    'longitude' => $stadium->longitude,
                    'image' => $stadium->image,
                    'capacity' => $stadium->capacity,
                    'created_at' => $stadium->created_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('admin/stadiums/index', [
            'stadiums' => $stadiums,
        ]);
    }

    public function create(): Response
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/stadiums/create', [
            'countries' => $countries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'city' => 'required|string|max:100',
            'name' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'capacity' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('stadiums', 'public');
        }

        Stadium::create($validated);

        return redirect()->route('admin.stadiums.index')->with('success', 'Stadium created successfully.');
    }

    public function show(Stadium $stadium): Response
    {
        $stadium->load('country');

        return Inertia::render('admin/stadiums/show', [
            'stadium' => [
                'id' => $stadium->id,
                'name' => $stadium->name,
                'country' => $stadium->country?->name,
                'city' => $stadium->city,
                'latitude' => $stadium->latitude,
                'longitude' => $stadium->longitude,
                'capacity' => $stadium->capacity,
                'image' => $stadium->image,
                'created_at' => $stadium->created_at?->format('M d, Y H:i'),
                'updated_at' => $stadium->updated_at?->format('M d, Y H:i'),
            ],
        ]);
    }

    public function edit(Stadium $stadium): Response
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/stadiums/edit', [
            'stadium' => $stadium,
            'countries' => $countries,
        ]);
    }

    public function update(Request $request, Stadium $stadium): RedirectResponse
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'city' => 'required|string|max:100',
            'name' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'capacity' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($stadium->image) {
                \Storage::disk('public')->delete($stadium->image);
            }
            $validated['image'] = $request->file('image')->store('stadiums', 'public');
        }

        $stadium->update($validated);

        return redirect()->route('admin.stadiums.index')->with('success', 'Stadium updated successfully.');
    }

    public function destroy(Stadium $stadium): RedirectResponse
    {
        $stadium->delete();

        return redirect()->route('admin.stadiums.index')->with('success', 'Stadium deleted successfully.');
    }
}
