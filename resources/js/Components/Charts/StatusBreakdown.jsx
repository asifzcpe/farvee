const GAP = 2;

/**
 * Part-to-whole breakdown of orders by status, as a single horizontal
 * stacked bar with a legend. Status colors never carry meaning alone: the
 * label and count are always visible beside the swatch.
 */
export default function StatusBreakdown({ segments }) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);

    return (
        <div>
            <div className="flex h-6 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" style={{ gap: `${GAP}px` }}>
                {segments.map((s) =>
                    s.value > 0 ? (
                        <div
                            key={s.key}
                            style={{ width: `${(s.value / Math.max(total, 1)) * 100}%`, backgroundColor: s.color }}
                            title={`${s.label}: ${s.value}`}
                        />
                    ) : null
                )}
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {segments.map((s) => (
                    <div key={s.key} className="flex items-center gap-2">
                        <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: s.color }}
                            aria-hidden="true"
                        />
                        <dt className="text-sm text-gray-600 dark:text-gray-300">{s.label}</dt>
                        <dd className="ml-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{s.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
