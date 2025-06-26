<script>
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
		{#each { length: 7 } as _, i}
			<th>{i + 1}</th>
		{/each}
	</tr>

	{#each res as result}
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
		border: 2px solid black;
		border-collapse: collapse;
		text-align: center;
		background-color: var(--primary);
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
