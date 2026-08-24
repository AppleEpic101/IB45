<script>
	import {
		buildHistoricalComparisons,
		buildHistoricalConfidence,
		buildImprovementStrategy
	} from '$lib/utils/strategy.js';
	import { formatApproximateShare } from '$lib/utils/standing.js';

	export let assessments = [];
	export let scores = [];
	export let currentScore;
	export let currentGrade;
	export let boundary = [];
	export let session = '';
	export let results = [];
	export let firstAssessment;
	export let percentile;

	$: selectedBoundary = { short: session, tz: boundary };
	$: improvement = buildImprovementStrategy({
		scores,
		assessments,
		currentScore,
		currentGrade,
		boundary: selectedBoundary
	});
	$: confidence = buildHistoricalConfidence({
		currentScore,
		currentGrade,
		selectedBoundary,
		results,
		firstAssessment
	});
	$: comparisons = buildHistoricalComparisons({ currentScore, results, firstAssessment });
	$: bestOption = improvement?.options
		?.filter(({ marksNeeded }) => marksNeeded !== undefined)
		.sort((a, b) => a.marksNeeded - b.marksNeeded || b.impact - a.impact)[0];
	$: historicalGrades = comparisons.flatMap(({ minGrade, maxGrade }) => [minGrade, maxGrade]);
	$: historicalMin = historicalGrades.length ? Math.min(...historicalGrades) : undefined;
	$: historicalMax = historicalGrades.length ? Math.max(...historicalGrades) : undefined;
	$: standingLabel =
		percentile !== undefined
			? `Ahead of ${formatApproximateShare(percentile)}`
			: 'Comparison unavailable';
	$: outlookLabel =
		Number(currentGrade) === 1
			? 'Minimum subject grade'
			: confidence?.label === 'Borderline'
			? 'Close to changing'
			: confidence?.label === 'Competitive'
			? 'Has varied before'
			: confidence
			? 'Historically consistent'
			: 'Not enough history';
	$: outlookExplanation =
		Number(currentGrade) === 1
			? 'There is no lower subject grade.'
			: confidence
			? confidence.riseToDrop === 1
				? `A boundary 1 mark higher would make this Grade ${confidence.lowerGrade}.`
				: `A boundary ${confidence.riseToDrop} marks higher would make this Grade ${confidence.lowerGrade}.`
			: 'More comparable sessions are needed.';

	const number = (value, digits = 1) =>
		Number(value).toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: digits
		});
</script>

{#if improvement || confidence || comparisons.length || percentile !== undefined}
	<section class="subject-insights" aria-label="Compact subject analysis">
		<div class="insight-grid">
			<div class="insight primary">
				<span>Best next move</span>
				{#if bestOption}
					<strong>+{bestOption.marksNeeded} {bestOption.name}</strong>
					<small>to Grade {improvement.nextGrade}</small>
				{:else if Number(currentGrade) === 7}
					<strong>Grade 7 reached</strong>
					<small>Top grade</small>
				{:else}
					<strong>No single shortcut</strong>
					<small>Combine assessments</small>
				{/if}
			</div>
		</div>

		{#if confidence || improvement?.options?.length || comparisons.length || percentile !== undefined}
			<details>
				<summary>Where you stand & more</summary>
				<div class="details-grid">
					{#if percentile !== undefined}
						<div class="plain-summary">
							<span>Compared with this session</span>
							<strong>{standingLabel}</strong>
							<p>Based on students' final grades.</p>
						</div>
					{/if}

					{#if confidence}
						<div class="plain-summary">
							<span>Grade outlook</span>
							<strong class:warning-text={confidence?.label === 'Borderline'}>{outlookLabel}</strong
							>
							<p>{outlookExplanation}</p>
						</div>
					{/if}

					{#if comparisons.length}
						<div class="plain-summary">
							<span>Your score in past sessions</span>
							<strong>
								Grade {historicalMin}{historicalMin !== historicalMax ? `–${historicalMax}` : ''}
							</strong>
							<p>Across {comparisons.length} comparable exam sessions.</p>
						</div>
					{/if}

					{#if improvement?.options?.length}
						<div class="compact-list">
							<h4>What each extra mark changes</h4>
							{#each improvement.options as option}
								<div class:best={option.index === bestOption?.index} class="compact-row">
									<span>{option.name}</span>
									<strong>+{number(option.impact, 2)}% overall</strong>
								</div>
							{/each}
						</div>
					{/if}

				</div>
				<a class="explain-link" href="/blog/understanding-your-ib-predict-results"
					>What do these results mean? <span aria-hidden="true">→</span></a
				>
			</details>
		{/if}
	</section>
{/if}

<style lang="scss">
	.subject-insights {
		margin: 10px 0 16px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: color-mix(in srgb, var(--color-surface-variant) 72%, var(--color-surface));
		overflow: hidden;
	}

	.insight-grid {
		display: block;
	}

	.insight {
		min-width: 0;
		padding: 10px;
	}

	.insight {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
	}

	.insight > span,
	.insight small {
		color: var(--color-text-muted);
		font-size: 0.74rem;
		line-height: 1.25;
	}

	.insight strong {
		overflow: hidden;
		color: var(--color-text-main);
		font-size: 0.9rem;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.insight.primary strong {
		color: var(--color-primary);
	}

	details {
		border-top: 1px solid var(--color-border);
	}

	summary {
		padding: 8px 12px;
		color: var(--color-text-muted);
		font-size: 0.8rem;
		font-weight: 750;
		cursor: pointer;
		list-style-position: inside;
	}

	summary:hover {
		color: var(--color-primary);
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		padding: 2px 12px 12px;
	}

	.compact-list {
		min-width: 0;
	}

	.plain-summary {
		display: grid;
		align-content: start;
		gap: 2px;
		padding: 8px 10px;
		border-radius: 8px;
		background: var(--color-surface-variant);
	}

	.plain-summary span,
	.plain-summary p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.76rem;
		line-height: 1.35;
	}

	.plain-summary strong {
		font-size: 0.94rem;
	}

	.warning-text {
		color: #f59e0b;
	}

	.compact-list h4 {
		margin: 5px 0 4px;
		font-size: 0.8rem;
	}

	.compact-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 5px 3px;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
		font-size: 0.78rem;
	}

	.compact-row span {
		overflow: hidden;
		color: var(--color-text-muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.explain-link {
		display: inline-flex;
		gap: 5px;
		margin: 0 12px 12px;
		color: var(--color-primary);
		font-size: 0.78rem;
		font-weight: 750;
		text-decoration: none;
	}

	.compact-row strong {
		flex: none;
	}

	.compact-row.best strong {
		color: var(--color-primary);
	}

	@media (max-width: 760px) {
		.details-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
