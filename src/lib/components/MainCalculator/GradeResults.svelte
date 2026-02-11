<script>
	import SegmentedCircle from './SegmentedCircle.svelte';

	export let score;
	export let name;
	export let predictedGrade;
	export let isCore = false;
	export let isCondensed = false;
	export let maxScore = 100;
</script>

<div class="main">
	<div class="header">
		<div class="label">{name} Grade:</div>
		<div class="score-value">{score} / {maxScore}</div>
	</div>

	{#if predictedGrade}
		{#if isCondensed}
			<div class="awarded-container">
				<span class="label">Awarded Mark:</span>
				<span class="awarded-value">{predictedGrade}</span>
			</div>
		{:else}
			<div class="divider" />
			<div class="label">Awarded Mark:</div>
			<div class="circle-parent">
				<SegmentedCircle totalSegments={isCore ? 5 : 7} mark={predictedGrade} {isCore} />
			</div>
		{/if}
	{:else}
		<b class="not-found"><a href="/faq" target="_blank">Boundary Not Found</a></b>
	{/if}
</div>

<style lang="scss">
	.main {
		background-color: var(--color-surface-variant);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-sm);
		border-radius: var(--radius-lg);
		min-width: 200px;
		padding: 1rem;
		margin: 0 0.5rem 0.5rem 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		width: 100%;
	}

	.label {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		font-weight: 500;
		text-align: center;
	}

	.score-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-main);
	}

	.awarded-container {
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
	}

	.awarded-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.divider {
		width: 100%;
		height: 1px;
		background-color: var(--color-border);
		margin: 0.5rem 0;
	}

	.not-found {
		border-bottom: 1px dotted var(--color-text-main);
		cursor: pointer;
		margin-top: 1rem;
	}

	.circle-parent {
		margin-top: 0.5rem;
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
	}
</style>
