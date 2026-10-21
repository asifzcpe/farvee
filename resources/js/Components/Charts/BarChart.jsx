import { useState } from 'react';
import { formatCompact, niceMax } from './formatValue';

const WIDTH = 480;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 8;
const PAD_TOP = 24;
const PAD_BOTTOM = 24;
const BAR_MAX_WIDTH = 24;

/** Fractions of max to place gridlines at; drops the midpoint if it would
 * round to the same displayed value as an endpoint (e.g. max=1). */
function tickFractions(max) {
    const mid = Math.round(max / 2);
    if (mid === 0 || mid === Math.round(max)) {
        return [0, 1];
    }
    return [0, 0.5, 1];
}

/**
 * Single-series column chart. Values are counts or currency amounts over a
 * small number of time buckets (e.g. the last 6 months).
 */
export default function BarChart({ data, color, formatFull, ariaLabel }) {
    const [active, setActive] = useState(null);

    const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
    const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const max = niceMax(Math.max(...data.map((d) => d.value), 0));
    const ticks = tickFractions(max);
    const bandWidth = plotWidth / data.length;
    const barWidth = Math.min(BAR_MAX_WIDTH, bandWidth * 0.55);

    const valueToY = (value) => PAD_TOP + plotHeight * (1 - value / max);
    const format = formatFull ?? ((v) => v.toLocaleString());

    const activeDatum = active !== null ? data[active] : null;

    return (
        <div className="relative">
            <svg
                role="img"
                aria-label={ariaLabel}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full"
                style={{ height: HEIGHT }}
            >
                {/* Gridlines + y ticks */}
                {ticks.map((t) => {
                    const y = PAD_TOP + plotHeight * (1 - t);
                    return (
                        <g key={t}>
                            <line
                                x1={PAD_LEFT}
                                x2={WIDTH - PAD_RIGHT}
                                y1={y}
                                y2={y}
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            <text
                                x={PAD_LEFT - 8}
                                y={y}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className="fill-gray-400 text-[9px] dark:fill-gray-500"
                            >
                                {formatCompact(max * t)}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const cx = PAD_LEFT + bandWidth * i + bandWidth / 2;
                    const y = valueToY(d.value);
                    const barHeight = Math.max(PAD_TOP + plotHeight - y, 0);
                    const isActive = active === i;
                    const isLast = i === data.length - 1;

                    return (
                        <g key={d.label}>
                            {/* Hit target: full column band, taller than the bar itself */}
                            <rect
                                x={cx - bandWidth / 2}
                                y={PAD_TOP}
                                width={bandWidth}
                                height={plotHeight}
                                fill="transparent"
                                tabIndex={0}
                                role="button"
                                aria-label={`${d.label}: ${format(d.value)}`}
                                onMouseEnter={() => setActive(i)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(i)}
                                onBlur={() => setActive(null)}
                            />

                            <rect
                                x={cx - barWidth / 2}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx={4}
                                fill={color}
                                opacity={isActive ? 1 : 0.85}
                                className="pointer-events-none transition-opacity"
                            />

                            {isLast && (
                                <text
                                    x={cx}
                                    y={y - 6}
                                    textAnchor="middle"
                                    className="fill-gray-600 text-[10px] font-medium dark:fill-gray-300"
                                >
                                    {formatCompact(d.value)}
                                </text>
                            )}

                            <text
                                x={cx}
                                y={HEIGHT - PAD_BOTTOM + 14}
                                textAnchor="middle"
                                className="fill-gray-400 text-[9px] dark:fill-gray-500"
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}

                {/* Tooltip */}
                {activeDatum && (() => {
                    const cx = PAD_LEFT + bandWidth * active + bandWidth / 2;
                    const y = valueToY(activeDatum.value);
                    const text = `${activeDatum.label}: ${format(activeDatum.value)}`;
                    const boxWidth = Math.max(text.length * 5.2 + 16, 60);
                    const boxX = Math.min(Math.max(cx - boxWidth / 2, 2), WIDTH - boxWidth - 2);
                    const boxY = Math.max(y - 30, 2);

                    return (
                        <g className="pointer-events-none">
                            <rect
                                x={boxX}
                                y={boxY}
                                width={boxWidth}
                                height={20}
                                rx={4}
                                className="fill-gray-900 dark:fill-gray-100"
                            />
                            <text
                                x={boxX + boxWidth / 2}
                                y={boxY + 10}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-white text-[9px] font-medium dark:fill-gray-900"
                            >
                                {text}
                            </text>
                        </g>
                    );
                })()}
            </svg>
        </div>
    );
}
