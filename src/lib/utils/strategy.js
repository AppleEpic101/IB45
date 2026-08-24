import { calculateGrade } from '$lib/utils/grades.js';
import { calculateNormalResults } from '$lib/utils/boundaries.js';

const sessionRank = (short) => {
	const match = /^([MN])(\d{2})/.exec(short ?? '');
	if (!match) return -1;
	return Number(match[2]) * 2 + (match[1] === 'N' ? 1 : 0);
};

const sessionYear = (short) => {
	const match = /^[MN](\d{2})/.exec(short ?? '');
	return match ? 2000 + Number(match[1]) : undefined;
};

const mode = (values) => {
	const counts = new Map();
	values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
	return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0];
};

const weightedScore = (scores, assessments) =>
	assessments.reduce(
		(total, assessment, index) =>
			total +
			((Number(scores[index]) || 0) / assessment.maxMarks) * Number(assessment.weight || 0) * 100,
		0
	);

const formatPath = (steps) => {
	if (!steps.length) return '';
	const labels = steps.map(
		({ delta, name }) => `+${delta} ${delta === 1 ? 'mark' : 'marks'} on ${name}`
	);
	if (labels.length === 1) return labels[0];
	return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`;
};

export const buildImprovementStrategy = ({
	scores = [],
	assessments = [],
	currentScore,
	currentGrade,
	boundary
}) => {
	const numericGrade = Number(currentGrade);
	if (
		!assessments.length ||
		!boundary?.tz?.length ||
		!Number.isInteger(numericGrade) ||
		numericGrade < 1 ||
		numericGrade >= boundary.tz.length
	) {
		return undefined;
	}

	const nextBoundary = Number(boundary.tz[numericGrade]);
	if (!Number.isFinite(nextBoundary)) return undefined;

	const normalizedScores = assessments.map((assessment, index) =>
		Math.min(assessment.maxMarks, Math.max(0, Number(scores[index]) || 0))
	);
	const options = assessments.map((assessment, index) => {
		const impact = (Number(assessment.weight || 0) / assessment.maxMarks) * 100;
		const remaining = Math.max(0, assessment.maxMarks - normalizedScores[index]);
		let marksNeeded;

		for (let delta = 1; delta <= remaining; delta += 1) {
			const simulated = [...normalizedScores];
			simulated[index] += delta;
			if (
				calculateGrade(
					simulated,
					assessments.map(({ maxMarks }) => maxMarks),
					assessments.map(({ weight }) => weight),
					''
				) >= nextBoundary
			) {
				marksNeeded = delta;
				break;
			}
		}

		return {
			name: assessment.name,
			index,
			impact,
			remaining,
			marksNeeded
		};
	});

	const simulated = [...normalizedScores];
	const steps = [];
	const ordered = [...options].sort((a, b) => b.impact - a.impact || a.index - b.index);
	for (const option of ordered) {
		let delta = 0;
		while (
			delta < option.remaining &&
			Math.round(weightedScore(simulated, assessments)) < nextBoundary
		) {
			simulated[option.index] += 1;
			delta += 1;
		}
		if (delta) steps.push({ name: option.name, index: option.index, delta });
		if (Math.round(weightedScore(simulated, assessments)) >= nextBoundary) break;
	}

	const reachesNextGrade = Math.round(weightedScore(simulated, assessments)) >= nextBoundary;
	const totalMarks = steps.reduce((sum, step) => sum + step.delta, 0);

	return {
		currentScore: Number(currentScore),
		currentGrade: numericGrade,
		nextGrade: numericGrade + 1,
		nextBoundary,
		pointsNeeded: Math.max(0, nextBoundary - Number(currentScore)),
		options,
		steps,
		totalMarks,
		reachesNextGrade,
		recommendation: reachesNextGrade ? formatPath(steps) : undefined
	};
};

export const buildHistoricalConfidence = ({
	currentScore,
	currentGrade,
	selectedBoundary,
	results = [],
	firstAssessment
}) => {
	const score = Number(currentScore);
	const grade = Number(currentGrade);
	if (!Number.isFinite(score) || !Number.isInteger(grade) || grade < 1) return undefined;

	const comparable = results.filter((result) => {
		const year = sessionYear(result.short);
		return result.tz?.length && (!firstAssessment || (year && year >= Number(firstAssessment)));
	});
	if (!comparable.length) return undefined;

	const outcomes = comparable.map((result) => calculateNormalResults(score, result.tz));
	const agreementCount = outcomes.filter((outcome) => outcome === grade).length;
	const lowerCount = outcomes.filter((outcome) => outcome < grade).length;
	const higherCount = outcomes.filter((outcome) => outcome > grade).length;
	const lowerBoundary = Number(selectedBoundary?.tz?.[grade - 1]);
	const riseToDrop = Number.isFinite(lowerBoundary)
		? Math.max(1, score - lowerBoundary + 1)
		: undefined;
	const confidence = (agreementCount / outcomes.length) * 100;

	return {
		confidence,
		label: confidence >= 80 ? 'Secure' : confidence >= 55 ? 'Competitive' : 'Borderline',
		sampleSize: outcomes.length,
		lowerChance: (lowerCount / outcomes.length) * 100,
		higherChance: (higherCount / outcomes.length) * 100,
		riseToDrop,
		lowerGrade: Math.max(1, grade - 1)
	};
};

export const buildHistoricalComparisons = ({ currentScore, results = [], firstAssessment }) => {
	const score = Number(currentScore);
	if (!Number.isFinite(score)) return [];

	const grouped = new Map();
	results
		.filter((result) => {
			const year = sessionYear(result.short);
			return result.tz?.length && (!firstAssessment || (year && year >= Number(firstAssessment)));
		})
		.forEach((result) => {
			if (!grouped.has(result.short)) {
				grouped.set(result.short, { short: result.short, name: result.name, grades: [] });
			}
			grouped.get(result.short).grades.push(calculateNormalResults(score, result.tz));
		});

	return [...grouped.values()]
		.map((session) => ({
			...session,
			grade: mode(session.grades),
			minGrade: Math.min(...session.grades),
			maxGrade: Math.max(...session.grades),
			timezoneCount: session.grades.length
		}))
		.sort((a, b) => sessionRank(b.short) - sessionRank(a.short));
};
