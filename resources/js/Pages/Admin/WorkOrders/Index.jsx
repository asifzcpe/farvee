import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate } from '@/utils/date';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ workOrders, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function submitSearch(e) {
        e.preventDefault();
        router.get(route('admin.work-orders.index'), { search }, { preserveState: true, replace: true });
    }

    function destroy(workOrder) {
        if (confirm(`Delete work order ${workOrder.work_order_no}? This cannot be undone.`)) {
            router.delete(route('admin.work-orders.destroy', workOrder.id));
        }
    }

    return (
        <AdminLayout header="Work Orders">
            <Head title="Work Orders" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={submitSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search work order no…"
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <button
                        type="submit"
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Search
                    </button>
                </form>

                <Link
                    href={route('admin.work-orders.create')}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                >
                    New Work Order
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/40">
                        <tr>
                            <th className="px-5 py-3" />
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Work Order No.
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Date
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Order No.
                            </th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {workOrders.data.map((workOrder) => (
                            <tr key={workOrder.id}>
                                <td className="px-5 py-3">
                                    {workOrder.image_path ? (
                                        <img
                                            src={`/storage/${workOrder.image_path}`}
                                            alt=""
                                            className="h-10 w-10 rounded-md border border-gray-200 object-cover dark:border-gray-700"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-md border border-dashed border-gray-200 dark:border-gray-700" />
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {workOrder.work_order_no}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(workOrder.date)}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {workOrder.order?.order_no}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-right text-sm">
                                    <a
                                        href={route('admin.work-orders.print', workOrder.id)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
                                    >
                                        Print
                                    </a>
                                    <Link
                                        href={route('admin.work-orders.edit', workOrder.id)}
                                        className="ml-4 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => destroy(workOrder)}
                                        className="ml-4 font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {workOrders.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No work orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {workOrders.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {workOrders.links.map((link, index) => (
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
