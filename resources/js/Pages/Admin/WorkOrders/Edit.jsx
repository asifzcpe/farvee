import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ workOrder }) {
    const [quantities, setQuantities] = useState(
        Object.fromEntries(workOrder.lines.map((line) => [line.order_item_id, line.quantity]))
    );
    const [specifications, setSpecifications] = useState(
        workOrder.specifications.length > 0
            ? workOrder.specifications.map((s) => s.description)
            : ['', '']
    );
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'put',
        work_order_no: workOrder.work_order_no,
        date: workOrder.date,
        prepared_by: workOrder.prepared_by ?? '',
        packing_instructions: workOrder.packing_instructions ?? '',
        material_note: workOrder.material_note ?? '',
        process_note: workOrder.process_note ?? '',
        folding_note: workOrder.folding_note ?? '',
        image: null,
    });

    function onImageChange(e) {
        const file = e.target.files[0] ?? null;
        setData('image', file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    }

    function updateSpec(index, value) {
        const next = [...specifications];
        next[index] = value;
        setSpecifications(next);
    }

    function submit(e) {
        e.preventDefault();
        const lines = workOrder.order.items.map((item) => ({
            order_item_id: item.id,
            quantity: quantities[item.id] || item.quantity,
        }));
        const specs = specifications.filter((s) => s.trim() !== '').map((description) => ({ description }));

        transform((formData) => ({ ...formData, lines, specifications: specs }));
        post(route('admin.work-orders.update', workOrder.id));
    }

    return (
        <AdminLayout header={`Work Order ${workOrder.work_order_no}`}>
            <Head title={`Work Order ${workOrder.work_order_no}`} />

            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                            <InputLabel value="Order No." />
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{workOrder.order.order_no}</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="work_order_no" value="Work Order No." />
                            <TextInput
                                id="work_order_no"
                                className="mt-1 block w-full"
                                value={data.work_order_no}
                                onChange={(e) => setData('work_order_no', e.target.value)}
                                required
                            />
                            <InputError message={errors.work_order_no} className="mt-2" />
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
                            <InputLabel htmlFor="prepared_by" value="Prepared By" />
                            <TextInput
                                id="prepared_by"
                                className="mt-1 block w-full"
                                value={data.prepared_by}
                                onChange={(e) => setData('prepared_by', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Specifications
                    </h3>
                    {specifications.map((spec, index) => (
                        <div key={index} className="mb-2 flex gap-2">
                            <span className="pt-2 text-sm text-gray-400">{index + 1}.</span>
                            <TextInput
                                className="block w-full"
                                value={spec}
                                onChange={(e) => updateSpec(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setSpecifications([...specifications, ''])}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        + Add spec line
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Instructions
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="packing_instructions" value="Packing Instructions" />
                            <textarea
                                id="packing_instructions"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.packing_instructions}
                                onChange={(e) => setData('packing_instructions', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="material_note" value="Material Note" />
                            <textarea
                                id="material_note"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.material_note}
                                onChange={(e) => setData('material_note', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="process_note" value="Process Note" />
                            <textarea
                                id="process_note"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.process_note}
                                onChange={(e) => setData('process_note', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="folding_note" value="Folding Note" />
                            <textarea
                                id="folding_note"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.folding_note}
                                onChange={(e) => setData('folding_note', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Reference Image
                    </h3>
                    <InputLabel htmlFor="image" value="Upload an image (label design, sample photo, etc.)" />
                    {(imagePreview || workOrder.image_path) && (
                        <img
                            src={imagePreview ?? `/storage/${workOrder.image_path}`}
                            alt="Reference"
                            className="mt-2 h-32 w-auto rounded-md border border-gray-200 object-cover dark:border-gray-700"
                        />
                    )}
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="mt-2 block w-full text-sm text-gray-600 dark:text-gray-300"
                        onChange={onImageChange}
                    />
                    <InputError message={errors.image} className="mt-2" />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        PO Items
                    </h3>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/40">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">PO No.</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Order Qty</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Produce Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {workOrder.order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.po_no}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                className="block w-28 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                value={quantities[item.id] ?? ''}
                                                onChange={(e) =>
                                                    setQuantities({ ...quantities, [item.id]: e.target.value })
                                                }
                                            />
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
                        href={route('admin.work-orders.print', workOrder.id)}
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
