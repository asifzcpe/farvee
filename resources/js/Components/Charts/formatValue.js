function trimZero(str) {
    return str.replace(/\.0$/, '');
}

export function formatCompact(value) {
    const n = Number(value) || 0;

    if (Math.abs(n) >= 1_000_000) {
        return `${trimZero((n / 1_000_000).toFixed(1))}M`;
    }

    if (Math.abs(n) >= 1_000) {
        return `${trimZero((n / 1_000).toFixed(1))}K`;
    }

    return Math.round(n).toLocaleString();
}

/** Rounds up to a "nice" number (1/2/5 * 10^n) for clean axis ticks. */
export function niceMax(value) {
    const max = Math.max(Number(value) || 0, 1);
    const magnitude = 10 ** Math.floor(Math.log10(max));
    const normalized = max / magnitude;

    let step;
    if (normalized <= 1) step = 1;
    else if (normalized <= 2) step = 2;
    else if (normalized <= 5) step = 5;
    else step = 10;

    return step * magnitude;
}
