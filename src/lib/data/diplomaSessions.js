import diplomaSessions from '$lib/assets/DiplomaSessions.json';

export function estimateDiplomaPercentile(score, session) {
	if (!session?.totalPointsDistribution || !Number.isFinite(score)) return null;

	const boundedScore = Math.max(0, Math.min(45, score));
	let below = 0;

	for (const band of session.totalPointsDistribution) {
		if (boundedScore > band.max) {
			below += band.percentage;
			continue;
		}

		if (boundedScore >= band.min) {
			const numberOfScores = band.max - band.min + 1;
			const lowerScoresInBand = boundedScore - band.min;
			below += band.percentage * (lowerScoresInBand / numberOfScores);
		}
		break;
	}

	return Math.max(0, Math.min(99.9, Math.round(below * 10) / 10));
}

export default diplomaSessions;
