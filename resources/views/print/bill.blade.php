<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Bill {{ $bill->bill_ref_no }}</title>
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
            border-bottom: 4px solid #1a2b6d;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }
        .logo-mark {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            border: 2px solid #1a2b6d;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: #1a2b6d;
            text-align: center;
            line-height: 1.1;
        }
        .company-name {
            font-size: 26px;
            font-weight: bold;
            color: #1a2b6d;
            letter-spacing: 0.5px;
        }
        .title-banner {
            text-align: center;
            margin-bottom: 4px;
        }
        .title-banner .doc-title {
            font-size: 14px;
            font-weight: bold;
        }
        .title-banner .unit {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 2px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin: 14px 0;
        }
        .meta-left, .meta-right {
            font-size: 12px;
            line-height: 1.7;
        }
        .meta-right { text-align: right; }
        .to-block {
            margin-bottom: 10px;
            font-size: 12px;
            line-height: 1.6;
        }
        .intro {
            font-size: 12px;
            margin-bottom: 10px;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }
        table.items th, table.items td {
            border-bottom: 1px solid #999;
            padding: 5px 6px;
            font-size: 11px;
        }
        table.items th {
            border-bottom: 2px solid #333;
            text-align: left;
        }
        table.items td.num, table.items th.num {
            text-align: right;
        }
        .grand-total {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
            font-size: 13px;
            font-weight: bold;
        }
        .grand-total .box {
            border: 1px solid #333;
            padding: 6px 14px;
        }
        .rate-note {
            margin-top: 14px;
            font-size: 11px;
        }
        .closing {
            margin-top: 18px;
            font-size: 12px;
            line-height: 1.6;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .signature-block {
            font-size: 11px;
        }
        .footer {
            position: fixed;
            bottom: -10mm;
            left: 0;
            right: 0;
            border-top: 2px solid #1a2b6d;
            padding-top: 6px;
            font-size: 9px;
            color: #333;
            text-align: center;
            line-height: 1.5;
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

    <div class="title-banner">
        <div class="doc-title">BILL FOR READYMADE GARMENTS ACCESSORIES</div>
        <div class="unit">WOVEN UNIT</div>
    </div>

    <div class="meta-row">
        <div class="meta-left">
            <div><strong>O/NO:</strong> {{ $bill->order->order_no }}</div>
            <div><strong>REF:</strong> {{ $bill->bill_ref_no }}</div>
        </div>
        <div class="meta-right">
            <div><strong>DATE:</strong> {{ $bill->date->format('d.m.Y') }}</div>
            @if($bill->pi_no)<div><strong>PI:</strong> {{ $bill->pi_no }}</div>@endif
            <div><strong>PO NO:</strong> {{ $bill->lines->pluck('deliveryChallanLine.orderItem.po_no')->unique()->implode(', ') }}</div>
            <div><strong>BUYER:</strong> {{ $bill->buyer->name }}</div>
            @if($bill->or_no)<div><strong>O/R NO:</strong> {{ $bill->or_no }}</div>@endif
        </div>
    </div>

    <div class="to-block">
        TO,<br>
        THE MANAGING DIRECTOR<br>
        <strong>{{ $bill->party->name }}</strong>
    </div>

    <div class="intro">
        DEAR SIR,<br>
        WE ARE PLEASED TO SUBMIT OUR BILL FOR THE EXECUTION BILLS ARE AS FOLLOWS:
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>Challan No &amp; Date</th>
                <th>Description of Goods</th>
                <th class="num">Quantity</th>
                <th class="num">Unit Price</th>
                <th class="num">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bill->lines as $line)
                <tr>
                    <td>{{ $line->deliveryChallanLine->deliveryChallan->challan_no }} {{ $line->deliveryChallanLine->deliveryChallan->date->format('d.m.Y') }}</td>
                    <td>{{ $line->deliveryChallanLine->orderItem->description }}</td>
                    <td class="num">{{ number_format($line->quantity) }} PCS</td>
                    <td class="num">Tk {{ number_format($line->unit_price, 3) }} /PCS</td>
                    <td class="num">TK {{ number_format($line->amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="grand-total">
        <div class="box">TK {{ number_format($bill->total_amount, 2) }}</div>
    </div>

    <div class="rate-note">
        USD. $ 1.00 = TAKA {{ $bill->usd_bdt_rate ? number_format($bill->usd_bdt_rate, 2) : '____' }} BDT
    </div>

    <div class="closing">
        YOU ARE THEREFORE REQUESTED TO MAKE THE PAYMENT AT THE EARLIEST.<br>
        THANKING YOU
    </div>

    <div class="signatures">
        <div class="signature-block">
            SINCERELY YOURS<br><br><br>
            {{ $settings->company_name }}
        </div>
        <div class="signature-block">
            Recv. Sign &amp; Date
        </div>
    </div>

    <div class="footer">
        <strong>Head Office</strong>: {{ $settings->head_office_address }}<br>
        <strong>Factory</strong>: {{ $settings->factory_address }}<br>
        @if($settings->phone) Phone: {{ $settings->phone }} @endif
        @if($settings->cell_numbers) &nbsp; Cell: {{ $settings->cell_numbers }} @endif
        @if($settings->email) &nbsp; E-mail: {{ $settings->email }} @endif
        @if($settings->website) &nbsp; {{ $settings->website }} @endif
    </div>
</body>
</html>
