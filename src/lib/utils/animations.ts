export function sinusoidal(t: number, period: number, start: 1 | -1, sign: 0 | 1 | -1) {
	return (
		Math.abs((sign || 2) / 2) * (Math.sin(Math.PI * (2 * (period ?? 1) * t + start * 0.5)) + sign)
	);
}
