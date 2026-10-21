<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DeliveryChallanLine extends Model
{
    protected $fillable = [
        'delivery_challan_id', 'order_item_id',
        'order_quantity', 'delivery_quantity', 'balance_quantity', 'billed',
    ];

    protected function casts(): array
    {
        return [
            'order_quantity' => 'integer',
            'delivery_quantity' => 'integer',
            'balance_quantity' => 'integer',
            'billed' => 'boolean',
        ];
    }

    public function deliveryChallan(): BelongsTo
    {
        return $this->belongsTo(DeliveryChallan::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function billLine(): HasOne
    {
        return $this->hasOne(BillLine::class);
    }
}
