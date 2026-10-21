<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Delivery Challan {{ $challan->challan_no }}</title>
    <style>
        @page { size: A4; margin: 18mm 15mm; }
        * { box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            font-size: 12px;
            margin: 0;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1a2b6d;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .logo-mark {
            width: 46px;
            height: 46px;
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
            font-size: 22px;
            font-weight: bold;
            color: #1a2b6d;
            letter-spacing: 0.5px;
        }
        .company-sub {
            font-size: 10px;
            font-style: italic;
            color: #333;
        }
        .certs {
            text-align: right;
            font-size: 9px;
            color: #333;
            max-width: 220px;
        }
        .cert-badges {
            display: flex;
            gap: 6px;
            justify-content: flex-end;
            margin-bottom: 4px;
        }
        .cert-badge {
            border: 1px solid #999;
            border-radius: 4px;
            padding: 3px 5px;
            font-size: 8px;
            font-weight: bold;
        }
        .address-line {
            font-size: 9.5px;
            margin-top: 4px;
        }
        .title-banner {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2px;
            border: 1px solid #333;
            padding: 4px;
            margin-bottom: 10px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .meta-left, .meta-right {
            font-size: 12px;
            line-height: 1.6;
        }
        .meta-right { text-align: right; }
        .deliver-to {
            font-weight: bold;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
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
        table.items td.num, table.items th.num {
            text-align: right;
        }
        tr.total-row td {
            font-weight: bold;
            background: #f5f5f5;
        }
        .notes {
            margin-top: 10px;
            font-size: 10.5px;
            line-height: 1.5;
        }
        .footnotes {
            margin-top: 24px;
            font-size: 9px;
            color: #333;
        }
        .footnotes p { margin: 2px 0; }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 46px;
        }
        .signature-block {
            width: 30%;
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 4px;
            font-size: 10.5px;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <button class="no-print" onclick="window.print()" style="margin-bottom: 10px;">Print</button>

    <div class="header">
        <div class="header-left">
            <div class="logo-mark">A-TEX<br>LABEL</div>
            <div>
                <div class="company-name">{{ $settings->company_name }}</div>
                <div class="company-sub">(Manufacturer of Computerized Woven Label)</div>
                <div class="address-line">{{ $settings->head_office_address }}</div>
                <div class="address-line">
                    @if($settings->phone) Phone: {{ $settings->phone }} @endif
                    @if($settings->email) &nbsp; e-mail: {{ $settings->email }} @endif
                </div>
            </div>
        </div>
        <div class="certs">
            <div class="cert-badges">
                <span class="cert-badge">amfori BSCI</span>
                <span class="cert-badge">OEKO-TEX</span>
            </div>
            <div class="cert-badges">
                <span class="cert-badge">GRS</span>
                <span class="cert-badge">FSC</span>
            </div>
        </div>
    </div>

    <div class="title-banner">DELIVERY CHALLAN</div>

    <div class="meta-row">
        <div class="meta-left">
            <div><strong>CHN No.:</strong> {{ $challan->challan_no }}</div>
            <div class="deliver-to">Delivery To: {{ $challan->party->name }}</div>
            <div>{{ $challan->party->address }}</div>
            @if($challan->party->contact_person)
                <div>Contact Person: {{ $challan->party->contact_person }}</div>
            @endif
            @if($challan->party->mobile)
                <div>Mobile#: {{ $challan->party->mobile }}</div>
            @endif
        </div>
        <div class="meta-right">
            <div><strong>Date:</strong> {{ $challan->date->format('d.m.Y') }}</div>
            <div><strong>A-Tex O/N.:</strong> {{ $challan->order->order_no }}</div>
            <div><strong>Buyer:</strong> {{ $challan->buyer->name }}</div>
            @if($challan->style)
                <div><strong>Style:</strong> {{ $challan->style }}</div>
            @endif
            @if($challan->job_po_ord)
                <div><strong>Job/PO/Ord:</strong> {{ $challan->job_po_ord }}</div>
            @endif
        </div>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%">SL No.</th>
                <th style="width: 15%">PO No.</th>
                <th>Description of Goods</th>
                <th class="num" style="width: 12%">Order Qty</th>
                <th class="num" style="width: 12%">Delivery Qty</th>
                <th class="num" style="width: 12%">Balance</th>
            </tr>
        </thead>
        <tbody>
            @php($groupDescription = $challan->lines->first()?->orderItem->description)
            <tr>
                <td rowspan="{{ $challan->lines->count() }}">01.</td>
                <td>{{ $challan->lines->first()->orderItem->po_no }}</td>
                <td rowspan="{{ $challan->lines->count() }}">{{ $groupDescription }}</td>
                <td class="num">{{ number_format($challan->lines->first()->order_quantity) }} PCS</td>
                <td class="num">{{ number_format($challan->lines->first()->delivery_quantity) }} PCS</td>
                <td class="num">{{ number_format($challan->lines->first()->balance_quantity) }} PCS</td>
            </tr>
            @foreach($challan->lines->slice(1) as $line)
                <tr>
                    <td>{{ $line->orderItem->po_no }}</td>
                    <td class="num">{{ number_format($line->order_quantity) }} PCS</td>
                    <td class="num">{{ number_format($line->delivery_quantity) }} PCS</td>
                    <td class="num">{{ number_format($line->balance_quantity) }} PCS</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3">Total</td>
                <td class="num">{{ number_format($challan->lines->sum('order_quantity')) }} PCS</td>
                <td class="num">{{ number_format($challan->lines->sum('delivery_quantity')) }} PCS</td>
                <td class="num">{{ number_format($challan->lines->sum('balance_quantity')) }} PCS</td>
            </tr>
        </tbody>
    </table>

    <div class="notes">
        @if($challan->material_note)
            <p>{{ $challan->material_note }}</p>
        @endif
        @if($challan->gross_weight || $challan->net_weight)
            <p>
                @if($challan->gross_weight) GROSS WEIGHT &ndash; {{ $challan->gross_weight }} KGS &nbsp; @endif
                @if($challan->net_weight) NET WEIGHT &ndash; {{ $challan->net_weight }} KGS @endif
            </p>
        @endif
    </div>

    <div class="footnotes">
        <p>* "Only the products that are identified as such on this document are FSC&trade; certified."</p>
        <p>* Please verify quality and quantity of the delivered goods through this challan.</p>
        <p>No claims will be justified after 24 hours of delivery.</p>
    </div>

    <div class="signatures">
        <div class="signature-block">Delivered by<br>{{ $challan->delivered_by }}</div>
        <div class="signature-block">Approved by<br>{{ $challan->approved_by }}</div>
        <div class="signature-block">Receiver's Signature<br>(I have received the above goods<br>in good condition &amp; found no fault)</div>
    </div>
</body>
</html>
