import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ orders, selectedOrderId, suggestedChallanNo }) {
    const [orderId, setOrderId] = useState(selectedOrderId ?? '');
    const [orderItems, setOrderItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        challan_no: suggestedChallanNo,
        date: new Date().toISOString().slice(0, 10),
        order_id: selectedOrderId ?? '',
        party_id: '',
        buyer_id: '',
        style: '',
        job_po_ord: '',
        gross_weight: '',
        net_weight: '',
        material_note: '',
        delivered_by: '',
        approved_by: '',
    });

    useEffect(() => {
        if (!orderId) {
            setOrderItems([]);
            return;
        }

        setLoading(true);
        fetch(route('admin.orders.remaining-items', orderId))
            .then((res) => res.json())
            .then((json) => {
                setOrderItems(json.items);
                setData((prev) => ({
                    ...prev,
                    order_id: orderId,
                    party_id: json.order.party_id,
                    buyer_id: json.order.buyer_id,
                    style: json.order.style ?? '',
                }));
                setQuantities({});
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    function submit(e) {
        e.preventDefault();
        const lines = orderItems.map((item) => ({
            order_item_id: item.id,
            delivery_quantity: quantities[item.id] || 0,
        }));

        transform((formData) => ({ ...formData, lines }));
        post(route('admin.delivery-challans.store'));
    }

    return (
        <AdminLayout header="New Delivery Challan">
            <Head title="New Delivery Challan" />

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
                            <InputLabel htmlFor="challan_no" value="Challan No." />
                            <TextInput
                                id="challan_no"
                                className="mt-1 block w-full"
                                value={data.challan_no}
                                onChange={(e) => setData('challan_no', e.target.value)}
                                required
                            />
                            <InputError message={errors.challan_no} className="mt-2" />
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
                            <InputLabel htmlFor="job_po_ord" value="Job/PO/Ord" />
                            <TextInput
                                id="job_po_ord"
                                className="mt-1 block w-full"
                                value={data.job_po_ord}
                                onChange={(e) => setData('job_po_ord', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="gross_weight" value="Gross Weight" />
                            <TextInput
                                id="gross_weight"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.gross_weight}
                                onChange={(e) => setData('gross_weight', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="net_weight" value="Net Weight" />
                            <TextInput
                                id="net_weight"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.net_weight}
                                onChange={(e) => setData('net_weight', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="delivered_by" value="Delivered By" />
                            <TextInput
                                id="delivered_by"
                                className="mt-1 block w-full"
                                value={data.delivered_by}
                                onChange={(e) => setData('delivered_by', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="approved_by" value="Approved By" />
                            <TextInput
                                id="approved_by"
                                className="mt-1 block w-full"
                                value={data.approved_by}
                                onChange={(e) => setData('approved_by', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="material_note" value="Material Note" />
                        <textarea
                            id="material_note"
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.material_note}
                            onChange={(e) => setData('material_note', e.target.value)}
                            placeholder="e.g. Woven Label, 100% Recycled post-consumer Polyester"
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Items to Deliver
                    </h3>

                    {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading order items…</p>}

                    {!loading && orderId && orderItems.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">This order has no items.</p>
                    )}

                    {!loading && orderItems.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/40">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">PO No.</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Order Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Balance</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Deliver Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {orderItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.po_no}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.order_quantity}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.balance_quantity}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={item.balance_quantity}
                                                    className="block w-28 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                    value={quantities[item.id] ?? ''}
                                                    onChange={(e) =>
                                                        setQuantities({ ...quantities, [item.id]: e.target.value })
                                                    }
                                                    disabled={item.balance_quantity <= 0}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <InputError message={errors.lines} className="mt-3" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !orderId}>Create Challan</PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
