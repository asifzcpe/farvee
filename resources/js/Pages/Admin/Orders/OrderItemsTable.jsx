import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

const emptyItem = () => ({ po_no: '', description: '', quantity: '', rate: '' });

export default function OrderItemsTable({ items, setItems, errors, locked = {} }) {
    function updateItem(index, field, value) {
        const next = [...items];
        next[index] = { ...next[index], [field]: value };
        setItems(next);
    }

    function addItem() {
        setItems([...items, emptyItem()]);
    }

    function removeItem(index) {
        setItems(items.filter((_, i) => i !== index));
    }

    const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);

    return (
        <div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/40">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                PO No.
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Description
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Quantity
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Rate
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Amount
                            </th>
                            <th className="px-4 py-2" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item, index) => {
                            const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                            const itemLocked = locked[item.id];
                            return (
                                <tr key={index}>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            className="block w-32 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            value={item.po_no}
                                            onChange={(e) => updateItem(index, 'po_no', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors?.[`items.${index}.po_no`]} className="mt-1" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            className="block w-56 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors?.[`items.${index}.description`]} className="mt-1" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min={itemLocked ? itemLocked.deliveredQuantity : 1}
                                            className="block w-28 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                            required
                                        />
                                        {itemLocked?.deliveredQuantity > 0 && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                {itemLocked.deliveredQuantity} already delivered
                                            </p>
                                        )}
                                        <InputError message={errors?.[`items.${index}.quantity`]} className="mt-1" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            step="0.001"
                                            min="0"
                                            className="block w-24 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            value={item.rate}
                                            onChange={(e) => updateItem(index, 'rate', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors?.[`items.${index}.rate`]} className="mt-1" />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={addItem}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    + Add line
                </button>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total: {total.toFixed(2)}
                </p>
            </div>
        </div>
    );
}

export { emptyItem };
