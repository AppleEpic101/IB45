<script>
	import Bulletin from '$lib/data/bulletin.js';

	export let name;

	$: data = Bulletin[name]?.grades;
	const markbands = [1, 2, 3, 4, 5, 6, 7];
	let displayMode = 'percent';

	const displayDistribution = (percentage, total, mode) =>
		mode === 'percent'
			? percentage
			: Math.round((Number(percentage) / 100) * total).toLocaleString('en-US');
</script>

<div class="table-section">
	<div class="table-toolbar">
		<div>
			<strong>Distribution values</strong>
			<span>View each grade band as a percentage or candidate count.</span>
		</div>
		<div class="mode-switcher" aria-label="Distribution value format">
			<button
				type="button"
				class:active={displayMode === 'percent'}
				aria-pressed={displayMode === 'percent'}
				on:click={() => (displayMode = 'percent')}>Percentage (%)</button
			>
			<button
				type="button"
				class:active={displayMode === 'count'}
				aria-pressed={displayMode === 'count'}
				on:click={() => (displayMode = 'count')}>Candidates (#)</button
			>
		</div>
	</div>

	<div class="table-wrapper">
		<table>
			<tr>
				<th colspan="11">{name} Grade Distribution</th>
			</tr>
			<tr>
				<th rowspan="2">Exam Session</th>
				<th rowspan="2">Total Candidates</th>
				<th rowspan="2">Mean</th>
				<th colspan="8">Markband ({displayMode === 'percent' ? '%' : 'estimated #'})</th>
			</tr>

			<tr>
				<th>N</th>
				{#each markbands as markband}
					<th>{markband}</th>
				{/each}
			</tr>

			{#if data && data.length}
				{#each data as res}
					<tr>
						<td>{res.short}</td>
						<td>{res.total.toLocaleString('en-US')}</td>
						<td>{res.mean}</td>
						{#each res?.distribution as dist}
							<td>{displayDistribution(dist, res.total, displayMode)}</td>
						{/each}
					</tr>
				{/each}
			{:else}
				<tr><td colspan="11">No results found</td></tr>{/if}
		</table>
	</div>

	{#if displayMode === 'count'}
		<p class="estimate-note">
			Candidate counts are estimates calculated from the published percentages and may differ
			slightly because of rounding.
		</p>
	{/if}
</div>

<style>
	.table-section {
		width: 100%;
	}

	.table-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		max-width: 1100px;
		margin: 0 auto 12px;
	}

	.table-toolbar > div:first-child {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.table-toolbar strong {
		color: var(--color-text-main);
		font-size: 0.9rem;
	}

	.table-toolbar span,
	.estimate-note {
		color: var(--color-text-muted);
		font-size: 0.8rem;
	}

	.mode-switcher {
		display: inline-flex;
		flex-shrink: 0;
		gap: 3px;
		padding: 3px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface-variant);
	}

	.mode-switcher button {
		border: 0;
		border-radius: 7px;
		padding: 7px 10px;
		background: transparent;
		color: var(--color-text-muted);
		font: inherit;
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
	}

	.mode-switcher button.active {
		background: var(--color-surface);
		color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.mode-switcher button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.table-wrapper {
		display: flex;
		justify-content: center;
		overflow-x: auto;
		width: 100%;
		max-width: 100vw;
	}

	table {
		width: max-content;
		border-collapse: collapse;
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
	}

	th,
	td {
		border: 1px solid var(--color-border);
		text-align: center;
		padding: 8px;
		font-size: 14px;
		white-space: nowrap;
	}

	th[colspan='11'] {
		font-size: 16px;
	}

	.estimate-note {
		max-width: 1100px;
		margin: 10px auto 0;
	}

	@media (max-width: 700px) {
		.table-toolbar {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
