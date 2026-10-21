<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Party;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Parties/Index', [
            'parties' => Party::query()->orderBy('name')->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Parties/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        Party::create($validated);

        return redirect()->route('admin.parties.index')->with('success', 'Party created.');
    }

    public function edit(Party $party): Response
    {
        return Inertia::render('Admin/Parties/Edit', ['party' => $party]);
    }

    public function update(Request $request, Party $party): RedirectResponse
    {
        $validated = $this->validated($request);

        $party->update($validated);

        return redirect()->route('admin.parties.index')->with('success', 'Party updated.');
    }

    public function destroy(Party $party): RedirectResponse
    {
        $party->delete();

        return redirect()->route('admin.parties.index')->with('success', 'Party deleted.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'mobile' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
        ]);
    }
}
