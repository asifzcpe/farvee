<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Edit', [
            'settings' => Setting::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'head_office_address' => ['nullable', 'string'],
            'factory_address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:255'],
            'cell_numbers' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'next_order_seq' => ['required', 'integer', 'min:1'],
            'next_challan_seq' => ['required', 'integer', 'min:1'],
            'next_bill_seq' => ['required', 'integer', 'min:1'],
            'next_work_order_seq' => ['required', 'integer', 'min:1'],
            'fiscal_year_start_month' => ['required', 'integer', 'min:1', 'max:12'],
            'default_usd_bdt_rate' => ['nullable', 'numeric', 'min:0'],
        ]);

        $settings = Setting::current();

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        unset($validated['logo']);

        $settings->update($validated);

        return redirect()->route('admin.settings.edit')->with('success', 'Settings updated.');
    }
}
