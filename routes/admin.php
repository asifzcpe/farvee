<?php

use App\Http\Controllers\Admin\BillController;
use App\Http\Controllers\Admin\BuyerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DeliveryChallanController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PartyController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WorkOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class)->except('show');
        Route::resource('buyers', BuyerController::class)->except('show');
        Route::resource('parties', PartyController::class)->except('show');
        Route::resource('units', UnitController::class)->except('show');
        Route::get('settings', [SettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

        Route::resource('orders', OrderController::class)->except('show');

        Route::resource('work-orders', WorkOrderController::class)->except('show');
        Route::get('work-orders/{work_order}/print', [WorkOrderController::class, 'print'])->name('work-orders.print');

        Route::resource('delivery-challans', DeliveryChallanController::class)->except('show');
        Route::get('delivery-challans/{delivery_challan}/print', [DeliveryChallanController::class, 'print'])->name('delivery-challans.print');
        Route::get('orders/{order}/remaining-items', [DeliveryChallanController::class, 'remainingItems'])->name('orders.remaining-items');

        Route::resource('bills', BillController::class)->except('show');
        Route::get('bills/{bill}/print', [BillController::class, 'print'])->name('bills.print');
        Route::get('orders/{order}/unbilled-lines', [BillController::class, 'unbilledLines'])->name('orders.unbilled-lines');
    });
});
