<?php

namespace Database\Seeders;

use App\Models\Buyer;
use App\Models\Order;
use App\Models\Party;
use App\Models\Setting;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        User::factory(9)->create();

        Setting::current()->update([
            'company_name' => 'A-TEX LABEL (BD) LTD.',
            'head_office_address' => 'House # 35, Road # 1, Block # A, Niketan, Gulshan-1, Dhaka-1212, Bangladesh.',
            'factory_address' => 'Plot # 509, (Sarkar Bari), Durgapur, Kathgora, Zirabo, Ashulia, Savar, Dhaka-1341, Bangladesh.',
            'phone' => '+88-01708-575028, +88-01708-575029',
            'cell_numbers' => 'Nur Mohammed - 01329741551, Ripon - 01329741553',
            'email' => 'noor@a-texlabelbd.com, ripon@a-texlabelbd.com',
            'website' => 'www.a-texlabelbd.com',
            'next_order_seq' => 5516,
            'next_challan_seq' => 529,
            'next_bill_seq' => 1371,
            'next_work_order_seq' => 819,
        ]);

        $unit = Unit::create(['name' => 'Woven Unit']);

        $buyer = Buyer::create(['name' => 'AARONG', 'code' => 'ATB-9773']);

        $party = Party::create([
            'name' => 'D.S.S. BUTTON',
            'address' => "AARONG CENTRE\n346, Tejgaon I/A Dhaka-1208",
            'contact_person' => 'MR. RAGIB',
            'mobile' => '+880 1721-061138',
        ]);

        $order = Order::create([
            'order_no' => '5515/25-26',
            'date' => '2026-04-07',
            'buyer_id' => $buyer->id,
            'party_id' => $party->id,
            'unit_id' => $unit->id,
            'buyer_ref' => 'ATB-9773',
            'status' => 'in_production',
        ]);

        $order->items()->createMany([
            ['po_no' => 'OR00135976', 'description' => 'AARONG RECYCLE WOVEN LABEL', 'quantity' => 140000, 'rate' => 0.300],
            ['po_no' => 'OR00141106', 'description' => 'AARONG RECYCLE WOVEN LABEL', 'quantity' => 35000, 'rate' => 0.300],
            ['po_no' => 'OR00141105', 'description' => 'AARONG RECYCLE WOVEN LABEL', 'quantity' => 200000, 'rate' => 0.550],
            ['po_no' => 'OR00146747', 'description' => 'AARONG RECYCLE WOVEN LABEL', 'quantity' => 200000, 'rate' => 0.300],
            ['po_no' => 'OR00147740', 'description' => 'AARONG RECYCLE WOVEN LABEL', 'quantity' => 300000, 'rate' => 0.300],
            ['po_no' => 'OR00147546', 'description' => 'AARONG RECYCLE WOVEN LABEL', 'quantity' => 240000, 'rate' => 0.550],
        ]);
    }
}
