<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkOrder extends Model
{
    protected $fillable = [
        'work_order_no', 'date', 'order_id', 'prepared_by',
        'packing_instructions', 'material_note', 'process_note', 'folding_note',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function specifications(): HasMany
    {
        return $this->hasMany(WorkOrderSpecification::class)->orderBy('line_no');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(WorkOrderLine::class);
    }
}
