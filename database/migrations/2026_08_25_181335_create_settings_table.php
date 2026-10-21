<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('A-TEX LABEL (BD) LTD.');
            $table->text('head_office_address')->nullable();
            $table->text('factory_address')->nullable();
            $table->string('phone')->nullable();
            $table->string('cell_numbers')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('logo_path')->nullable();
            $table->unsignedInteger('next_order_seq')->default(1);
            $table->unsignedInteger('next_challan_seq')->default(1);
            $table->unsignedInteger('next_bill_seq')->default(1);
            $table->unsignedInteger('next_work_order_seq')->default(1);
            $table->unsignedTinyInteger('fiscal_year_start_month')->default(7);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
