import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate } from '@/utils/date';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusStyles = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_production: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
};

export default function Index({ orders, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function submitSearch(e) {
        e.preventDefault();
        router.get(route('admin.orders.index'), { search }, { preserveState: true, replace: true });
    }

    function destroy(order) {
        if (confirm(`Delete order ${order.order_no}? This cannot be undone.`)) {
            router.delete(route('admin.orders.destroy', order.id));
        }
    }

    return (
        <AdminLayout header="Orders">
            <Head title="Orders" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={submitSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search order no…"
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
                    href={route('admin.orders.create')}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                >
                    New Order
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/40">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Order No.
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Date
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Buyer
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Party
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Status
                            </th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.data.map((order) => (
                            <tr key={order.id}>
                                <td className="whitespace-nowrap px-5 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {order.order_no}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(order.date)}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {order.buyer?.name}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {order.party?.name}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-sm">
                                    <span
                                        className={
                                            'inline-flex rounded-full px-2 text-xs font-semibold leading-5 ' +
                                            (statusStyles[order.status] ?? statusStyles.draft)
                                        }
                                    >
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-right text-sm">
                                    <Link
                                        href={route('admin.orders.edit', order.id)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => destroy(order)}
                                        className="ml-4 font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {orders.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {orders.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {orders.links.map((link, index) => (
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
