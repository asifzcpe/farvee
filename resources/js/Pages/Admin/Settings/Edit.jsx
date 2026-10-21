import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        company_name: settings.company_name ?? '',
        head_office_address: settings.head_office_address ?? '',
        factory_address: settings.factory_address ?? '',
        phone: settings.phone ?? '',
        cell_numbers: settings.cell_numbers ?? '',
        email: settings.email ?? '',
        website: settings.website ?? '',
        logo: null,
        next_order_seq: settings.next_order_seq,
        next_challan_seq: settings.next_challan_seq,
        next_bill_seq: settings.next_bill_seq,
        next_work_order_seq: settings.next_work_order_seq,
        fiscal_year_start_month: settings.fiscal_year_start_month,
        default_usd_bdt_rate: settings.default_usd_bdt_rate ?? '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.settings.update'));
    }

    return (
        <AdminLayout header="Company Settings">
            <Head title="Settings" />

            <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="company_name" value="Company Name" />
                        <TextInput
                            id="company_name"
                            className="mt-1 block w-full"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.company_name} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="head_office_address" value="Head Office Address" />
                            <textarea
                                id="head_office_address"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.head_office_address}
                                onChange={(e) => setData('head_office_address', e.target.value)}
                            />
                            <InputError message={errors.head_office_address} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="factory_address" value="Factory Address" />
                            <textarea
                                id="factory_address"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.factory_address}
                                onChange={(e) => setData('factory_address', e.target.value)}
                            />
                            <InputError message={errors.factory_address} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput
                                id="phone"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="cell_numbers" value="Cell Numbers" />
                            <TextInput
                                id="cell_numbers"
                                className="mt-1 block w-full"
                                value={data.cell_numbers}
                                onChange={(e) => setData('cell_numbers', e.target.value)}
                            />
                            <InputError message={errors.cell_numbers} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="website" value="Website" />
                            <TextInput
                                id="website"
                                className="mt-1 block w-full"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                            />
                            <InputError message={errors.website} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="logo" value="Logo" />
                        {settings.logo_path && (
                            <img
                                src={`/storage/${settings.logo_path}`}
                                alt="Current logo"
                                className="mt-2 h-16 w-auto"
                            />
                        )}
                        <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="mt-2 block w-full text-sm text-gray-600 dark:text-gray-300"
                            onChange={(e) => setData('logo', e.target.files[0])}
                        />
                        <InputError message={errors.logo} className="mt-2" />
                    </div>

                    <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Document Numbering
                        </h3>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                            <div>
                                <InputLabel htmlFor="next_order_seq" value="Next Order #" />
                                <TextInput
                                    id="next_order_seq"
                                    type="number"
                                    min={1}
                                    className="mt-1 block w-full"
                                    value={data.next_order_seq}
                                    onChange={(e) => setData('next_order_seq', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="next_challan_seq" value="Next Challan #" />
                                <TextInput
                                    id="next_challan_seq"
                                    type="number"
                                    min={1}
                                    className="mt-1 block w-full"
                                    value={data.next_challan_seq}
                                    onChange={(e) => setData('next_challan_seq', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="next_bill_seq" value="Next Bill #" />
                                <TextInput
                                    id="next_bill_seq"
                                    type="number"
                                    min={1}
                                    className="mt-1 block w-full"
                                    value={data.next_bill_seq}
                                    onChange={(e) => setData('next_bill_seq', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="next_work_order_seq" value="Next Work Order #" />
                                <TextInput
                                    id="next_work_order_seq"
                                    type="number"
                                    min={1}
                                    className="mt-1 block w-full"
                                    value={data.next_work_order_seq}
                                    onChange={(e) => setData('next_work_order_seq', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6 max-w-xs">
                            <InputLabel htmlFor="fiscal_year_start_month" value="Fiscal Year Start Month" />
                            <select
                                id="fiscal_year_start_month"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                value={data.fiscal_year_start_month}
                                onChange={(e) => setData('fiscal_year_start_month', e.target.value)}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Billing Defaults
                        </h3>
                        <div className="max-w-xs">
                            <InputLabel htmlFor="default_usd_bdt_rate" value="Default USD / BDT Rate" />
                            <TextInput
                                id="default_usd_bdt_rate"
                                type="number"
                                step="0.01"
                                min={0}
                                className="mt-1 block w-full"
                                value={data.default_usd_bdt_rate}
                                onChange={(e) => setData('default_usd_bdt_rate', e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Pre-fills new bills' rate field. Changing this later does not affect
                                bills already saved — each bill stores its own rate.
                            </p>
                            <InputError message={errors.default_usd_bdt_rate} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Save Settings</PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
