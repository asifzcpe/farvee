<?php

namespace App\Services;

use App\Models\Setting;

class DocumentNumberService
{
    public function nextOrderNo(): string
    {
        $settings = Setting::current();
        $number = $settings->next_order_seq;

        return "{$number}/{$settings->fiscalYearLabel()}";
    }

    public function nextChallanNo(): string
    {
        $settings = Setting::current();
        $number = $settings->next_challan_seq;

        return "LS-{$number}/".now()->year;
    }

    public function nextBillRefNo(): string
    {
        $settings = Setting::current();
        $number = $settings->next_bill_seq;

        return "BILL/ATLBD/{$number}/{$settings->fiscalYearLabel()}";
    }

    public function nextWorkOrderNo(): string
    {
        $settings = Setting::current();

        return (string) $settings->next_work_order_seq;
    }

    public function consumeOrderSeq(): void
    {
        Setting::current()->increment('next_order_seq');
    }

    public function consumeChallanSeq(): void
    {
        Setting::current()->increment('next_challan_seq');
    }

    public function consumeBillSeq(): void
    {
        Setting::current()->increment('next_bill_seq');
    }

    public function consumeWorkOrderSeq(): void
    {
        Setting::current()->increment('next_work_order_seq');
    }
}
