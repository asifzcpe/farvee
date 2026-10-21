<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    protected $fillable = [
        'bill_ref_no', 'date', 'order_id', 'party_id', 'buyer_id',
        'pi_no', 'or_no', 'usd_bdt_rate', 'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'usd_bdt_rate' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(BillLine::class);
    }
}
