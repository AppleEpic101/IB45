<script>
	export let name;
	export let res;
	const grades = [1, 2, 3, 4, 5, 6, 7];
	const previewCount = 5;
	let expanded = false;
	let showStats = false;

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
			<colgroup>
				<col class="session-column" />
				<col class="grade-column" />
				<col class="grade-column" />
				<col class="grade-column" />
				<col class="grade-column" />
				<col class="grade-column" />
				<col class="grade-column" />
				<col class="grade-column" />
			</colgroup>
			<tr class="title-row">
				<th colspan="8">{name}</th>
			</tr>
			<tr>
				<th rowspan="2"
					><span class="desktop-text">Exam session</span><span class="mobile-text">Session</span
					></th
				>
				<th colspan="7"
					><span class="desktop-text">Minimum mark for grade</span><span class="mobile-text"
						>Minimum mark</span
					></th
				>
			</tr>
			<tr class="small">
				{#each grades as grade}
					<th>{grade}</th>
				{/each}
			</tr>

			{#if showStats && averages.length > 0}
				<tr class="average-row">
					<td
						><strong
							><span class="desktop-text">Average</span><span class="mobile-text">Avg</span></strong
						></td
					>
					{#each averages as avg}
						<td><strong>{avg}</strong></td>
					{/each}
				</tr>
				<tr class="sd-row">
					<td
						><span class="sd"
							><span class="desktop-text">Standard deviation</span><span class="mobile-text"
								>SD</span
							></span
						></td
					>
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
	{#if reversedRes.length}
		<div class="table-footer">
			<span>
				{expanded
					? `Showing all ${reversedRes.length} timezone records`
					: `Showing the latest ${Math.min(previewCount, reversedRes.length)} of ${
							reversedRes.length
					  } timezone records`}
			</span>
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
		max-width: 900px;
		margin: 0 auto;
	}

	.table-scroll {
		overflow-x: auto;
		width: 100%;
		border: 1px solid var(--color-border);
		border-radius: 12px;
	}

	.mobile-text {
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

	@media screen and (max-width: 600px) {
		.table-scroll {
			overflow: hidden;
			border-radius: 9px;
		}

		table {
			width: 100%;
			min-width: 0;
			table-layout: fixed;
		}

		.session-column {
			width: 24%;
		}

		.grade-column {
			width: 10.85%;
		}

		th,
		td {
			min-width: 0;
			padding: 5px 2px;
			font-size: clamp(0.55rem, 2.3vw, 0.68rem);
			white-space: nowrap;
			overflow: hidden;
		}

		.title-row th {
			padding: 7px 5px;
			font-size: 0.72rem;
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
