<script>
	import {
		buildHistoricalComparisons,
		buildHistoricalConfidence,
		buildImprovementStrategy
	} from '$lib/utils/strategy.js';

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

			<div class:warning={confidence?.label === 'Borderline'} class="insight">
				<span>Confidence</span>
				{#if confidence}
					<strong>{number(confidence.confidence)}% {confidence.label}</strong>
					<small>{confidence.riseToDrop}-mark safety margin</small>
				{:else}
					<strong>Not enough history</strong>
				{/if}
			</div>

			<div class="insight">
				<span>Percentile</span>
				{#if percentile !== undefined}
					<strong>Beats {number(percentile)}%</strong>
					<small>of session candidates</small>
				{:else}
					<strong>Not published</strong>
					<small>for this session</small>
				{/if}
			</div>

			<div class="insight">
				<span>Past sessions</span>
				{#if comparisons.length}
					<strong>
						Grade {historicalMin}{historicalMin !== historicalMax ? `–${historicalMax}` : ''}
					</strong>
					<small>{comparisons.length} comparable sessions</small>
				{:else}
					<strong>No comparable data</strong>
				{/if}
			</div>
		</div>

		{#if improvement?.options?.length || comparisons.length}
			<details>
				<summary>Impact &amp; history</summary>
				<div class="details-grid">
					{#if improvement?.options?.length}
						<div class="compact-list">
							<h4>Assessment impact</h4>
							{#each improvement.options as option}
								<div class:best={option.index === bestOption?.index} class="compact-row">
									<span>{option.name}</span>
									<strong>+{number(option.impact, 2)} pts / mark</strong>
								</div>
							{/each}
						</div>
					{/if}

					{#if comparisons.length}
						<div class="compact-list">
							<h4>Your {currentScore}% historically</h4>
							{#each comparisons as comparison}
								<div class="compact-row">
									<span>{comparison.short}</span>
									<strong>
										Grade {comparison.minGrade}{comparison.minGrade !== comparison.maxGrade
											? `–${comparison.maxGrade}`
											: ''}
									</strong>
								</div>
							{/each}
						</div>
					{/if}
				</div>
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
		display: grid;
		grid-template-columns: repeat(4, minmax(112px, 1fr));
		align-items: stretch;
	}

	.insight {
		min-width: 0;
		padding: 10px;
		border-right: 1px solid var(--color-border);
	}

	.insight {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
	}

	.insight:last-child {
		border-right: 0;
	}

	.insight > span,
	.insight small {
		color: var(--color-text-muted);
		font-size: 0.64rem;
		line-height: 1.25;
	}

	.insight strong {
		overflow: hidden;
		color: var(--color-text-main);
		font-size: 0.78rem;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.insight.primary strong {
		color: var(--color-primary);
	}

	.insight.warning strong {
		color: #f59e0b;
	}

	details {
		border-top: 1px solid var(--color-border);
	}

	summary {
		padding: 8px 12px;
		color: var(--color-text-muted);
		font-size: 0.7rem;
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

	.compact-list h4 {
		margin: 5px 0 4px;
		font-size: 0.7rem;
	}

	.compact-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 5px 3px;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
		font-size: 0.68rem;
	}

	.compact-row span {
		overflow: hidden;
		color: var(--color-text-muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.compact-row strong {
		flex: none;
	}

	.compact-row.best strong {
		color: var(--color-primary);
	}

	@media (max-width: 760px) {
		.insight-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.insight {
			border-bottom: 1px solid var(--color-border);
		}

		.insight:nth-child(even) {
			border-right: 0;
		}

		.insight:nth-last-child(-n + 2) {
			border-bottom: 0;
		}

		.details-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
