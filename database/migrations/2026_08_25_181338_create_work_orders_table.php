<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('work_order_no')->unique();
            $table->date('date');
            $table->foreignId('order_id')->constrained()->restrictOnDelete();
            $table->string('prepared_by')->nullable();
            $table->text('packing_instructions')->nullable();
            $table->text('material_note')->nullable();
            $table->text('process_note')->nullable();
            $table->text('folding_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};
