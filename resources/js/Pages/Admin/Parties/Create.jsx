import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        contact_person: '',
        mobile: '',
        email: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.parties.store'));
    }

    return (
        <AdminLayout header="New Party">
            <Head title="New Party" />

            <div className="max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="address" value="Address" />
                        <textarea
                            id="address"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_person" value="Contact Person" />
                        <TextInput
                            id="contact_person"
                            className="mt-1 block w-full"
                            value={data.contact_person}
                            onChange={(e) => setData('contact_person', e.target.value)}
                        />
                        <InputError message={errors.contact_person} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="mobile" value="Mobile" />
                        <TextInput
                            id="mobile"
                            className="mt-1 block w-full"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', e.target.value)}
                        />
                        <InputError message={errors.mobile} className="mt-2" />
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

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Create Party</PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
