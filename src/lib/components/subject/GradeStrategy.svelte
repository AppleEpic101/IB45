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
	$: outlookTitle =
		Number(currentGrade) === 1
			? 'This is the minimum subject grade'
			: confidence
			? confidence.label === 'Borderline'
				? 'This grade is close to changing'
				: confidence.label === 'Competitive'
				? 'This grade has varied before'
				: 'This grade has been consistent'
			: 'Not enough history yet';
	$: outlookExplanation =
		Number(currentGrade) === 1
			? 'There is no lower subject grade; focus on the next-grade plan.'
			: confidence
			? confidence.riseToDrop === 1
				? `A boundary 1 mark higher would make this Grade ${confidence.lowerGrade}.`
				: `A boundary ${confidence.riseToDrop} marks higher would make this Grade ${confidence.lowerGrade}.`
			: 'More comparable sessions are needed before showing a grade outlook.';

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
				{#if bestOption}
					<span>Best move</span>
					<strong
						>+{bestOption.marksNeeded}
						{bestOption.marksNeeded === 1 ? 'mark' : 'marks'} on
						{bestOption.name}</strong
					>
					<small>to reach Grade {improvement.nextGrade}</small>
				{:else if Number(currentGrade) === 7}
					<span>Current result</span>
					<strong>Grade 7 reached</strong>
				{:else if improvement?.reachesNextGrade}
					<span>Best move</span>
					<strong>Combine marks across assessments</strong>
					<small>Open the details for a possible route to Grade {improvement.nextGrade}</small>
				{:else}
					<span>Next grade</span>
					<strong>Not reachable with remaining marks</strong>
				{/if}
			</div>
		</div>

		{#if confidence || improvement?.options?.length || comparisons.length}
			<details class="planning-details">
				<summary>Grade outlook &amp; more options</summary>
				<div class="details-content">
					{#if confidence}
						<div class:warning={confidence?.label === 'Borderline'} class="outlook">
							<span>Grade outlook</span>
							<strong>{outlookTitle}</strong>
							<small>{outlookExplanation}</small>
						</div>
					{/if}

					{#if improvement?.options?.length}
						<section aria-labelledby="assessment-impact-title">
							<h4 id="assessment-impact-title">Compare assessments</h4>
							<div
								class="compact-table assessment-table"
								role="table"
								aria-label="Assessment impact"
							>
								<div class="compact-row compact-header" role="row">
									<span role="columnheader">Assessment</span>
									<span role="columnheader">+1 mark</span>
									<span role="columnheader">To Grade {improvement.nextGrade}</span>
								</div>
								{#each improvement.options as option}
									<div
										class:best={bestOption?.index === option.index}
										class="compact-row"
										role="row"
									>
										<strong role="cell">
											{option.name}
											{#if bestOption?.index === option.index}<small>Best</small>{/if}
										</strong>
										<span role="cell">+{impactLabel(option.impact)}% overall</span>
										<span role="cell">
											{option.marksNeeded !== undefined ? `+${option.marksNeeded}` : '—'}
										</span>
									</div>
								{/each}
							</div>
						</section>
					{/if}

					<a class="strategy-help" href="/blog/understanding-your-ib-predict-results"
						>How these recommendations work <span aria-hidden="true">→</span></a
					>
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
	.next-move small,
	.outlook span {
		color: var(--color-text-muted);
		font-size: 0.65rem;
		font-weight: 650;
	}

	.next-move strong {
		margin-top: 2px;
		color: var(--color-text-main);
		font-size: 1rem;
	}

	.next-move small {
		margin-top: 3px;
		line-height: 1.35;
	}

	.outlook {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		min-width: 0;
		grid-column: 1 / -1;
		padding: 10px 12px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface-variant);
	}

	.outlook strong {
		margin-top: 2px;
		color: var(--color-text-main);
		font-size: 0.85rem;
	}

	.outlook small {
		margin-top: 3px;
		color: var(--color-text-muted);
		font-size: 0.68rem;
		line-height: 1.35;
	}

	.outlook.warning strong {
		color: #f59e0b;
	}

	.planning-details {
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

	.details-content {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		padding-top: 8px;
	}

	.details-content section {
		min-width: 0;
	}

	.details-content h4 {
		margin: 0;
		color: var(--color-text-main);
		font-size: 0.72rem;
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

	.strategy-help {
		display: inline-flex;
		gap: 5px;
		grid-column: 1 / -1;
		margin: 0 2px 4px;
		color: var(--color-primary);
		font-size: 0.68rem;
		font-weight: 750;
		text-decoration: none;
	}

	.strategy-help:hover,
	.strategy-help:focus-visible {
		text-decoration: underline;
	}

	@media (max-width: 700px) {
		.strategy {
			padding: 13px;
		}

		.strategy-summary {
			align-items: stretch;
			flex-direction: column;
		}

		.details-content {
			grid-template-columns: 1fr;
		}

		.compact-row {
			grid-template-columns: minmax(0, 1fr) 70px 70px;
			padding-inline: 7px;
		}
	}
</style>
