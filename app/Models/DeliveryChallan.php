<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryChallan extends Model
{
    protected $fillable = [
        'challan_no', 'date', 'order_id', 'party_id', 'buyer_id',
        'style', 'job_po_ord', 'gross_weight', 'net_weight', 'material_note',
        'delivered_by', 'approved_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'gross_weight' => 'decimal:2',
            'net_weight' => 'decimal:2',
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
        return $this->hasMany(DeliveryChallanLine::class);
    }
}
