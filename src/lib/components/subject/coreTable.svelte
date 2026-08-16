<script>
	const letters = ['E', 'D', 'C', 'B', 'A'];
	const previewCount = 5;
	export let name;
	export let res;

	let expanded = false;
	let showStats = false;
	$: reversedRes = [...res].reverse();
	$: visibleResults = expanded ? reversedRes : reversedRes.slice(0, previewCount);

	$: averages =
		res.length > 0
			? Array.from({ length: 5 }, (_, i) => {
					const validMarks = res.map((r) => r.tz[i]).filter((m) => m !== undefined && m !== null);
					if (validMarks.length === 0) return '-';
					const sum = validMarks.reduce((acc, curr) => acc + curr, 0);
					return (sum / validMarks.length).toFixed(1);
			  })
			: [];

	$: stdDevs =
		res.length > 0
			? Array.from({ length: 5 }, (_, i) => {
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
			<colgroup>
				<col class="session-column" />
				{#each letters as letter}<col class="grade-column" data-label={letter} />{/each}
			</colgroup>
			<thead>
				<tr class="title-row"><th colspan="6">{name} boundary history</th></tr>
				<tr>
					<th rowspan="2"
						><span class="desktop-text">Exam session</span><span class="mobile-text">Session</span
						></th
					>
					<th colspan="5"
						><span class="desktop-text">Minimum mark for grade</span><span class="mobile-text"
							>Minimum mark</span
						></th
					>
				</tr>
				<tr class="small">
					{#each letters as letter}<th>{letter}</th>{/each}
				</tr>
			</thead>
			<tbody>
				{#if showStats && averages.length > 0}
					<tr class="average-row">
						<td
							><strong
								><span class="desktop-text">Average</span><span class="mobile-text">Avg</span
								></strong
							></td
						>
						{#each averages as average}<td><strong>{average}</strong></td>{/each}
					</tr>
					<tr class="sd-row">
						<td
							><span class="desktop-text">Standard deviation</span><span class="mobile-text"
								>SD</span
							></td
						>
						{#each stdDevs as deviation}<td>{deviation}</td>{/each}
					</tr>
				{/if}

				{#each visibleResults as result}
					<tr>
						<td>{result.fullName || result.name}</td>
						{#each result.tz as boundary}<td>{boundary}</td>{/each}
					</tr>
				{/each}
				{#if res.length === 0}<tr><td colspan="6">No results found</td></tr>{/if}
			</tbody>
		</table>
	</div>

	{#if reversedRes.length}
		<div class="table-footer">
			<span
				>{expanded
					? `Showing all ${reversedRes.length} sessions`
					: `Showing the latest ${Math.min(previewCount, reversedRes.length)} of ${
							reversedRes.length
					  } sessions`}</span
			>
			<div class="footer-actions">
				{#if showStats}
					<a href="/blog/understanding-your-ib-predict-results">What do averages mean?</a>
				{/if}
				<button type="button" aria-expanded={showStats} on:click={() => (showStats = !showStats)}>
					{showStats ? 'Hide averages' : 'Show averages'}
				</button>
				{#if reversedRes.length > previewCount}
					<button type="button" aria-expanded={expanded} on:click={() => (expanded = !expanded)}>
						{expanded ? 'Show recent only' : 'Show all sessions'}
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.boundary-table {
		width: 100%;
	}
	.table-scroll {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: 12px;
	}
	table {
		width: 100%;
		min-width: 600px;
		border-collapse: collapse;
		background: var(--color-surface-variant);
		color: var(--color-text-main);
	}
	th,
	td {
		padding: 8px 12px;
		border: 1px solid var(--color-border);
		text-align: center;
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
		min-width: 150px;
		font-weight: 650;
		text-align: left;
	}
	.average-row td {
		background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
	}
	.sd-row td {
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
		color: var(--color-text-muted);
		font-weight: 650;
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
	.footer-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.footer-actions a {
		align-self: center;
		color: var(--color-primary);
		font-weight: 750;
		text-decoration: none;
	}
	.footer-actions a:hover,
	.footer-actions a:focus-visible {
		text-decoration: underline;
	}
	.mobile-text {
		display: none;
	}

	@media screen and (max-width: 600px) {
		.table-scroll {
			overflow: hidden;
			border-radius: 9px;
		}
		table {
			min-width: 0;
			table-layout: fixed;
		}
		.session-column {
			width: 29%;
		}
		.grade-column {
			width: 14.2%;
		}
		th,
		td {
			min-width: 0;
			padding: 5px 2px;
			font-size: clamp(0.58rem, 2.5vw, 0.7rem);
			white-space: nowrap;
			overflow: hidden;
		}
		.title-row th {
			padding: 7px 5px;
			font-size: 0.74rem;
			white-space: normal;
		}
		td:first-child {
			min-width: 0;
			text-align: center;
		}
		.desktop-text {
			display: none;
		}
		.mobile-text {
			display: inline;
		}
		.table-footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
