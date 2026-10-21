<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Units/Index', [
            'units' => Unit::query()->orderBy('name')->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Units/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Unit::create($validated);

        return redirect()->route('admin.units.index')->with('success', 'Unit created.');
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('Admin/Units/Edit', ['unit' => $unit]);
    }

    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $unit->update($validated);

        return redirect()->route('admin.units.index')->with('success', 'Unit updated.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()->route('admin.units.index')->with('success', 'Unit deleted.');
    }
}
