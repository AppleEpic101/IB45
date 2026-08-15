<script>
	export let name;
	export let res;
	const grades = [1, 2, 3, 4, 5, 6, 7];
	const previewCount = 5;
	let expanded = false;

	$: reversedRes = [...res].reverse();
	$: visibleResults = expanded ? reversedRes : reversedRes.slice(0, previewCount);

	$: averages =
		res.length > 0
			? Array.from({ length: 7 }, (_, i) => {
					const validMarks = res.map((r) => r.tz[i]).filter((m) => m !== undefined && m !== null);
					if (validMarks.length === 0) return '-';
					const sum = validMarks.reduce((acc, curr) => acc + curr, 0);
					return (sum / validMarks.length).toFixed(1);
			  })
			: [];

	$: stdDevs =
		res.length > 0
			? Array.from({ length: 7 }, (_, i) => {
					const validMarks = res.map((r) => r.tz[i]).filter((m) => m !== undefined && m !== null);
					if (validMarks.length < 2) return '-';
					const avg = validMarks.reduce((acc, curr) => acc + curr, 0) / validMarks.length;
					const squareDiffs = validMarks.map((m) => Math.pow(m - avg, 2));
					const avgSquareDiff =
						squareDiffs.reduce((acc, curr) => acc + curr, 0) / validMarks.length;
					return Math.sqrt(avgSquareDiff).toFixed(1);
			  })
			: [];
</script>

<div class="boundary-table">
	<div class="table-scroll">
		<table>
			<tr class="title-row">
				<th colspan="8">{name}</th>
			</tr>
			<tr>
				<th rowspan="2">Exam session</th>
				<th colspan="7">Minimum mark for grade</th>
			</tr>
			<tr class="small">
				{#each grades as grade}
					<th>{grade}</th>
				{/each}
			</tr>

			{#if averages.length > 0}
				<tr class="average-row">
					<td><strong>Average</strong></td>
					{#each averages as avg}
						<td><strong>{avg}</strong></td>
					{/each}
				</tr>
				<tr class="sd-row">
					<td><span class="sd">Standard deviation</span></td>
					{#each stdDevs as sd}
						<td><span class="sd">{sd}</span></td>
					{/each}
				</tr>
			{/if}

			{#each visibleResults as result}
				<tr>
					<td>{result.fullName}</td>
					{#each result.tz as tz}
						<td>{tz}</td>
					{/each}
				</tr>
			{/each}
			{#if res.length === 0}
				<tr>
					<td colspan="8">No results found</td>
				</tr>
			{/if}
		</table>
	</div>
	<div class="mobile-boundaries" aria-label={`${name} boundary history`}>
		<h6>{name}</h6>
		{#if averages.length > 0}
			<article class="boundary-card average-card">
				<strong>Average</strong>
				<div class="grade-grid">
					{#each averages as avg, index}
						<div><span>Grade {grades[index]}</span><strong>{avg}</strong></div>
					{/each}
				</div>
			</article>
			<article class="boundary-card sd-card">
				<strong>Standard deviation</strong>
				<div class="grade-grid">
					{#each stdDevs as sd, index}
						<div><span>Grade {grades[index]}</span><strong>{sd}</strong></div>
					{/each}
				</div>
			</article>
		{/if}
		{#each visibleResults as result}
			<article class="boundary-card">
				<strong>{result.fullName}</strong>
				<div class="grade-grid">
					{#each result.tz as boundary, index}
						<div><span>Grade {grades[index]}</span><strong>{boundary}</strong></div>
					{/each}
				</div>
			</article>
		{/each}
		{#if res.length === 0}<p>No results found</p>{/if}
	</div>
	{#if reversedRes.length > previewCount}
		<div class="table-footer">
			<span>
				{expanded
					? `Showing all ${reversedRes.length} timezone records`
					: `Showing the latest ${previewCount} of ${reversedRes.length} timezone records`}
			</span>
			<button type="button" aria-expanded={expanded} on:click={() => (expanded = !expanded)}>
				{expanded ? 'Show recent only' : 'Show all sessions'}
			</button>
		</div>
	{/if}
</div>

<style>
	.boundary-table {
		width: 100%;
	}

	.table-scroll {
		overflow-x: auto;
		width: 100%;
		border: 1px solid var(--color-border);
		border-radius: 12px;
	}

	.mobile-boundaries {
		display: none;
	}

	table {
		width: 100%;
		min-width: 680px;
		border-collapse: collapse;
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
	}

	th,
	td {
		border: 1px solid var(--color-border);
		text-align: center;
		padding: 8px 12px;
	}

	th {
		background: color-mix(in srgb, var(--color-surface-variant) 88%, var(--color-primary));
		font-size: 0.78rem;
	}

	.title-row th {
		padding: 11px 12px;
		background: var(--color-surface-variant);
		font-size: 1rem;
	}

	td:first-child {
		min-width: 145px;
		font-weight: 650;
		text-align: left;
	}

	.average-row td {
		background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
		color: var(--color-text-main);
	}

	.sd-row td {
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
		color: var(--color-text-muted);
	}

	.sd {
		font-weight: 650;
	}

	tbody tr:nth-child(even):not(.average-row):not(.sd-row) td {
		background: color-mix(in srgb, var(--color-surface-variant) 94%, var(--color-text-main));
	}

	.table-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 2px 0;
		color: var(--color-text-muted);
		font-size: 0.72rem;
	}

	.table-footer button {
		padding: 6px 9px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface-variant);
		color: var(--color-text-main);
		font: inherit;
		font-weight: 750;
		cursor: pointer;
	}

	.table-footer button:hover,
	.table-footer button:focus-visible {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	@media screen and (max-width: 600px) {
		.table-scroll {
			display: none;
		}

		.mobile-boundaries {
			display: grid;
			gap: 9px;
		}

		.mobile-boundaries h6 {
			margin: 0 0 2px;
			color: var(--color-text-main);
			font-size: 0.9rem;
		}

		.boundary-card {
			overflow: hidden;
			border: 1px solid var(--color-border);
			border-radius: 10px;
			background: var(--color-surface-variant);
		}

		.boundary-card > strong {
			display: block;
			padding: 8px 10px;
			border-bottom: 1px solid var(--color-border);
			color: var(--color-text-main);
			font-size: 0.8rem;
		}

		.grade-grid {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.grade-grid > div {
			display: flex;
			flex-direction: column;
			gap: 2px;
			padding: 7px 9px;
			border-right: 1px solid var(--color-border);
			border-bottom: 1px solid var(--color-border);
		}

		.grade-grid span {
			color: var(--color-text-muted);
			font-size: 0.58rem;
		}

		.grade-grid strong {
			color: var(--color-text-main);
			font-size: 0.8rem;
		}

		.average-card {
			background: color-mix(in srgb, var(--color-primary) 11%, var(--color-surface));
		}

		.sd-card {
			background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
		}

		.table-footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
