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
	export let selectedBoundary;
	export let results = [];
	export let firstAssessment;

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

	const percent = (value) =>
		Number(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
	const impactLabel = (value) =>
		Number(value).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
</script>

{#if confidence || improvement || comparisons.length}
	<section class="strategy" aria-labelledby="strategy-title">
		<div class="strategy-topline">
			<h3 id="strategy-title">Next grade</h3>
			{#if improvement}
				<span>Grade {improvement.currentGrade} → {improvement.nextGrade}</span>
			{:else}
				<span>Grade {currentGrade}</span>
			{/if}
		</div>

		<div class="strategy-summary">
			<div class="next-move">
				{#if improvement?.recommendation}
					<span>Best move</span>
					<strong>{improvement.recommendation}</strong>
				{:else if Number(currentGrade) === 7}
					<span>Current result</span>
					<strong>Grade 7 reached</strong>
				{:else}
					<span>Next grade</span>
					<strong>Not reachable with remaining marks</strong>
				{/if}
			</div>

			<div class="signals">
				{#if confidence}
					<div class:warning={confidence.label === 'Borderline'} class="signal">
						<strong>{percent(confidence.confidence)}%</strong>
						<span>{confidence.label} confidence</span>
					</div>
					{#if confidence.riseToDrop !== undefined && Number(currentGrade) > 1}
						<div class:warning={confidence.riseToDrop <= 2} class="signal">
							<strong
								>{confidence.riseToDrop} {confidence.riseToDrop === 1 ? 'mark' : 'marks'}</strong
							>
							<span>Safety margin</span>
						</div>
					{/if}
				{/if}
			</div>
		</div>

		{#if improvement?.options?.length}
			<details>
				<summary>
					<span>Compare assessments</span>
					<small>Impact of each raw mark</small>
				</summary>
				<div class="compact-table assessment-table" role="table" aria-label="Assessment impact">
					<div class="compact-row compact-header" role="row">
						<span role="columnheader">Assessment</span>
						<span role="columnheader">+1 mark</span>
						<span role="columnheader">To Grade {improvement.nextGrade}</span>
					</div>
					{#each improvement.options as option}
						<div class:best={bestOption?.index === option.index} class="compact-row" role="row">
							<strong role="cell">
								{option.name}
								{#if bestOption?.index === option.index}<small>Best</small>{/if}
							</strong>
							<span role="cell">+{impactLabel(option.impact)} pts</span>
							<span role="cell">
								{option.marksNeeded !== undefined ? `+${option.marksNeeded}` : '—'}
							</span>
						</div>
					{/each}
				</div>
			</details>
		{/if}

		{#if comparisons.length}
			<details>
				<summary>
					<span>Check past sessions</span>
					<small>{comparisons.length} sessions at {currentScore}%</small>
				</summary>
				<div class="compact-table history-table" role="table" aria-label="Historical what-if">
					<div class="compact-row compact-header" role="row">
						<span role="columnheader">Session</span>
						<span role="columnheader">Result</span>
						<span role="columnheader">Timezone range</span>
					</div>
					{#each comparisons as session}
						<div
							class:current={session.short === selectedBoundary?.short}
							class="compact-row"
							role="row"
						>
							<strong role="cell">{session.short}</strong>
							<span role="cell">Grade {session.grade}</span>
							<span role="cell">
								{session.minGrade === session.maxGrade
									? session.timezoneCount > 1
										? 'Same'
										: '—'
									: `${session.minGrade}–${session.maxGrade}`}
							</span>
						</div>
					{/each}
				</div>
			</details>
		{/if}
	</section>
{/if}

<style lang="scss">
	.strategy {
		margin-top: 18px;
		padding: 16px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		box-shadow: var(--shadow-sm);
	}

	.strategy-topline,
	.strategy-summary,
	.signals,
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.strategy-topline h3 {
		margin: 0;
		color: var(--color-text-main);
		font-size: 0.95rem;
	}

	.strategy-topline > span {
		padding: 4px 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface-variant));
		color: var(--color-primary);
		font-size: 0.7rem;
		font-weight: 800;
	}

	.strategy-summary {
		align-items: stretch;
		margin-top: 11px;
	}

	.next-move {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
		padding: 12px 14px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-variant));
	}

	.next-move span,
	.signal span,
	summary small {
		color: var(--color-text-muted);
		font-size: 0.65rem;
		font-weight: 650;
	}

	.next-move strong {
		margin-top: 2px;
		color: var(--color-text-main);
		font-size: 1rem;
	}

	.signals {
		align-items: stretch;
		gap: 7px;
	}

	.signal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 92px;
		padding: 9px 10px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface-variant);
	}

	.signal strong {
		color: var(--color-primary);
		font-size: 0.95rem;
	}

	.signal.warning strong {
		color: #f59e0b;
	}

	details {
		margin-top: 9px;
		border-top: 1px solid var(--color-border);
	}

	summary {
		padding: 10px 2px 1px;
		color: var(--color-text-main);
		font-size: 0.78rem;
		font-weight: 750;
		cursor: pointer;
	}

	summary::marker {
		color: var(--color-primary);
	}

	.compact-table {
		margin-top: 9px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow: hidden;
	}

	.compact-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 95px 95px;
		align-items: center;
		gap: 8px;
		min-height: 34px;
		padding: 5px 9px;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-main);
		font-size: 0.72rem;
	}

	.compact-row:last-child {
		border-bottom: 0;
	}

	.compact-header {
		min-height: 28px;
		background: var(--color-surface-variant);
		color: var(--color-text-muted);
		font-size: 0.62rem;
		font-weight: 750;
		text-transform: uppercase;
	}

	.compact-row > :nth-child(n + 2) {
		text-align: right;
	}

	.compact-row.best,
	.compact-row.current {
		background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));
	}

	.compact-row strong {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.compact-row strong small {
		margin-left: 5px;
		color: var(--color-primary);
		font-size: 0.55rem;
		text-transform: uppercase;
	}

	@media (max-width: 700px) {
		.strategy {
			padding: 13px;
		}

		.strategy-summary {
			align-items: stretch;
			flex-direction: column;
		}

		.signals {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.signal {
			min-width: 0;
		}

		.compact-row {
			grid-template-columns: minmax(0, 1fr) 70px 70px;
			padding-inline: 7px;
		}
	}
</style>
