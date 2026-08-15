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
		<header class="strategy-header">
			<div>
				<span class="eyebrow">Grade strategy</span>
				<h3 id="strategy-title">What should I improve?</h3>
			</div>
			<p>See where each additional raw mark has the most effect.</p>
		</header>

		<div class="strategy-summary">
			{#if improvement}
				<article class="next-move">
					<span class="card-label">Fastest path to Grade {improvement.nextGrade}</span>
					{#if improvement.recommendation}
						<strong>{improvement.recommendation}</strong>
						<p>
							Raises the predicted result from Grade {improvement.currentGrade} to Grade
							{improvement.nextGrade} using the {selectedBoundary.fullName} boundary.
						</p>
					{:else}
						<strong>No single available improvement reaches the next grade.</strong>
						<p>The remaining assessment marks are not enough to cross this boundary.</p>
					{/if}
				</article>
			{:else if Number(currentGrade) === 7}
				<article class="next-move">
					<span class="card-label">Current position</span>
					<strong>You are already at Grade 7.</strong>
					<p>Use the safety margin below to see how secure that result has been historically.</p>
				</article>
			{/if}

			{#if confidence}
				<article class="confidence-card">
					<div class="confidence-topline">
						<div>
							<span class="card-label">Historical confidence</span>
							<strong
								>{confidence.label === 'Borderline' ? 'Borderline' : 'Likely'} Grade {currentGrade}</strong
							>
						</div>
						<div class:warning={confidence.label === 'Borderline'} class="confidence-value">
							{percent(confidence.confidence)}%
							<small>{confidence.label}</small>
						</div>
					</div>
					<p>
						Compared with {confidence.sampleSize} historical timezone {confidence.sampleSize === 1
							? 'result'
							: 'results'}.
					</p>
					{#if confidence.riseToDrop !== undefined && Number(currentGrade) > 1}
						<div class="risk-line">
							A boundary {confidence.riseToDrop}
							{confidence.riseToDrop === 1 ? 'mark' : 'marks'} higher would produce Grade {confidence.lowerGrade}.
						</div>
					{/if}
				</article>
			{/if}
		</div>

		{#if improvement?.options?.length}
			<div class="impact-section">
				<div class="section-heading">
					<div>
						<h4>Assessment impact</h4>
						<p>Compare the value of one additional raw mark.</p>
					</div>
					{#if improvement.pointsNeeded > 0}
						<span
							>{improvement.pointsNeeded} percentage {improvement.pointsNeeded === 1
								? 'point'
								: 'points'} to Grade {improvement.nextGrade}</span
						>
					{/if}
				</div>
				<div class="impact-list">
					{#each improvement.options as option}
						<div class:best={bestOption?.index === option.index} class="impact-row">
							<div class="assessment-name">
								<strong>{option.name}</strong>
								{#if bestOption?.index === option.index}<span>Best opportunity</span>{/if}
							</div>
							<div class="impact-stat">
								<strong>+{impactLabel(option.impact)} pts</strong>
								<span>per raw mark</span>
							</div>
							<div class="impact-stat target">
								{#if option.marksNeeded !== undefined}
									<strong>+{option.marksNeeded}</strong>
									<span>to Grade {improvement.nextGrade}</span>
								{:else}
									<strong>—</strong>
									<span>{option.remaining ? 'Not enough alone' : 'At maximum'}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if comparisons.length}
			<div class="history-section">
				<div class="section-heading">
					<div>
						<h4>Historical what-if</h4>
						<p>Your {currentScore}% mark under every comparable session.</p>
					</div>
				</div>
				<div class="comparison-grid">
					{#each comparisons as session}
						<div class:current={session.short === selectedBoundary?.short} class="session-result">
							<span>{session.short}</span>
							<strong>Grade {session.grade}</strong>
							<small>
								{session.minGrade === session.maxGrade
									? session.timezoneCount > 1
										? `Same across ${session.timezoneCount} timezones`
										: session.name
									: `Timezone range ${session.minGrade}–${session.maxGrade}`}
							</small>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<footer>
			Confidence reflects historical boundary agreement, not the probability of an exam result.
		</footer>
	</section>
{/if}

<style lang="scss">
	.strategy {
		margin-top: 24px;
		padding: 22px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		box-shadow: var(--shadow-sm);
	}

	.strategy-header,
	.section-heading,
	.confidence-topline {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
	}

	.strategy-header h3,
	.strategy-header p,
	.section-heading h4,
	.section-heading p,
	.next-move p,
	.confidence-card p {
		margin: 0;
	}

	.strategy-header h3 {
		margin-top: 3px;
		font-size: 1.35rem;
	}

	.strategy-header > p,
	.section-heading p,
	.confidence-card p,
	.next-move p {
		color: var(--color-text-muted);
		font-size: 0.78rem;
	}

	.eyebrow,
	.card-label {
		color: var(--color-primary);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.strategy-summary {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
		gap: 12px;
		margin-top: 18px;
	}

	.next-move,
	.confidence-card {
		padding: 16px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background: var(--color-surface-variant);
	}

	.next-move > strong,
	.confidence-card strong {
		display: block;
		margin: 5px 0;
		color: var(--color-text-main);
		font-size: 1.05rem;
	}

	.confidence-value {
		color: var(--color-primary);
		font-size: 1.45rem;
		font-weight: 850;
		line-height: 1;
		text-align: right;
	}

	.confidence-value.warning {
		color: #f59e0b;
	}

	.confidence-value small {
		display: block;
		margin-top: 3px;
		font-size: 0.62rem;
		font-weight: 750;
		text-transform: uppercase;
	}

	.risk-line {
		margin-top: 9px;
		padding-top: 9px;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-main);
		font-size: 0.75rem;
		font-weight: 700;
	}

	.impact-section,
	.history-section {
		margin-top: 18px;
		padding-top: 18px;
		border-top: 1px solid var(--color-border);
	}

	.section-heading h4 {
		font-size: 1rem;
	}

	.section-heading > span {
		color: var(--color-text-muted);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.impact-list {
		margin-top: 10px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		overflow: hidden;
	}

	.impact-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 130px 115px;
		align-items: center;
		gap: 14px;
		padding: 10px 12px;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.impact-row:last-child {
		border-bottom: 0;
	}

	.impact-row.best {
		background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));
	}

	.assessment-name,
	.impact-stat {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.assessment-name strong {
		overflow: hidden;
		color: var(--color-text-main);
		font-size: 0.8rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.assessment-name span {
		width: fit-content;
		margin-top: 3px;
		color: var(--color-primary);
		font-size: 0.6rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.impact-stat strong {
		color: var(--color-text-main);
		font-size: 0.85rem;
	}

	.impact-stat span {
		color: var(--color-text-muted);
		font-size: 0.65rem;
	}

	.target {
		text-align: right;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 10px;
	}

	.session-result {
		display: flex;
		flex-direction: column;
		padding: 10px;
		border: 1px solid var(--color-border);
		border-radius: 9px;
		background: var(--color-surface-variant);
	}

	.session-result.current {
		border-color: color-mix(in srgb, var(--color-primary) 55%, var(--color-border));
		background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
	}

	.session-result span {
		color: var(--color-text-muted);
		font-size: 0.65rem;
		font-weight: 800;
	}

	.session-result strong {
		margin: 2px 0;
		color: var(--color-text-main);
		font-size: 0.95rem;
	}

	.session-result small {
		color: var(--color-text-muted);
		font-size: 0.58rem;
		line-height: 1.25;
	}

	footer {
		margin-top: 12px;
		color: var(--color-text-muted);
		font-size: 0.62rem;
	}

	@media (max-width: 700px) {
		.strategy {
			padding: 14px;
		}

		.strategy-header,
		.section-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 5px;
		}

		.strategy-summary {
			grid-template-columns: 1fr;
		}

		.impact-row {
			grid-template-columns: minmax(0, 1fr) 92px;
		}

		.impact-stat.target {
			grid-column: 2;
		}

		.comparison-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
