import AdminLayout from '@/Layouts/AdminLayout';
import BarChart from '@/Components/Charts/BarChart';
import StatusBreakdown from '@/Components/Charts/StatusBreakdown';
import { formatDate } from '@/utils/date';
import { Head, Link } from '@inertiajs/react';

// Sequential hues for two adjacent single-series charts (validated pair).
const ORDERS_COLOR = '#2a78d6';
const BILLED_COLOR = '#eb6834';

// Fixed status palette: never reused as a series color, always shown with a label.
const STATUS_COLORS = {
    draft: '#898781',
    in_production: '#fab219',
    completed: '#0ca30c',
};

function StatCard({ label, value }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
            {children}
        </div>
    );
}

export default function Dashboard({ stats, recentOrders, monthlyOrders, monthlyBilled, statusBreakdown }) {
    return (
        <AdminLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Orders" value={stats.totalOrders} />
                <StatCard label="Delivery Challans" value={stats.totalChallans} />
                <StatCard label="Bills" value={stats.totalBills} />
                <StatCard
                    label="Billed This Month"
                    value={Number(stats.billedThisMonth).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ChartCard title="Orders per Month">
                    <BarChart
                        data={monthlyOrders}
                        color={ORDERS_COLOR}
                        ariaLabel="Orders per month, last 6 months"
                    />
                </ChartCard>

                <ChartCard title="Billed Amount per Month">
                    <BarChart
                        data={monthlyBilled}
                        color={BILLED_COLOR}
                        formatFull={(v) => `Tk ${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        ariaLabel="Billed amount per month, last 6 months"
                    />
                </ChartCard>
            </div>

            <div className="mt-6">
                <ChartCard title="Orders by Status">
                    <StatusBreakdown
                        segments={statusBreakdown.map((s) => ({ ...s, color: STATUS_COLORS[s.key] }))}
                    />
                </ChartCard>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                        Recent Orders
                    </h2>
                    <Link
                        href={route('admin.orders.index')}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        View all orders
                    </Link>
                </div>

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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="whitespace-nowrap px-5 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    <Link href={route('admin.orders.edit', order.id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                        {order.order_no}
                                    </Link>
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
                            </tr>
                        ))}

                        {recentOrders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No orders yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
