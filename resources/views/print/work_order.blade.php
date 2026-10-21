<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Work Order {{ $workOrder->work_order_no }}</title>
    <style>
        @page { size: A4; margin: 20mm 18mm; }
        * { box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            font-size: 12px;
            margin: 0;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 6px;
        }
        .logo-mark {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #1a2b6d;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: bold;
            color: #1a2b6d;
            text-align: center;
            line-height: 1.1;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1a2b6d;
        }
        hr {
            border: none;
            border-top: 2px solid #333;
            margin: 6px 0 14px;
        }
        .title-banner {
            text-align: center;
            margin-bottom: 12px;
        }
        .title-banner .box {
            display: inline-block;
            border: 1px solid #333;
            padding: 4px 24px;
            font-weight: bold;
            font-size: 14px;
        }
        .title-banner .unit {
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 4px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 14px;
        }
        .meta-left, .meta-right {
            font-size: 12px;
            line-height: 1.7;
        }
        .meta-right { text-align: right; }
        .specs {
            margin-bottom: 12px;
            font-size: 12px;
        }
        .specs div { margin-bottom: 2px; }
        .fold-note {
            text-align: center;
            font-weight: bold;
            margin: 12px 0;
            font-size: 12px;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }
        table.items th, table.items td {
            border: 1px solid #333;
            padding: 5px 6px;
            font-size: 11px;
            vertical-align: top;
        }
        table.items th {
            background: #eef0f7;
            text-align: left;
        }
        table.items td.num, table.items th.num { text-align: right; }
        .instructions {
            margin-top: 14px;
            font-size: 11.5px;
            line-height: 1.6;
        }
        .instructions p { margin: 3px 0; }
        .prepared-by {
            margin-top: 40px;
            text-align: right;
            font-size: 11px;
        }
        .reference-image {
            margin-top: 14px;
        }
        .reference-image img {
            max-width: 220px;
            max-height: 220px;
            border: 1px solid #333;
            padding: 3px;
        }
        .reference-image .caption {
            font-size: 10px;
            color: #555;
            margin-top: 3px;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <button class="no-print" onclick="window.print()" style="margin-bottom: 10px;">Print</button>

    <div class="header">
        <div class="logo-mark">A-TEX<br>LABEL</div>
        <div class="company-name">{{ $settings->company_name }}</div>
    </div>
    <hr>

    <div class="title-banner">
        <div class="box">WORK ORDER</div>
        <div class="unit">{{ $workOrder->order->unit->name ?? 'WOVEN UNIT' }}</div>
    </div>

    <div class="meta-row">
        <div class="meta-left">
            <div>{{ $workOrder->work_order_no }}</div>
            <div><strong>O/No.:</strong> {{ $workOrder->order->order_no }}</div>
            <div><strong>PARTY NAME:</strong> {{ $workOrder->order->party->name }}</div>
        </div>
        <div class="meta-right">
            <div><strong>Date:</strong> {{ $workOrder->date->format('d.m.Y') }}</div>
            <div>{{ $workOrder->order->buyer->name }}</div>
            @if($workOrder->order->buyer_ref)
                <div>{{ $workOrder->order->buyer_ref }}</div>
            @endif
        </div>
    </div>

    @if($workOrder->specifications->isNotEmpty())
        <div class="specs">
            @foreach($workOrder->specifications as $spec)
                <div>{{ str_pad($spec->line_no, 2, '0', STR_PAD_LEFT) }}. {{ $spec->description }}</div>
            @endforeach
        </div>
    @endif

    @if($workOrder->folding_note)
        <div class="fold-note">{{ $workOrder->folding_note }}</div>
    @endif

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%">#</th>
                <th style="width: 15%">PO No.</th>
                <th>Description</th>
                <th class="num" style="width: 12%">Quantity</th>
                <th class="num" style="width: 15%">Rate</th>
                <th class="num" style="width: 15%">Total</th>
            </tr>
        </thead>
        <tbody>
            @php($groupDescription = $workOrder->lines->first()?->orderItem->description)
            <tr>
                <td rowspan="{{ $workOrder->lines->count() }}">1.</td>
                <td>{{ $workOrder->lines->first()->orderItem->po_no }}</td>
                <td rowspan="{{ $workOrder->lines->count() }}">{{ $groupDescription }}</td>
                <td class="num">{{ number_format($workOrder->lines->first()->quantity) }} PCS</td>
                <td class="num">Tk {{ number_format($workOrder->lines->first()->orderItem->rate, 3) }} /PCS</td>
                <td class="num">TK {{ number_format($workOrder->lines->first()->quantity * $workOrder->lines->first()->orderItem->rate, 2) }}</td>
            </tr>
            @foreach($workOrder->lines->slice(1) as $line)
                <tr>
                    <td>{{ $line->orderItem->po_no }}</td>
                    <td class="num">{{ number_format($line->quantity) }} PCS</td>
                    <td class="num">Tk {{ number_format($line->orderItem->rate, 3) }} /PCS</td>
                    <td class="num">TK {{ number_format($line->quantity * $line->orderItem->rate, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="instructions">
        @if($workOrder->packing_instructions)
            <p><strong>PACKING:</strong> {!! nl2br(e($workOrder->packing_instructions)) !!}</p>
        @endif
        @if($workOrder->material_note)
            <p>{{ $workOrder->material_note }}</p>
        @endif
        @if($workOrder->process_note)
            <p><strong>WITH</strong><br>{{ $workOrder->process_note }}</p>
        @endif
    </div>

    @if($workOrder->image_path)
        <div class="reference-image">
            <img src="{{ asset('storage/'.$workOrder->image_path) }}" alt="Reference image">
            <div class="caption">Reference Image</div>
        </div>
    @endif

    <div class="prepared-by">
        Prepared by: {{ $workOrder->prepared_by }}
    </div>
</body>
</html>
