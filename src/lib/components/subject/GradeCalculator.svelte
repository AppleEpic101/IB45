<script>
	import Dropdown from '$lib/components/dropdown.svelte';
	import Slider from '$lib/components/slider.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import Meter from '$lib/components/subject/Meter.svelte';
	import GradeBoundaryUsed from '$lib/components/subject/GradeBoundaryUsed.svelte';
	import GradeStrategy from '$lib/components/subject/GradeStrategy.svelte';
	import Bulletin from '$lib/data/bulletin.js';

	import { calculateNormalResults, calculateCoreResults } from '$lib/utils/boundaries.js';
	import { calculateForecastProbabilities } from '$lib/utils/forecast.js';

	export let data;
	export let syllabus;
	export let s;
	export let grade;
	export let language;
	export let level;
	export let lastSL;
	export let lastHL;
	export let SLoptions;
	export let HLoptions;
	export let SLResults;
	export let HLResults;

	export let showGradeGraphs;
	export let showForecastDetails = false;

	export let mark;
	export let marksToIncrease;

	export let assessments;
	export let classical;
	export let languages;

	const gradeMap = {
		E: 1,
		D: 2,
		C: 3,
		B: 4,
		A: 5
	};
	const coreGrades = ['E', 'D', 'C', 'B', 'A'];
	const formatProbability = (chance) => {
		if (chance >= 0.995) return '>99%';
		if (chance > 0 && chance <= 0.005) return '<1%';
		return `${Math.round(chance * 100)}%`;
	};
	const formatPercentile = (value) => `${Number(Number(value).toFixed(1))}%`;

	let str;
	let gradeBoundaryUsed;
	$: selectedBoundary = data.isCore ? lastSL : level === 'HL' ? lastHL : lastSL;
	$: isForecastSelection = selectedBoundary?.isForecast === true;
	$: maximumScore =
		syllabus.name === 'Extended Essay' ? 34 : syllabus.name === 'Theory Of Knowledge' ? 30 : 100;
	$: hasPredictedGrade = mark !== undefined && mark !== null && mark !== 'N/A';
	$: nextGrade = hasPredictedGrade
		? data.isCore
			? coreGrades[gradeMap[mark]]
			: Number(mark) < 7
			? Number(mark) + 1
			: undefined
		: undefined;
	$: bulletinName = `${level} ${data.isLang ? `${language} ` : ''}${data.name}`;
	$: bulletinSessions = Bulletin[bulletinName]?.grades ?? [];
	$: bulletinSession = isForecastSelection
		? bulletinSessions.find((session) => session.short === 'N25') ?? bulletinSessions[0]
		: bulletinSessions.find((session) => session.short === selectedBoundary?.short);
	$: numericMark = Number(mark);
	$: percentile =
		Number.isInteger(numericMark) &&
		numericMark >= 1 &&
		numericMark <= 7 &&
		bulletinSession?.distribution?.length
			? bulletinSession.distribution
					.slice(0, numericMark)
					.reduce((sum, percentage) => sum + (Number(percentage) || 0), 0)
			: undefined;
	$: percentileLabel = percentile === undefined ? undefined : formatPercentile(percentile);
	$: forecastProbability = isForecastSelection
		? calculateForecastProbabilities(selectedBoundary?.forecast, grade)
		: undefined;
	$: probabilityGrades = data.isCore
		? (() => {
				const currentIndex = Math.max(0, coreGrades.indexOf(String(mark)));
				const startIndex = Math.min(coreGrades.length - 3, Math.max(0, currentIndex - 1));
				return coreGrades.slice(startIndex, startIndex + 3);
		  })()
		: (() => {
				const currentGrade = Number(mark);
				const startGrade = Math.min(5, Math.max(1, currentGrade - 1));
				return [startGrade, startGrade + 1, startGrade + 2].map(String);
		  })();
	$: forecastGradeProbabilities = forecastProbability
		? probabilityGrades.map((forecastGrade) => {
				const index = selectedBoundary.forecast.forecasts.findIndex(
					({ grade: label }) => String(label) === forecastGrade
				);
				return {
					grade: forecastGrade,
					chance: index >= 0 ? formatProbability(forecastProbability.exact[index]) : '—'
				};
		  })
		: [];
	$: forecastResults = level === 'HL' ? HLResults : SLResults;
	$: {
		const hasResults =
			data.isCore || (level === 'HL' ? HLResults.length > 0 : SLResults.length > 0);

		if (!hasResults || !selectedBoundary?.tz?.length) {
			str = 'No grade boundary data available for this selection';
			mark = 'N/A';
			marksToIncrease = undefined;
			gradeBoundaryUsed = undefined;
			showGradeGraphs = false;
		} else if (data.isCore) {
			mark = calculateCoreResults(grade, lastSL?.tz);
			gradeBoundaryUsed = {
				name: lastSL?.fullName,
				marks: lastSL?.tz
			};
			marksToIncrease = lastSL?.tz[gradeMap[mark]] - grade;
			str = isForecastSelection
				? 'Using November 2026 forecast'
				: 'Using the ' + lastSL?.fullName + ' grade boundary';
		} else {
			if (level === 'HL') {
				mark = calculateNormalResults(grade, lastHL?.tz);
				gradeBoundaryUsed = {
					name: lastHL?.fullName,
					marks: lastHL?.tz
				};
				marksToIncrease = lastHL?.tz[mark] - grade;
				str = isForecastSelection
					? 'Using November 2026 forecast'
					: 'Using the ' + lastHL?.fullName + ' grade boundary';
			} else {
				mark = calculateNormalResults(grade, lastSL?.tz);
				gradeBoundaryUsed = {
					name: lastSL?.fullName,
					marks: lastSL?.tz
				};
				marksToIncrease = lastSL?.tz[mark] - grade;
				str = isForecastSelection
					? 'Using November 2026 forecast'
					: 'Using the ' + lastSL?.fullName + ' grade boundary';
			}
			showGradeGraphs = true;
		}
	}
</script>

<div class="calculator-controls">
	<div class="control-group">
		{#if data.isLang}
			<div class="control-item">
				<span class="control-label">Language</span>
				<Dropdown
					arr={syllabus.name === 'Classical Language' ? classical : languages}
					bind:value={language}
				/>
			</div>
		{/if}

		{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge' && !data.SLOnly}
			<div class="control-item">
				<span class="control-label">Level</span>
				<ToggleSelect identifier="ef" arr={['SL', 'HL']} arrVal={['SL', 'HL']} bind:value={level} />
			</div>
		{/if}
	</div>

	<div class="control-item">
		<span class="control-label">Timezone / Session</span>
		{#if level === 'HL'}
			<ToggleSelect
				identifier="f"
				arr={HLoptions.map((tz) => tz.selectorName || tz.fullName)}
				arrVal={HLoptions}
				bind:value={lastHL}
			/>
		{:else}
			<ToggleSelect
				identifier="g"
				arr={SLoptions.map((tz) => tz.selectorName || tz.fullName)}
				arrVal={SLoptions}
				bind:value={lastSL}
			/>
		{/if}
	</div>
</div>

<div class="assessments" class:single-assessment={s.length === 1}>
	<div class="left">
		{#each s as assessment, i}
			<Slider
				bind:value={assessments[i]}
				name={assessment.name}
				weight={assessment.weight}
				max={assessment.maxMarks}
			/>
		{/each}
	</div>

	<div class="right">
		<div class="container">
			<div>
				<div class="x">Predicted Grade</div>
				{#if mark === 'N/A'}
					<div class="no-result">N/A</div>
				{:else if data.isCore}
					<Meter value={gradeMap[mark]} totalSegments={5} isCore={data.isCore} />
				{:else}
					<Meter value={mark} />
				{/if}

				<div class="pp">{str}</div>
				{#if forecastGradeProbabilities.length || percentile !== undefined}
					<div class="result-comparisons" aria-live="polite">
						{#if forecastGradeProbabilities.length}
							<div>
								<span class="comparison-title">Probability</span>
								<div class="probability-grid">
									{#each forecastGradeProbabilities as probability}
										<div class:current-grade={String(mark) === probability.grade}>
											<span>Grade {probability.grade}</span>
											<strong>{probability.chance}</strong>
										</div>
									{/each}
								</div>
							</div>
						{/if}
						{#if percentile !== undefined}
							<div>
								<span class="comparison-title">Percentile</span>
								<strong>Beats {percentileLabel}</strong>
								<small>of {bulletinSession.short} test takers</small>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="predicted">
				<div class="row">
					<div class="y">{data.isCore ? 'Score' : 'Weighted score'}</div>

					<div class="y">
						{grade}{data.isCore ? ` / ${maximumScore}` : '%'}
					</div>
				</div>

				<div class="row">
					<div class="y">{nextGrade ? `To Grade ${nextGrade}` : 'Next grade'}</div>
					{#if nextGrade && marksToIncrease > 0}
						<div class="y">{marksToIncrease} {marksToIncrease === 1 ? 'mark' : 'marks'}</div>
					{:else if hasPredictedGrade && !nextGrade}
						<div class="y">Top grade</div>
					{:else}
						<div class="y">Not available</div>
					{/if}
				</div>
				<GradeBoundaryUsed
					{gradeBoundaryUsed}
					mark={data.isCore ? gradeMap[mark] : mark}
					maxScore={maximumScore}
				/>
				{#if isForecastSelection}
					<div class="forecast-actions">
						<button type="button" on:click={() => (showForecastDetails = true)}>
							View forecast details <span aria-hidden="true">→</span>
						</button>
						<a href="/blog/ib-predict-boundary-forecast-methodology">How it works</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if !data.isCore && mark !== 'N/A'}
	<GradeStrategy
		assessments={s}
		scores={assessments}
		currentScore={grade}
		currentGrade={mark}
		{selectedBoundary}
		results={forecastResults}
		firstAssessment={syllabus.firstAssessment}
	/>
{/if}

<style lang="scss">
	.pp {
		font-size: 12px;
		font-weight: 550;
		margin: 0;
		text-align: center;
	}

	.result-comparisons {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin-top: 6px;

		> div {
			display: grid;
			gap: 1px;
			min-width: 0;
			padding: 7px 8px;
			border: 1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
			border-radius: 9px;
			background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));
		}

		span,
		small {
			color: var(--color-text-muted);
			font-size: 0.55rem;
			font-weight: 600;
		}

		strong {
			color: var(--color-primary);
			font-size: 0.88rem;
			line-height: 1.15;
		}

		.comparison-title {
			font-size: 0.58rem;
			font-weight: 750;
		}

		.probability-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 3px;
			margin-top: 3px;

			> div {
				display: grid;
				gap: 1px;
				padding: 3px 2px;
				border-radius: 5px;
				text-align: center;
			}

			.current-grade {
				background: color-mix(in srgb, var(--color-primary) 14%, transparent);
			}
		}

		@media (max-width: 420px) {
			grid-template-columns: 1fr;
		}
	}

	.forecast-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-top: 7px;
		padding-top: 7px;
		border-top: 1px solid var(--color-border);

		button,
		a {
			padding: 0;
			border: 0;
			background: transparent;
			color: var(--color-primary);
			font: inherit;
			font-size: 0.6rem;
			font-weight: 750;
			text-decoration: none;
			cursor: pointer;
		}

		button:hover,
		button:focus-visible,
		a:hover,
		a:focus-visible {
			text-decoration: underline;
		}
	}

	.no-result {
		display: grid;
		place-items: center;
		height: 120px;
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-text-muted);
	}

	.calculator-controls {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 1.25rem;
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.control-group {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.control-label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.assessments {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(320px, 1fr);
		gap: 24px;
		align-items: stretch;
		margin-top: 0;

		.left {
			display: flex;
			flex-direction: column;
			gap: 7px;
			min-width: 0;

			:global(.slider) {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
		}
	}

	.assessments.single-assessment {
		align-items: start;

		.left :global(.slider) {
			flex: initial;
		}
	}

	.right {
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100%;
		position: sticky;
		top: 100px;

		.container {
			background-color: var(--color-surface-variant);
			color: var(--color-text-main);
			padding: 12px;
			border: 1px solid var(--color-border);
			border-radius: 12px;
			margin: 0;
			box-shadow: var(--shadow-md);
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.predicted {
				margin-top: 8px;

				.row {
					display: flex;
					justify-content: space-between;
				}
			}

			.x {
				text-align: center;
				font-size: 22px;
				font-weight: 800;
				padding: 0 20px;
				margin-bottom: 4px;
			}

			.y {
				font-size: 15px;
				font-weight: bold;
			}
		}

		:global(svg) {
			width: 150px;
			height: 90px;
		}

		:global(table) {
			margin-top: 8px;
		}
	}

	@media (max-width: 850px) {
		.calculator-controls {
			align-items: flex-start;
			flex-direction: column;
		}
		.assessments {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			gap: 20px;

			.left,
			.right {
				width: 100%;
			}
		}

		.right {
			position: static;
			margin-top: 10px;
		}
	}
</style>
