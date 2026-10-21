<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Buyer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuyerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Buyers/Index', [
            'buyers' => Buyer::query()->orderBy('name')->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Buyers/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:255'],
        ]);

        Buyer::create($validated);

        return redirect()->route('admin.buyers.index')->with('success', 'Buyer created.');
    }

    public function edit(Buyer $buyer): Response
    {
        return Inertia::render('Admin/Buyers/Edit', ['buyer' => $buyer]);
    }

    public function update(Request $request, Buyer $buyer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:255'],
        ]);

        $buyer->update($validated);

        return redirect()->route('admin.buyers.index')->with('success', 'Buyer updated.');
    }

    public function destroy(Buyer $buyer): RedirectResponse
    {
        $buyer->delete();

        return redirect()->route('admin.buyers.index')->with('success', 'Buyer deleted.');
    }
}
