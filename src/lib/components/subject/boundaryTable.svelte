<script>
	export let name;
	export let res;

	$: reversedRes = [...res].reverse();

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

<table>
	<tr>
		<th colspan="8">{name}</th>
	</tr>
	<tr>
		<th rowspan="2">Boundary*</th>
		<th colspan="7">Markband (≥)</th>
	</tr>
	<tr class="small">
		{#each { length: 7 } as _, i}
			<th>{i + 1}</th>
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
			<td><span class="sd">SD</span></td>
			{#each stdDevs as sd}
				<td><span class="sd">{sd}</span></td>
			{/each}
		</tr>
	{/if}

	{#each reversedRes as result}
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

<style>
	table,
	tr,
	th,
	td {
		border: 1px solid var(--color-border);
		border-collapse: collapse;
		text-align: center;
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
	}

	.average-row {
		background-color: var(--color-surface);
	}

	strong {
		color: var(--color-text-main);
	}

	.sd-row {
		background-color: var(--color-surface);
	}

	.sd {
		font-weight: bold;
		color: var(--color-text-main);
	}

	table {
		width: 100%;
		max-width: 280px;
		margin-bottom: 20px;
	}

	th,
	tr {
		padding: 10px;
	}

	@media screen and (max-width: 410px) {
		th,
		tr {
			padding: 5px;
		}
	}

	@media screen and (max-width: 320px) {
		table {
			max-width: 100%;
			font-size: x-small;
		}
	}

	@media screen and (max-width: 235px) {
		table {
			font-size: xx-small;
		}
	}
</style>
