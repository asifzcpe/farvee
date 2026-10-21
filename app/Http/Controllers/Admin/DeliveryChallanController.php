<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Buyer;
use App\Models\DeliveryChallan;
use App\Models\Order;
use App\Models\Party;
use App\Models\Setting;
use App\Services\DocumentNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryChallanController extends Controller
{
    public function index(Request $request): Response
    {
        $challans = DeliveryChallan::query()
            ->with(['order', 'party'])
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where('challan_no', 'like', "%{$search}%");
            })
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/DeliveryChallans/Index', [
            'challans' => $challans,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request, DocumentNumberService $numbers): Response
    {
        return Inertia::render('Admin/DeliveryChallans/Create', [
            'orders' => Order::query()->orderBy('order_no')->get(['id', 'order_no']),
            'selectedOrderId' => $request->integer('order') ?: null,
            'suggestedChallanNo' => $numbers->nextChallanNo(),
        ]);
    }

    public function remainingItems(Order $order): \Illuminate\Http\JsonResponse
    {
        $order->load(['buyer', 'party', 'items']);

        return response()->json([
            'order' => $order->only(['id', 'order_no', 'buyer_id', 'party_id', 'style']),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'po_no' => $item->po_no,
                'description' => $item->description,
                'order_quantity' => $item->quantity,
                'balance_quantity' => $item->balanceQuantity(),
            ])->values(),
        ]);
    }

    public function store(Request $request, DocumentNumberService $numbers): RedirectResponse
    {
        $validated = $this->validated($request);

        $order = Order::with('items')->findOrFail($validated['order_id']);

        $lines = $this->buildLines($order, $validated['lines']);

        if ($lines === null) {
            return back()->withErrors(['lines' => 'Delivery quantity exceeds the remaining balance for one or more items.'])->withInput();
        }

        if (empty($lines)) {
            return back()->withErrors(['lines' => 'Enter a delivery quantity for at least one item.'])->withInput();
        }

        DB::transaction(function () use ($validated, $lines, $numbers) {
            $challan = DeliveryChallan::create([
                'challan_no' => $validated['challan_no'],
                'date' => $validated['date'],
                'order_id' => $validated['order_id'],
                'party_id' => $validated['party_id'],
                'buyer_id' => $validated['buyer_id'],
                'style' => $validated['style'] ?? null,
                'job_po_ord' => $validated['job_po_ord'] ?? null,
                'gross_weight' => $validated['gross_weight'] ?? null,
                'net_weight' => $validated['net_weight'] ?? null,
                'material_note' => $validated['material_note'] ?? null,
                'delivered_by' => $validated['delivered_by'] ?? null,
                'approved_by' => $validated['approved_by'] ?? null,
            ]);

            $challan->lines()->createMany($lines);

            $numbers->consumeChallanSeq();
        });

        return redirect()->route('admin.delivery-challans.index')->with('success', 'Delivery challan created.');
    }

    public function edit(DeliveryChallan $deliveryChallan): Response
    {
        $deliveryChallan->load(['lines.orderItem', 'order.items']);

        return Inertia::render('Admin/DeliveryChallans/Edit', [
            'challan' => $deliveryChallan,
            'orderItems' => $deliveryChallan->order->items->map(fn ($item) => [
                'id' => $item->id,
                'po_no' => $item->po_no,
                'description' => $item->description,
                'order_quantity' => $item->quantity,
                'balance_quantity' => $item->balanceQuantity() + ($deliveryChallan->lines->firstWhere('order_item_id', $item->id)?->delivery_quantity ?? 0),
                'delivery_quantity' => $deliveryChallan->lines->firstWhere('order_item_id', $item->id)?->delivery_quantity ?? 0,
                'billed' => (bool) $deliveryChallan->lines->firstWhere('order_item_id', $item->id)?->billed,
            ])->values(),
            'parties' => Party::query()->orderBy('name')->get(['id', 'name']),
            'buyers' => Buyer::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, DeliveryChallan $deliveryChallan): RedirectResponse
    {
        if ($deliveryChallan->lines()->where('billed', true)->exists()) {
            return back()->with('error', 'This challan has billed lines and can no longer be edited.');
        }

        $validated = $this->validated($request, $deliveryChallan);

        $order = $deliveryChallan->order()->with('items')->first();

        $lines = $this->buildLines($order, $validated['lines'], excludeChallanId: $deliveryChallan->id);

        if ($lines === null) {
            return back()->withErrors(['lines' => 'Delivery quantity exceeds the remaining balance for one or more items.'])->withInput();
        }

        if (empty($lines)) {
            return back()->withErrors(['lines' => 'Enter a delivery quantity for at least one item.'])->withInput();
        }

        DB::transaction(function () use ($deliveryChallan, $validated, $lines) {
            $deliveryChallan->update([
                'challan_no' => $validated['challan_no'],
                'date' => $validated['date'],
                'party_id' => $validated['party_id'],
                'buyer_id' => $validated['buyer_id'],
                'style' => $validated['style'] ?? null,
                'job_po_ord' => $validated['job_po_ord'] ?? null,
                'gross_weight' => $validated['gross_weight'] ?? null,
                'net_weight' => $validated['net_weight'] ?? null,
                'material_note' => $validated['material_note'] ?? null,
                'delivered_by' => $validated['delivered_by'] ?? null,
                'approved_by' => $validated['approved_by'] ?? null,
            ]);

            $deliveryChallan->lines()->delete();
            $deliveryChallan->lines()->createMany($lines);
        });

        return redirect()->route('admin.delivery-challans.index')->with('success', 'Delivery challan updated.');
    }

    public function destroy(DeliveryChallan $deliveryChallan): RedirectResponse
    {
        if ($deliveryChallan->lines()->where('billed', true)->exists()) {
            return back()->with('error', 'This challan has billed lines and cannot be deleted.');
        }

        $deliveryChallan->delete();

        return redirect()->route('admin.delivery-challans.index')->with('success', 'Delivery challan deleted.');
    }

    public function print(DeliveryChallan $deliveryChallan)
    {
        $deliveryChallan->load(['lines.orderItem', 'order', 'party', 'buyer']);

        return view('print.delivery_challan', [
            'challan' => $deliveryChallan,
            'settings' => Setting::current(),
        ]);
    }

    /**
     * Build snapshot delivery-challan-line payloads, validating each against remaining balance.
     * Returns null if any line exceeds balance, [] if no lines have quantity > 0.
     */
    private function buildLines(Order $order, array $submittedLines, ?int $excludeChallanId = null): ?array
    {
        $lines = [];

        foreach ($submittedLines as $line) {
            $deliveryQuantity = (int) ($line['delivery_quantity'] ?? 0);

            if ($deliveryQuantity <= 0) {
                continue;
            }

            $orderItem = $order->items->firstWhere('id', $line['order_item_id']);

            if (! $orderItem) {
                return null;
            }

            $deliveredElsewhere = $orderItem->deliveryChallanLines()
                ->when($excludeChallanId, fn ($query) => $query->where('delivery_challan_id', '!=', $excludeChallanId))
                ->sum('delivery_quantity');

            $balanceBefore = $orderItem->quantity - $deliveredElsewhere;

            if ($deliveryQuantity > $balanceBefore) {
                return null;
            }

            $lines[] = [
                'order_item_id' => $orderItem->id,
                'order_quantity' => $orderItem->quantity,
                'delivery_quantity' => $deliveryQuantity,
                'balance_quantity' => $balanceBefore - $deliveryQuantity,
            ];
        }

        return $lines;
    }

    private function validated(Request $request, ?DeliveryChallan $challan = null): array
    {
        return $request->validate([
            'challan_no' => ['required', 'string', 'max:255', Rule::unique('delivery_challans', 'challan_no')->ignore($challan?->id)],
            'date' => ['required', 'date'],
            'order_id' => [$challan ? 'sometimes' : 'required', 'exists:orders,id'],
            'party_id' => ['required', 'exists:parties,id'],
            'buyer_id' => ['required', 'exists:buyers,id'],
            'style' => ['nullable', 'string', 'max:255'],
            'job_po_ord' => ['nullable', 'string', 'max:255'],
            'gross_weight' => ['nullable', 'numeric', 'min:0'],
            'net_weight' => ['nullable', 'numeric', 'min:0'],
            'material_note' => ['nullable', 'string'],
            'delivered_by' => ['nullable', 'string', 'max:255'],
            'approved_by' => ['nullable', 'string', 'max:255'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.order_item_id' => ['required', 'exists:order_items,id'],
            'lines.*.delivery_quantity' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
