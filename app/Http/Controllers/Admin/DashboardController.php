<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\DeliveryChallan;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $months = collect(range(5, 0))->map(function ($i) {
            $date = now()->subMonths($i);

            return [
                'label' => $date->format('M'),
                'start' => $date->copy()->startOfMonth(),
                'end' => $date->copy()->endOfMonth(),
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalOrders' => Order::count(),
                'totalChallans' => DeliveryChallan::count(),
                'totalBills' => Bill::count(),
                'billedThisMonth' => Bill::whereMonth('date', now()->month)->whereYear('date', now()->year)->sum('total_amount'),
            ],
            'recentOrders' => Order::with(['buyer', 'party'])->latest('date')->take(5)->get(),
            'monthlyOrders' => $months->map(fn ($m) => [
                'label' => $m['label'],
                'value' => Order::whereBetween('date', [$m['start'], $m['end']])->count(),
            ])->values(),
            'monthlyBilled' => $months->map(fn ($m) => [
                'label' => $m['label'],
                'value' => (float) Bill::whereBetween('date', [$m['start'], $m['end']])->sum('total_amount'),
            ])->values(),
            'statusBreakdown' => [
                ['key' => 'draft', 'label' => 'Draft', 'value' => Order::where('status', 'draft')->count()],
                ['key' => 'in_production', 'label' => 'In Production', 'value' => Order::where('status', 'in_production')->count()],
                ['key' => 'completed', 'label' => 'Completed', 'value' => Order::where('status', 'completed')->count()],
            ],
        ]);
    }
}
