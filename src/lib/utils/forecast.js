const COVID_SESSIONS = new Set(['N20', 'N21', 'N22']);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const mean = (values) =>
	values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const standardDeviation = (values) => {
	if (values.length < 2) return 0;
	const average = mean(values);
	return Math.sqrt(mean(values.map((value) => Math.pow(value - average, 2))));
};

const quantile = (values, percentile) => {
	if (!values.length) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const index = (sorted.length - 1) * percentile;
	const lower = Math.floor(index);
	const upper = Math.ceil(index);
	if (lower === upper) return sorted[lower];
	return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const weightedMean = (points, targetYear) => {
	let weightedTotal = 0;
	let totalWeight = 0;

	points.forEach((point) => {
		const age = Math.max(0, targetYear - point.year - 1);
		const covidWeight = COVID_SESSIONS.has(point.short) ? 0.35 : 1;
		const weight = Math.pow(0.72, age) * covidWeight;
		weightedTotal += point.value * weight;
		totalWeight += weight;
	});

	return totalWeight ? weightedTotal / totalWeight : 0;
};

const weightedTrend = (points, targetYear) => {
	if (points.length < 3) return weightedMean(points, targetYear);

	const weighted = points.map((point) => {
		const age = Math.max(0, targetYear - point.year - 1);
		return {
			...point,
			weight: Math.pow(0.72, age) * (COVID_SESSIONS.has(point.short) ? 0.35 : 1)
		};
	});
	const totalWeight = weighted.reduce((sum, point) => sum + point.weight, 0);
	const xMean = weighted.reduce((sum, point) => sum + point.year * point.weight, 0) / totalWeight;
	const yMean = weighted.reduce((sum, point) => sum + point.value * point.weight, 0) / totalWeight;
	const numerator = weighted.reduce(
		(sum, point) => sum + point.weight * (point.year - xMean) * (point.value - yMean),
		0
	);
	const denominator = weighted.reduce(
		(sum, point) => sum + point.weight * Math.pow(point.year - xMean, 2),
		0
	);
	const slope = clamp(denominator ? numerator / denominator : 0, -2, 2);
	return yMean + slope * (targetYear - xMean);
};

const forecastPoint = (points, targetYear) => {
	if (!points.length) return 0;
	const recentAverage = weightedMean(points, targetYear);
	const trendEstimate = weightedTrend(points, targetYear);
	return recentAverage * 0.7 + trendEstimate * 0.3;
};

const normalCdf = (value) => {
	const sign = value < 0 ? -1 : 1;
	const x = Math.abs(value) / Math.sqrt(2);
	const t = 1 / (1 + 0.3275911 * x);
	const erf =
		sign *
		(1 -
			((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
				t *
				Math.exp(-x * x));
	return (1 + erf) / 2;
};

const sessionYear = (short) => 2000 + Number(short?.slice(1, 3));

export const aggregateForecastSessions = (results, sessionPrefix = 'N') => {
	const grouped = new Map();

	results
		.filter((result) => result.short?.startsWith(sessionPrefix))
		.forEach((result) => {
			if (!grouped.has(result.short)) {
				grouped.set(result.short, {
					short: result.short,
					name: result.name,
					year: sessionYear(result.short),
					rows: []
				});
			}
			grouped.get(result.short).rows.push(result);
		});

	return [...grouped.values()]
		.sort((a, b) => a.year - b.year)
		.map((session) => {
			const boundaryCount = Math.max(...session.rows.map((row) => row.tz.length), 0);
			return {
				...session,
				boundaries: Array.from({ length: boundaryCount }, (_, index) => {
					const values = session.rows.map((row) => Number(row.tz[index])).filter(Number.isFinite);
					return {
						value: mean(values),
						min: Math.min(...values),
						max: Math.max(...values)
					};
				})
			};
		});
};

const rollingErrors = (sessions, gradeIndex) => {
	const errors = [];
	for (let index = 3; index < sessions.length; index += 1) {
		const trainingPoints = sessions.slice(0, index).map((session) => ({
			short: session.short,
			year: session.year,
			value: session.boundaries[gradeIndex].value
		}));
		const predicted = forecastPoint(trainingPoints, sessions[index].year);
		errors.push(Math.abs(predicted - sessions[index].boundaries[gradeIndex].value));
	}
	return errors;
};

const enforceIncreasing = (values, gap = 1) => {
	const output = [...values];
	for (let index = 1; index < output.length; index += 1) {
		output[index] = Math.max(output[index], output[index - 1] + gap);
	}
	return output;
};

export const buildBoundaryForecast = ({
	results,
	targetYear = 2026,
	sessionPrefix = 'N',
	labels = ['1', '2', '3', '4', '5', '6', '7']
}) => {
	const sessions = aggregateForecastSessions(results, sessionPrefix);
	if (sessions.length < 3) return undefined;

	const raw = labels.map((label, gradeIndex) => {
		const points = sessions.map((session) => ({
			short: session.short,
			year: session.year,
			value: session.boundaries[gradeIndex].value
		}));
		const point = forecastPoint(points, targetYear);
		const errors = rollingErrors(sessions, gradeIndex);
		const timezoneSpread = mean(
			sessions.map(
				(session) => (session.boundaries[gradeIndex].max - session.boundaries[gradeIndex].min) / 2
			)
		);
		const historicalVariation = standardDeviation(points.map(({ value }) => value));
		const backtestWidth = quantile(errors, 0.8);
		const intervalWidth = clamp(
			Math.max(2, backtestWidth, historicalVariation * 0.65, timezoneSpread),
			2,
			12
		);
		const mae = mean(errors);
		const confidence =
			sessions.length >= 8 && mae <= 2.5 && intervalWidth <= 4
				? 'High'
				: sessions.length >= 4 && mae <= 4.5 && intervalWidth <= 7
				? 'Medium'
				: 'Low';

		return { label, point, intervalWidth, mae, confidence };
	});

	const points = enforceIncreasing(raw.map(({ point }) => Math.round(clamp(point, 0, 100))));
	const lowers = enforceIncreasing(
		raw.map(({ point, intervalWidth }) => Math.round(clamp(point - intervalWidth, 0, 100))),
		0
	);
	const uppers = enforceIncreasing(
		raw.map(({ point, intervalWidth }) => Math.round(clamp(point + intervalWidth, 0, 100))),
		0
	);

	const forecasts = raw.map((item, index) => ({
		grade: item.label,
		point: points[index],
		lower: Math.min(lowers[index], points[index]),
		upper: Math.max(uppers[index], points[index]),
		mae: item.mae,
		confidence: item.confidence,
		sigma: Math.max(1, item.intervalWidth / 1.2816)
	}));
	const allErrors = raw.flatMap((_, index) => rollingErrors(sessions, index));

	return {
		target: `${sessionPrefix}${String(targetYear).slice(-2)}`,
		targetName: `${sessionPrefix === 'N' ? 'November' : 'May'} ${targetYear}`,
		trainingThrough: sessions.at(-1).short,
		sessionCount: sessions.length,
		timezoneCount: Math.max(...sessions.map((session) => session.rows.length)),
		mae: allErrors.length ? mean(allErrors) : undefined,
		forecasts,
		modelVersion: '1.0'
	};
};

export const calculateForecastProbabilities = (forecast, mark) => {
	if (!forecast || !Number.isFinite(Number(mark))) return undefined;
	const score = Number(mark);
	const cumulative = forecast.forecasts.map((boundary) =>
		normalCdf((score - boundary.point) / boundary.sigma)
	);

	for (let index = 1; index < cumulative.length; index += 1) {
		cumulative[index] = Math.min(cumulative[index], cumulative[index - 1]);
	}

	const exact = cumulative.map((chance, index) =>
		index === cumulative.length - 1 ? chance : Math.max(0, chance - cumulative[index + 1])
	);
	const total = exact.reduce((sum, chance) => sum + chance, 0) || 1;
	const normalized = exact.map((chance) => chance / total);
	const mostLikelyIndex = normalized.indexOf(Math.max(...normalized));

	return {
		exact: normalized,
		cumulative,
		mostLikelyGrade: forecast.forecasts[mostLikelyIndex].grade,
		mostLikelyChance: normalized[mostLikelyIndex],
		nextGradeChance:
			mostLikelyIndex < cumulative.length - 1 ? cumulative[mostLikelyIndex + 1] : cumulative.at(-1)
	};
};
