<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'company_name',
        'head_office_address',
        'factory_address',
        'phone',
        'cell_numbers',
        'email',
        'website',
        'logo_path',
        'next_order_seq',
        'next_challan_seq',
        'next_bill_seq',
        'next_work_order_seq',
        'fiscal_year_start_month',
        'default_usd_bdt_rate',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }

    public function fiscalYearLabel(?\DateTimeInterface $date = null): string
    {
        $date = $date ?? now();
        $startMonth = $this->fiscal_year_start_month;

        $startYear = $date->month >= $startMonth ? $date->year : $date->year - 1;
        $endYear = $startYear + 1;

        return substr((string) $startYear, -2).'-'.substr((string) $endYear, -2);
    }
}
