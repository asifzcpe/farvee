import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ units }) {
    function destroy(unit) {
        if (confirm(`Delete ${unit.name}? This cannot be undone.`)) {
            router.delete(route('admin.units.destroy', unit.id));
        }
    }

    return (
        <AdminLayout header="Units">
            <Head title="Units" />

            <div className="mb-4 flex justify-end">
                <Link
                    href={route('admin.units.create')}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                >
                    New Unit
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/40">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Name
                            </th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {units.data.map((unit) => (
                            <tr key={unit.id}>
                                <td className="whitespace-nowrap px-5 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {unit.name}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-right text-sm">
                                    <Link
                                        href={route('admin.units.edit', unit.id)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => destroy(unit)}
                                        className="ml-4 font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {units.data.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No units found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {units.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {units.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? '#'}
                            preserveState
                            className={
                                'rounded-md px-3 py-1.5 text-sm ' +
                                (link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700') +
                                (!link.url ? ' pointer-events-none opacity-50' : '')
                            }
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
