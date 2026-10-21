<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Buyer;
use App\Models\Order;
use App\Models\Party;
use App\Models\Unit;
use App\Services\DocumentNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->with(['buyer', 'party'])
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->whereLike('order_no', "%{$search}%");
            })
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(DocumentNumberService $numbers): Response
    {
        return Inertia::render('Admin/Orders/Create', [
            'buyers' => Buyer::query()->orderBy('name')->get(['id', 'name']),
            'parties' => Party::query()->orderBy('name')->get(['id', 'name']),
            'units' => Unit::query()->orderBy('name')->get(['id', 'name']),
            'suggestedOrderNo' => $numbers->nextOrderNo(),
        ]);
    }

    public function store(Request $request, DocumentNumberService $numbers): RedirectResponse
    {
        $validated = $this->validated($request);

        $order = DB::transaction(function () use ($validated, $numbers) {
            $order = Order::create([
                'order_no' => $validated['order_no'],
                'date' => $validated['date'],
                'buyer_id' => $validated['buyer_id'],
                'party_id' => $validated['party_id'],
                'unit_id' => $validated['unit_id'],
                'style' => $validated['style'] ?? null,
                'pi_no' => $validated['pi_no'] ?? null,
                'buyer_ref' => $validated['buyer_ref'] ?? null,
            ]);

            $order->items()->createMany($validated['items']);

            $numbers->consumeOrderSeq();

            return $order;
        });

        return redirect()->route('admin.orders.edit', $order)->with('success', 'Order created.');
    }

    public function edit(Order $order): Response
    {
        $order->load(['items', 'workOrders', 'deliveryChallans', 'bills']);

        $order->items->each(function ($item) {
            $item->delivered_quantity = $item->deliveredQuantity();
        });

        return Inertia::render('Admin/Orders/Edit', [
            'order' => $order,
            'buyers' => Buyer::query()->orderBy('name')->get(['id', 'name']),
            'parties' => Party::query()->orderBy('name')->get(['id', 'name']),
            'units' => Unit::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $this->validated($request, $order);

        $submittedIds = collect($validated['items'])->pluck('id')->filter()->all();
        $removedItems = $order->items()->whereNotIn('id', $submittedIds)->get();

        foreach ($removedItems as $removedItem) {
            if ($removedItem->deliveredQuantity() > 0) {
                return back()->withErrors([
                    'items' => "PO {$removedItem->po_no} already has deliveries and cannot be removed.",
                ])->withInput();
            }
        }

        foreach ($validated['items'] as $item) {
            if (empty($item['id'])) {
                continue;
            }

            $orderItem = $order->items()->findOrFail($item['id']);

            if ($item['quantity'] < $orderItem->deliveredQuantity()) {
                return back()->withErrors([
                    'items' => "PO {$orderItem->po_no} already has {$orderItem->deliveredQuantity()} delivered; quantity cannot be reduced below that.",
                ])->withInput();
            }
        }

        DB::transaction(function () use ($order, $validated, $removedItems) {
            $order->update([
                'order_no' => $validated['order_no'],
                'date' => $validated['date'],
                'buyer_id' => $validated['buyer_id'],
                'party_id' => $validated['party_id'],
                'unit_id' => $validated['unit_id'],
                'style' => $validated['style'] ?? null,
                'pi_no' => $validated['pi_no'] ?? null,
                'buyer_ref' => $validated['buyer_ref'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                if (! empty($item['id'])) {
                    $order->items()->whereKey($item['id'])->update([
                        'po_no' => $item['po_no'],
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'rate' => $item['rate'],
                    ]);
                } else {
                    $order->items()->create($item);
                }
            }

            $order->items()->whereIn('id', $removedItems->pluck('id'))->delete();
        });

        return redirect()->route('admin.orders.edit', $order)->with('success', 'Order updated.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        if ($order->workOrders()->exists() || $order->deliveryChallans()->exists() || $order->bills()->exists()) {
            return back()->with('error', 'This order has work orders, challans, or bills and cannot be deleted.');
        }

        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Order deleted.');
    }

    private function validated(Request $request, ?Order $order = null): array
    {
        return $request->validate([
            'order_no' => ['required', 'string', 'max:255', Rule::unique('orders', 'order_no')->ignore($order?->id)],
            'date' => ['required', 'date'],
            'buyer_id' => ['required', 'exists:buyers,id'],
            'party_id' => ['required', 'exists:parties,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'style' => ['nullable', 'string', 'max:255'],
            'pi_no' => ['nullable', 'string', 'max:255'],
            'buyer_ref' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'integer'],
            'items.*.po_no' => ['required', 'string', 'max:255'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.rate' => ['required', 'numeric', 'min:0'],
        ]);
    }
}
