<script>
	import Dropdown from '$lib/components/dropdown.svelte';
	import Slider from '$lib/components/slider.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import Meter from '$lib/components/subject/Meter.svelte';
	import GradeBoundaryUsed from '$lib/components/subject/GradeBoundaryUsed.svelte';
	import GradeStrategy from '$lib/components/subject/GradeStrategy.svelte';
	import Bulletin from '$lib/data/bulletin.js';

	import { calculateNormalResults, calculateCoreResults } from '$lib/utils/boundaries.js';
	import { buildBoundaryForecast, calculateForecastProbabilities } from '$lib/utils/forecast.js';

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

	let str;
	let gradeBoundaryUsed;
	$: selectedBoundary = data.isCore ? lastSL : level === 'HL' ? lastHL : lastSL;
	$: bulletinName = `${level} ${data.isLang ? `${language} ` : ''}${data.name}`;
	$: bulletinSession = Bulletin[bulletinName]?.grades?.find(
		(session) => session.short === selectedBoundary?.short
	);
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
	$: percentileLabel = percentile?.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 1
	});
	$: forecastLabels = data.isCore ? ['E', 'D', 'C', 'B', 'A'] : ['1', '2', '3', '4', '5', '6', '7'];
	$: forecastResults = level === 'HL' ? HLResults : SLResults;
	$: comparableForecastResults = forecastResults.filter(
		(result) => 2000 + Number(result.short?.slice(1, 3)) >= Number(syllabus.firstAssessment || 0)
	);
	$: boundaryForecast = buildBoundaryForecast({
		results: comparableForecastResults,
		targetYear: 2026,
		sessionPrefix: 'N',
		labels: forecastLabels
	});
	$: forecastProbability = calculateForecastProbabilities(boundaryForecast, grade);
	$: rankedForecastOutcomes = forecastProbability
		? forecastProbability.exact
				.map((chance, index) => ({
					grade: boundaryForecast.forecasts[index].grade,
					chance
				}))
				.sort((a, b) => b.chance - a.chance)
		: [];
	$: primaryForecastOutcome = rankedForecastOutcomes[0];
	$: secondaryForecastOutcome = rankedForecastOutcomes[1];
	const forecastChanceLabel = (chance) => {
		if (chance >= 0.995) return '>99%';
		if (chance > 0 && chance <= 0.005) return '<1%';
		return `${Math.round(chance * 100)}%`;
	};
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
			str = 'Using the ' + lastSL?.fullName + ' grade boundary';
		} else {
			if (level === 'HL') {
				mark = calculateNormalResults(grade, lastHL?.tz);
				gradeBoundaryUsed = {
					name: lastHL?.fullName,
					marks: lastHL?.tz
				};
				marksToIncrease = lastHL?.tz[mark] - grade;
				str = 'Using the ' + lastHL?.fullName + ' grade boundary';
			} else {
				mark = calculateNormalResults(grade, lastSL?.tz);
				gradeBoundaryUsed = {
					name: lastSL?.fullName,
					marks: lastSL?.tz
				};
				marksToIncrease = lastSL?.tz[mark] - grade;
				str = 'Using the ' + lastSL?.fullName + ' grade boundary';
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
				arr={HLoptions.map((tz) => tz.fullName)}
				arrVal={HLoptions}
				bind:value={lastHL}
			/>
		{:else}
			<ToggleSelect
				identifier="g"
				arr={SLoptions.map((tz) => tz.fullName)}
				arrVal={SLoptions}
				bind:value={lastSL}
			/>
		{/if}
	</div>
</div>

<div class="assessments">
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
				<div class="x">Predicted Mark</div>
				{#if mark === 'N/A'}
					<div class="no-result">N/A</div>
				{:else if data.isCore}
					<Meter value={gradeMap[mark]} totalSegments={5} isCore={data.isCore} />
				{:else}
					<Meter value={mark} />
				{/if}

				<div class="pp">{str}</div>
				{#if primaryForecastOutcome}
					<div class="forecast-summary" aria-live="polite">
						<div class="forecast-summary-label">November 2026 forecast · experimental</div>
						<div class="forecast-primary">
							<div>
								<strong>Grade {primaryForecastOutcome.grade}</strong><span>Most likely</span>
							</div>
							<div>
								<strong>{forecastChanceLabel(primaryForecastOutcome.chance)}</strong><span
									>Estimated likelihood</span
								>
							</div>
						</div>
						{#if secondaryForecastOutcome}
							<div class="forecast-secondary">
								{forecastChanceLabel(secondaryForecastOutcome.chance)} chance of Grade {secondaryForecastOutcome.grade}
							</div>
						{/if}
					</div>
				{/if}
				{#if percentile !== undefined}
					<div class="percentile-summary" aria-live="polite">
						<strong>{percentileLabel}%</strong>
						<span>
							Beats {percentileLabel}% of test takers
							<small>{bulletinSession.name} · lower final grades</small>
						</span>
					</div>
				{/if}
			</div>
			<div class="predicted">
				<div class="row">
					<div class="y">Grade</div>

					<div class="y">
						{grade}{!data.isCore ? '%' : ''}
					</div>
				</div>

				<div class="row">
					<div class="y">Points Away</div>
					{#if marksToIncrease}
						<div class="y">{marksToIncrease}{!data.isCore ? '%' : ''}</div>
					{:else}
						<div class="y">N/A</div>
					{/if}
				</div>
				<GradeBoundaryUsed
					{gradeBoundaryUsed}
					mark={data.isCore ? gradeMap[mark] : mark}
					maxScore={syllabus.name === 'Extended Essay'
						? 34
						: syllabus.name === 'Theory Of Knowledge'
						? 30
						: 100}
				/>
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

	.percentile-summary {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 6px;
		padding: 6px 8px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
		border-radius: 9px;
		background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));

		strong {
			color: var(--color-primary);
			font-size: 1rem;
		}

		span {
			display: flex;
			flex-direction: column;
			color: var(--color-text-main);
			font-size: 0.72rem;
			font-weight: 700;
		}

		small {
			color: var(--color-text-muted);
			font-size: 0.62rem;
			font-weight: 500;
		}
	}

	.forecast-summary {
		margin-top: 7px;
		padding: 8px 9px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
		border-radius: 9px;
		background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface));
	}

	.forecast-summary-label {
		color: var(--color-text-muted);
		font-size: 0.58rem;
		font-weight: 750;
		letter-spacing: 0.045em;
		text-transform: uppercase;
	}

	.forecast-primary {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 5px;

		div {
			display: flex;
			flex-direction: column;
		}

		strong {
			color: var(--color-primary);
			font-size: 1.05rem;
			line-height: 1.05;
		}

		span {
			color: var(--color-text-muted);
			font-size: 0.62rem;
		}
	}

	.forecast-secondary {
		margin-top: 5px;
		padding-top: 5px;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-main);
		font-size: 0.65rem;
		font-weight: 650;
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
