<script>
	const letters = ['E', 'D', 'C', 'B', 'A'];
	export let name;
	export let res;
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
		{#each letters as i}
			<th>{i}</th>
		{/each}
	</tr>

	{#each res as result}
		<tr>
			<td>{result.name}</td>
			{#each result.tz as tz}
				<td>{tz}</td>
			{/each}
		</tr>
	{/each}
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
	table {
		width: 25vw;
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
