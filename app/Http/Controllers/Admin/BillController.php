<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Buyer;
use App\Models\DeliveryChallanLine;
use App\Models\Order;
use App\Models\Party;
use App\Models\Setting;
use App\Services\DocumentNumberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function index(Request $request): Response
    {
        $bills = Bill::query()
            ->with(['order', 'party'])
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where('bill_ref_no', 'like', "%{$search}%");
            })
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Bills/Index', [
            'bills' => $bills,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request, DocumentNumberService $numbers): Response
    {
        return Inertia::render('Admin/Bills/Create', [
            'orders' => Order::query()->orderBy('order_no')->get(['id', 'order_no']),
            'selectedOrderId' => $request->integer('order') ?: null,
            'suggestedBillRefNo' => $numbers->nextBillRefNo(),
            'defaultUsdBdtRate' => Setting::current()->default_usd_bdt_rate,
        ]);
    }

    public function unbilledLines(Order $order): JsonResponse
    {
        $order->load(['buyer', 'party']);

        $lines = $order->deliveryChallans()
            ->with(['lines' => fn ($query) => $query->where('billed', false)->with('orderItem')])
            ->get()
            ->flatMap->lines
            ->values();

        return response()->json([
            'order' => $order->only(['id', 'order_no', 'buyer_id', 'party_id']),
            'lines' => $lines->map(fn ($line) => [
                'id' => $line->id,
                'challan_no' => $line->deliveryChallan->challan_no,
                'challan_date' => $line->deliveryChallan->date->format('Y-m-d'),
                'po_no' => $line->orderItem->po_no,
                'description' => $line->orderItem->description,
                'quantity' => $line->delivery_quantity,
                'unit_price' => (float) $line->orderItem->rate,
            ]),
        ]);
    }

    public function store(Request $request, DocumentNumberService $numbers): RedirectResponse
    {
        $validated = $this->validated($request);

        $result = $this->applyLines(null, $validated);

        if ($result === null) {
            return back()->withErrors(['lines' => 'One or more selected lines are already billed.'])->withInput();
        }

        [$lines, $total] = $result;

        if (empty($lines)) {
            return back()->withErrors(['lines' => 'Select at least one delivery line to bill.'])->withInput();
        }

        DB::transaction(function () use ($validated, $lines, $total, $numbers) {
            $bill = Bill::create([
                'bill_ref_no' => $validated['bill_ref_no'],
                'date' => $validated['date'],
                'order_id' => $validated['order_id'],
                'party_id' => $validated['party_id'],
                'buyer_id' => $validated['buyer_id'],
                'pi_no' => $validated['pi_no'] ?? null,
                'or_no' => $validated['or_no'] ?? null,
                'usd_bdt_rate' => $validated['usd_bdt_rate'] ?? null,
                'total_amount' => $total,
            ]);

            $bill->lines()->createMany($lines);

            DeliveryChallanLine::whereIn('id', collect($lines)->pluck('delivery_challan_line_id'))
                ->update(['billed' => true]);

            $numbers->consumeBillSeq();
        });

        return redirect()->route('admin.bills.index')->with('success', 'Bill created.');
    }

    public function edit(Bill $bill): Response
    {
        $bill->load(['order', 'lines.deliveryChallanLine.orderItem', 'lines.deliveryChallanLine.deliveryChallan']);

        $order = $bill->order()->with(['deliveryChallans.lines' => function ($query) use ($bill) {
            $query->where('billed', false)->orWhereHas('billLine', fn ($q) => $q->where('bill_id', $bill->id));
        }, 'deliveryChallans.lines.orderItem', 'deliveryChallans.lines.deliveryChallan'])->first();

        $availableLines = $order->deliveryChallans->flatMap->lines->values();

        return Inertia::render('Admin/Bills/Edit', [
            'bill' => $bill,
            'parties' => Party::query()->orderBy('name')->get(['id', 'name']),
            'buyers' => Buyer::query()->orderBy('name')->get(['id', 'name']),
            'availableLines' => $availableLines->map(fn ($line) => [
                'id' => $line->id,
                'challan_no' => $line->deliveryChallan->challan_no,
                'challan_date' => $line->deliveryChallan->date->format('Y-m-d'),
                'po_no' => $line->orderItem->po_no,
                'description' => $line->orderItem->description,
                'quantity' => $line->delivery_quantity,
                'default_unit_price' => (float) $line->orderItem->rate,
            ]),
            'selectedLineIds' => $bill->lines->pluck('delivery_challan_line_id'),
            'currentUnitPrices' => $bill->lines->pluck('unit_price', 'delivery_challan_line_id'),
        ]);
    }

    public function update(Request $request, Bill $bill): RedirectResponse
    {
        $validated = $this->validated($request, $bill);

        $result = $this->applyLines($bill, $validated);

        if ($result === null) {
            return back()->withErrors(['lines' => 'One or more selected lines are already billed on another bill.'])->withInput();
        }

        [$lines, $total] = $result;

        if (empty($lines)) {
            return back()->withErrors(['lines' => 'Select at least one delivery line to bill.'])->withInput();
        }

        DB::transaction(function () use ($bill, $validated, $lines, $total) {
            $previousLineIds = $bill->lines()->pluck('delivery_challan_line_id');

            $bill->update([
                'bill_ref_no' => $validated['bill_ref_no'],
                'date' => $validated['date'],
                'party_id' => $validated['party_id'],
                'buyer_id' => $validated['buyer_id'],
                'pi_no' => $validated['pi_no'] ?? null,
                'or_no' => $validated['or_no'] ?? null,
                'usd_bdt_rate' => $validated['usd_bdt_rate'] ?? null,
                'total_amount' => $total,
            ]);

            DeliveryChallanLine::whereIn('id', $previousLineIds)->update(['billed' => false]);

            $bill->lines()->delete();
            $bill->lines()->createMany($lines);

            DeliveryChallanLine::whereIn('id', collect($lines)->pluck('delivery_challan_line_id'))
                ->update(['billed' => true]);
        });

        return redirect()->route('admin.bills.index')->with('success', 'Bill updated.');
    }

    public function destroy(Bill $bill): RedirectResponse
    {
        DB::transaction(function () use ($bill) {
            DeliveryChallanLine::whereIn('id', $bill->lines()->pluck('delivery_challan_line_id'))
                ->update(['billed' => false]);

            $bill->delete();
        });

        return redirect()->route('admin.bills.index')->with('success', 'Bill deleted.');
    }

    public function print(Bill $bill)
    {
        $bill->load(['lines.deliveryChallanLine.orderItem', 'lines.deliveryChallanLine.deliveryChallan', 'order', 'party', 'buyer']);

        return view('print.bill', [
            'bill' => $bill,
            'settings' => Setting::current(),
        ]);
    }

    /**
     * Validate submitted lines against billed state and build BillLine payloads + total.
     * Returns null if any line is already billed elsewhere, [lines, total] otherwise.
     */
    private function applyLines(?Bill $bill, array $validated): ?array
    {
        $lines = [];
        $total = 0;

        foreach ($validated['lines'] as $submitted) {
            $challanLine = DeliveryChallanLine::find($submitted['delivery_challan_line_id']);

            if (! $challanLine) {
                return null;
            }

            $billedElsewhere = $challanLine->billed
                && ! ($bill && $challanLine->billLine && $challanLine->billLine->bill_id === $bill->id);

            if ($billedElsewhere) {
                return null;
            }

            $unitPrice = (float) $submitted['unit_price'];
            $amount = round($challanLine->delivery_quantity * $unitPrice, 2);
            $total += $amount;

            $lines[] = [
                'delivery_challan_line_id' => $challanLine->id,
                'quantity' => $challanLine->delivery_quantity,
                'unit_price' => $unitPrice,
                'amount' => $amount,
            ];
        }

        return [$lines, $total];
    }

    private function validated(Request $request, ?Bill $bill = null): array
    {
        return $request->validate([
            'bill_ref_no' => ['required', 'string', 'max:255', Rule::unique('bills', 'bill_ref_no')->ignore($bill?->id)],
            'date' => ['required', 'date'],
            'order_id' => [$bill ? 'sometimes' : 'required', 'exists:orders,id'],
            'party_id' => ['required', 'exists:parties,id'],
            'buyer_id' => ['required', 'exists:buyers,id'],
            'pi_no' => ['nullable', 'string', 'max:255'],
            'or_no' => ['nullable', 'string', 'max:255'],
            'usd_bdt_rate' => ['nullable', 'numeric', 'min:0'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.delivery_challan_line_id' => ['required', 'exists:delivery_challan_lines,id'],
            'lines.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);
    }
}
