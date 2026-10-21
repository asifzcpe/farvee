<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillLine extends Model
{
    protected $fillable = ['bill_id', 'delivery_challan_line_id', 'quantity', 'unit_price', 'amount'];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:3',
            'amount' => 'decimal:2',
        ];
    }

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }

    public function deliveryChallanLine(): BelongsTo
    {
        return $this->belongsTo(DeliveryChallanLine::class);
    }
}
