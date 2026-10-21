<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'po_no', 'description', 'quantity', 'rate'];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'rate' => 'decimal:3',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryChallanLines(): HasMany
    {
        return $this->hasMany(DeliveryChallanLine::class);
    }

    public function deliveredQuantity(): int
    {
        return (int) $this->deliveryChallanLines()->sum('delivery_quantity');
    }

    public function balanceQuantity(): int
    {
        return $this->quantity - $this->deliveredQuantity();
    }
}
