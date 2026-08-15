<script>
	export let boundary = [];
	export let score;
	export let predictedGrade;
	export let session;

	$: marksToNext =
		predictedGrade && predictedGrade < boundary.length
			? Math.max(0, boundary[predictedGrade] - score)
			: null;
	$: safetyMargin = predictedGrade ? Math.max(0, score - boundary[predictedGrade - 1]) : null;
	$: bands = boundary.map((lower, index) => ({
		grade: index + 1,
		lower,
		upper: index === boundary.length - 1 ? 100 : boundary[index + 1] - 1
	}));
</script>

<div class="boundary-insight">
	<div class="boundary-heading">
		<div>
			<span class="eyebrow">Grade boundaries</span>
			<strong>{session}</strong>
		</div>
		{#if predictedGrade === boundary.length}
			<span class="position secure">Top grade reached</span>
		{:else if marksToNext !== null}
			<span class="position"
				>{marksToNext} {marksToNext === 1 ? 'mark' : 'marks'} to Grade {predictedGrade + 1}</span
			>
		{/if}
	</div>

	<div class="boundary-strip" aria-label={`Grade boundaries for ${session}`}>
		{#each bands as band}
			<div class:current={predictedGrade === band.grade} class="boundary-band">
				<span>Grade {band.grade}</span>
				<strong>{band.lower}–{band.upper}</strong>
			</div>
		{/each}
	</div>

	<div class="margin-row">
		<span>Your weighted score: <strong>{score}%</strong></span>
		{#if safetyMargin !== null}
			<span
				>{safetyMargin}
				{safetyMargin === 1 ? 'mark' : 'marks'} above the Grade {predictedGrade}
				boundary</span
			>
		{/if}
	</div>
</div>

<style>
	.boundary-insight {
		margin: 14px 0 18px;
		border-top: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		padding: 16px 0;
	}

	.boundary-heading,
	.margin-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.boundary-heading > div {
		display: grid;
		gap: 3px;
	}

	.eyebrow {
		color: var(--color-text-muted);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.boundary-heading strong {
		font-size: 0.88rem;
	}

	.position {
		color: var(--color-primary-dark);
		font-size: 0.82rem;
		font-weight: 700;
		text-align: right;
	}

	.position.secure {
		color: var(--color-success);
	}

	.boundary-strip {
		display: grid;
		grid-template-columns: repeat(7, minmax(76px, 1fr));
		gap: 4px;
		margin-top: 13px;
		overflow-x: auto;
		padding-bottom: 4px;
	}

	.boundary-band {
		display: grid;
		gap: 3px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 8px 7px;
		background: var(--color-surface-variant);
		text-align: center;
	}

	.boundary-band span {
		color: var(--color-text-muted);
		font-size: 0.67rem;
	}

	.boundary-band strong {
		font-size: 0.8rem;
		white-space: nowrap;
	}

	.boundary-band.current {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
	}

	.boundary-band.current span,
	.boundary-band.current strong {
		color: var(--color-primary-dark);
	}

	.margin-row {
		margin-top: 10px;
		color: var(--color-text-muted);
		font-size: 0.78rem;
	}

	.margin-row strong {
		color: var(--color-text-main);
	}

	@media (max-width: 620px) {
		.boundary-heading,
		.margin-row {
			align-items: flex-start;
			flex-direction: column;
			gap: 7px;
		}

		.position {
			text-align: left;
		}
	}
</style>
