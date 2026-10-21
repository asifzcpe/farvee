<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Setting;
use App\Models\WorkOrder;
use App\Services\DocumentNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $workOrders = WorkOrder::query()
            ->with('order')
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->whereLike('work_order_no', "%{$search}%");
            })
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/WorkOrders/Index', [
            'workOrders' => $workOrders,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request, DocumentNumberService $numbers): Response
    {
        return Inertia::render('Admin/WorkOrders/Create', [
            'orders' => Order::query()->orderBy('order_no')->get(['id', 'order_no']),
            'selectedOrderId' => $request->integer('order') ?: null,
            'suggestedWorkOrderNo' => $numbers->nextWorkOrderNo(),
        ]);
    }

    public function store(Request $request, DocumentNumberService $numbers): RedirectResponse
    {
        \Log::info('WO_STORE_DEBUG', ['all' => $request->except('image'), 'hasFile' => $request->hasFile('image')]);
        $validated = $this->validated($request);

        DB::transaction(function () use ($request, $validated, $numbers) {
            $workOrder = WorkOrder::create([
                'work_order_no' => $validated['work_order_no'],
                'date' => $validated['date'],
                'order_id' => $validated['order_id'],
                'prepared_by' => $validated['prepared_by'] ?? null,
                'packing_instructions' => $validated['packing_instructions'] ?? null,
                'material_note' => $validated['material_note'] ?? null,
                'process_note' => $validated['process_note'] ?? null,
                'folding_note' => $validated['folding_note'] ?? null,
                'image_path' => $request->hasFile('image')
                    ? $request->file('image')->store('work-orders', 'public')
                    : null,
            ]);

            foreach ($validated['specifications'] as $index => $spec) {
                if (trim($spec['description'] ?? '') === '') {
                    continue;
                }
                $workOrder->specifications()->create([
                    'line_no' => $index + 1,
                    'description' => $spec['description'],
                ]);
            }

            $workOrder->lines()->createMany($validated['lines']);

            $numbers->consumeWorkOrderSeq();
        });

        return redirect()->route('admin.work-orders.index')->with('success', 'Work order created.');
    }

    public function edit(WorkOrder $workOrder): Response
    {
        $workOrder->load(['specifications', 'lines.orderItem', 'order.items']);

        return Inertia::render('Admin/WorkOrders/Edit', [
            'workOrder' => $workOrder,
        ]);
    }

    public function update(Request $request, WorkOrder $workOrder): RedirectResponse
    {
        $validated = $this->validated($request, $workOrder);

        DB::transaction(function () use ($request, $workOrder, $validated) {
            $imagePath = $workOrder->image_path;

            if ($request->hasFile('image')) {
                if ($imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
                $imagePath = $request->file('image')->store('work-orders', 'public');
            }

            $workOrder->update([
                'work_order_no' => $validated['work_order_no'],
                'date' => $validated['date'],
                'prepared_by' => $validated['prepared_by'] ?? null,
                'packing_instructions' => $validated['packing_instructions'] ?? null,
                'material_note' => $validated['material_note'] ?? null,
                'process_note' => $validated['process_note'] ?? null,
                'folding_note' => $validated['folding_note'] ?? null,
                'image_path' => $imagePath,
            ]);

            $workOrder->specifications()->delete();
            foreach ($validated['specifications'] as $index => $spec) {
                if (trim($spec['description'] ?? '') === '') {
                    continue;
                }
                $workOrder->specifications()->create([
                    'line_no' => $index + 1,
                    'description' => $spec['description'],
                ]);
            }

            $workOrder->lines()->delete();
            $workOrder->lines()->createMany($validated['lines']);
        });

        return redirect()->route('admin.work-orders.index')->with('success', 'Work order updated.');
    }

    public function destroy(WorkOrder $workOrder): RedirectResponse
    {
        if ($workOrder->image_path) {
            Storage::disk('public')->delete($workOrder->image_path);
        }

        $workOrder->delete();

        return redirect()->route('admin.work-orders.index')->with('success', 'Work order deleted.');
    }

    public function print(WorkOrder $workOrder)
    {
        $workOrder->load(['specifications', 'lines.orderItem', 'order.buyer', 'order.party']);

        return view('print.work_order', [
            'workOrder' => $workOrder,
            'settings' => Setting::current(),
        ]);
    }

    private function validated(Request $request, ?WorkOrder $workOrder = null): array
    {
        return $request->validate([
            'work_order_no' => ['required', 'string', 'max:255', Rule::unique('work_orders', 'work_order_no')->ignore($workOrder?->id)],
            'date' => ['required', 'date'],
            'order_id' => [$workOrder ? 'sometimes' : 'required', 'exists:orders,id'],
            'prepared_by' => ['nullable', 'string', 'max:255'],
            'packing_instructions' => ['nullable', 'string'],
            'material_note' => ['nullable', 'string'],
            'process_note' => ['nullable', 'string'],
            'folding_note' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'specifications' => ['array'],
            'specifications.*.description' => ['nullable', 'string', 'max:255'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.order_item_id' => ['required', 'exists:order_items,id'],
            'lines.*.quantity' => ['required', 'integer', 'min:1'],
        ]);
    }
}
