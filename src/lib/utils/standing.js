export const formatApproximateShare = (value) => {
	const numericValue = Number(value);
	if (!Number.isFinite(numericValue)) return 'comparison unavailable';

	const boundedValue = Math.min(100, Math.max(0, numericValue));
	if (boundedValue > 99 && boundedValue < 100) return 'more than 99%';
	if (boundedValue > 0 && boundedValue < 1) return 'less than 1%';

	return `about ${Math.round(boundedValue)}%`;
};
