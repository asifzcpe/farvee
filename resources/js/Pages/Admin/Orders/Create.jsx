import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import OrderItemsTable, { emptyItem } from './OrderItemsTable';

export default function Create({ buyers, parties, units, suggestedOrderNo }) {
    const [items, setItems] = useState([emptyItem()]);

    const { data, setData, post, processing, errors, transform } = useForm({
        order_no: suggestedOrderNo,
        date: new Date().toISOString().slice(0, 10),
        buyer_id: '',
        party_id: '',
        unit_id: units[0]?.id ?? '',
        style: '',
        pi_no: '',
        buyer_ref: '',
    });

    function submit(e) {
        e.preventDefault();
        transform((formData) => ({ ...formData, items }));
        post(route('admin.orders.store'));
    }

    return (
        <AdminLayout header="New Order">
            <Head title="New Order" />

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
                                <option value="">Select unit…</option>
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
                                <option value="">Select buyer…</option>
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
                                <option value="">Select party…</option>
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
                    <OrderItemsTable items={items} setItems={setItems} errors={errors} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Create Order</PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
