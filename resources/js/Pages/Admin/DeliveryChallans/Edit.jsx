import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ challan, orderItems, parties, buyers }) {
    const [quantities, setQuantities] = useState(
        Object.fromEntries(orderItems.map((item) => [item.id, item.delivery_quantity]))
    );

    const { data, setData, put, processing, errors, transform } = useForm({
        challan_no: challan.challan_no,
        date: challan.date,
        party_id: challan.party_id,
        buyer_id: challan.buyer_id,
        style: challan.style ?? '',
        job_po_ord: challan.job_po_ord ?? '',
        gross_weight: challan.gross_weight ?? '',
        net_weight: challan.net_weight ?? '',
        material_note: challan.material_note ?? '',
        delivered_by: challan.delivered_by ?? '',
        approved_by: challan.approved_by ?? '',
    });

    function submit(e) {
        e.preventDefault();
        const lines = orderItems.map((item) => ({
            order_item_id: item.id,
            delivery_quantity: quantities[item.id] || 0,
        }));

        transform((formData) => ({ ...formData, lines }));
        put(route('admin.delivery-challans.update', challan.id));
    }

    return (
        <AdminLayout header={`Delivery Challan ${challan.challan_no}`}>
            <Head title={`Delivery Challan ${challan.challan_no}`} />

            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                            <InputLabel value="Order No." />
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{challan.order.order_no}</p>
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
                            <InputLabel htmlFor="party_id" value="Party" />
                            <select
                                id="party_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.party_id}
                                onChange={(e) => setData('party_id', e.target.value)}
                                required
                            >
                                {parties.map((party) => (
                                    <option key={party.id} value={party.id}>
                                        {party.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.party_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="buyer_id" value="Buyer" />
                            <select
                                id="buyer_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.buyer_id}
                                onChange={(e) => setData('buyer_id', e.target.value)}
                                required
                            >
                                {buyers.map((buyer) => (
                                    <option key={buyer.id} value={buyer.id}>
                                        {buyer.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.buyer_id} className="mt-2" />
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
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Items to Deliver
                    </h3>

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
                                                disabled={item.billed}
                                            />
                                            {item.billed && (
                                                <p className="mt-1 text-xs text-gray-400">Billed — locked</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <InputError message={errors.lines} className="mt-3" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                    <a
                        href={route('admin.delivery-challans.print', challan.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
                    >
                        Print
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
