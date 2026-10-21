import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { formatDate } from '@/utils/date';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ orders, selectedOrderId, suggestedBillRefNo, defaultUsdBdtRate }) {
    const [orderId, setOrderId] = useState(selectedOrderId ?? '');
    const [availableLines, setAvailableLines] = useState([]);
    const [selected, setSelected] = useState({});
    const [unitPrices, setUnitPrices] = useState({});
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        bill_ref_no: suggestedBillRefNo,
        date: new Date().toISOString().slice(0, 10),
        order_id: selectedOrderId ?? '',
        party_id: '',
        buyer_id: '',
        pi_no: '',
        or_no: '',
        usd_bdt_rate: defaultUsdBdtRate ?? '',
    });

    useEffect(() => {
        if (!orderId) {
            setAvailableLines([]);
            return;
        }

        setLoading(true);
        fetch(route('admin.orders.unbilled-lines', orderId))
            .then((res) => res.json())
            .then((json) => {
                setAvailableLines(json.lines);
                setData((prev) => ({
                    ...prev,
                    order_id: orderId,
                    party_id: json.order.party_id,
                    buyer_id: json.order.buyer_id,
                }));
                setSelected({});
                setUnitPrices(Object.fromEntries(json.lines.map((l) => [l.id, l.unit_price])));
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    function toggle(lineId) {
        setSelected({ ...selected, [lineId]: !selected[lineId] });
    }

    const selectedLines = availableLines.filter((l) => selected[l.id]);
    const total = selectedLines.reduce((sum, l) => sum + l.quantity * (Number(unitPrices[l.id]) || 0), 0);

    function submit(e) {
        e.preventDefault();
        const lines = selectedLines.map((l) => ({
            delivery_challan_line_id: l.id,
            unit_price: unitPrices[l.id],
        }));

        transform((formData) => ({ ...formData, lines }));
        post(route('admin.bills.store'));
    }

    return (
        <AdminLayout header="New Bill">
            <Head title="New Bill" />

            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                            <InputLabel htmlFor="order_id" value="Order" />
                            <select
                                id="order_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            >
                                <option value="">Select order…</option>
                                {orders.map((order) => (
                                    <option key={order.id} value={order.id}>
                                        {order.order_no}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.order_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="bill_ref_no" value="Bill Ref. No." />
                            <TextInput
                                id="bill_ref_no"
                                className="mt-1 block w-full"
                                value={data.bill_ref_no}
                                onChange={(e) => setData('bill_ref_no', e.target.value)}
                                required
                            />
                            <InputError message={errors.bill_ref_no} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="date" value="Date" />
                            <TextInput
                                id="date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pi_no" value="PI No." />
                            <TextInput
                                id="pi_no"
                                className="mt-1 block w-full"
                                value={data.pi_no}
                                onChange={(e) => setData('pi_no', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="or_no" value="O/R No." />
                            <TextInput
                                id="or_no"
                                className="mt-1 block w-full"
                                value={data.or_no}
                                onChange={(e) => setData('or_no', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="usd_bdt_rate" value="USD/BDT Rate (optional)" />
                            <TextInput
                                id="usd_bdt_rate"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.usd_bdt_rate}
                                onChange={(e) => setData('usd_bdt_rate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Unbilled Delivery Lines
                    </h3>

                    {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>}

                    {!loading && orderId && availableLines.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No unbilled delivery lines for this order.
                        </p>
                    )}

                    {!loading && availableLines.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/40">
                                    <tr>
                                        <th className="px-4 py-2" />
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Challan No. &amp; Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">PO No.</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {availableLines.map((line) => (
                                        <tr key={line.id}>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected[line.id]}
                                                    onChange={() => toggle(line.id)}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                {line.challan_no} {formatDate(line.challan_date)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{line.po_no}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{line.description}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{line.quantity}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    step="0.001"
                                                    min="0"
                                                    className="block w-24 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                    value={unitPrices[line.id] ?? ''}
                                                    onChange={(e) =>
                                                        setUnitPrices({ ...unitPrices, [line.id]: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                {(line.quantity * (Number(unitPrices[line.id]) || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <InputError message={errors.lines} className="mt-3" />

                    {selectedLines.length > 0 && (
                        <p className="mt-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Total: {total.toFixed(2)}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || selectedLines.length === 0}>Create Bill</PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
