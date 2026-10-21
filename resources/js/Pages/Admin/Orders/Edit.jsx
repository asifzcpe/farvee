import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import OrderItemsTable from './OrderItemsTable';

export default function Edit({ order, buyers, parties, units }) {
    const [items, setItems] = useState(
        order.items.map((item) => ({
            id: item.id,
            po_no: item.po_no,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
        }))
    );

    const locked = Object.fromEntries(
        order.items.map((item) => [item.id, { deliveredQuantity: item.delivered_quantity }])
    );

    const { data, setData, put, processing, errors, transform } = useForm({
        order_no: order.order_no,
        date: order.date,
        buyer_id: order.buyer_id,
        party_id: order.party_id,
        unit_id: order.unit_id,
        style: order.style ?? '',
        pi_no: order.pi_no ?? '',
        buyer_ref: order.buyer_ref ?? '',
    });

    function submit(e) {
        e.preventDefault();
        transform((formData) => ({ ...formData, items }));
        put(route('admin.orders.update', order.id));
    }

    return (
        <AdminLayout header={`Order ${order.order_no}`}>
            <Head title={`Order ${order.order_no}`} />

            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                            <InputLabel htmlFor="order_no" value="Order No." />
                            <TextInput
                                id="order_no"
                                className="mt-1 block w-full"
                                value={data.order_no}
                                onChange={(e) => setData('order_no', e.target.value)}
                                required
                            />
                            <InputError message={errors.order_no} className="mt-2" />
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
                            <InputLabel htmlFor="unit_id" value="Unit" />
                            <select
                                id="unit_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.unit_id}
                                onChange={(e) => setData('unit_id', e.target.value)}
                                required
                            >
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.unit_id} className="mt-2" />
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
                            <InputLabel htmlFor="buyer_ref" value="Buyer Ref. (e.g. ATB No.)" />
                            <TextInput
                                id="buyer_ref"
                                className="mt-1 block w-full"
                                value={data.buyer_ref}
                                onChange={(e) => setData('buyer_ref', e.target.value)}
                            />
                            <InputError message={errors.buyer_ref} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="style" value="Style" />
                            <TextInput
                                id="style"
                                className="mt-1 block w-full"
                                value={data.style}
                                onChange={(e) => setData('style', e.target.value)}
                            />
                            <InputError message={errors.style} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pi_no" value="PI No." />
                            <TextInput
                                id="pi_no"
                                className="mt-1 block w-full"
                                value={data.pi_no}
                                onChange={(e) => setData('pi_no', e.target.value)}
                            />
                            <InputError message={errors.pi_no} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        PO Line Items
                    </h3>
                    <OrderItemsTable items={items} setItems={setItems} errors={errors} locked={locked} />
                    <InputError message={errors.items} className="mt-3" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                </div>
            </form>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <LinkedDocuments
                    title="Work Orders"
                    items={order.work_orders}
                    labelKey="work_order_no"
                    editRoute="admin.work-orders.edit"
                    createHref={route('admin.work-orders.create', { order: order.id })}
                />
                <LinkedDocuments
                    title="Delivery Challans"
                    items={order.delivery_challans}
                    labelKey="challan_no"
                    editRoute="admin.delivery-challans.edit"
                    createHref={route('admin.delivery-challans.create', { order: order.id })}
                />
                <LinkedDocuments
                    title="Bills"
                    items={order.bills}
                    labelKey="bill_ref_no"
                    editRoute="admin.bills.edit"
                    createHref={route('admin.bills.create', { order: order.id })}
                />
            </div>
        </AdminLayout>
    );
}

function LinkedDocuments({ title, items, labelKey, editRoute, createHref }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h4>
                <Link href={createHref} className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    + New
                </Link>
            </div>
            {items.length === 0 && (
                <p className="text-xs text-gray-400">None yet.</p>
            )}
            <ul className="space-y-1">
                {items.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={route(editRoute, item.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            {item[labelKey]}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
