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
		<th colspan="7">Markband</th>
	</tr>
	<tr class="small">
		{#each { length: 7 } as _, i}
			<th>{i + 1}</th>
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
		background-color: var(--lightprimary);
	}
	table {
		width: 25vw;
		margin-bottom: 20px;
	}

	th,
	tr {
		padding: 10px;
	}
</style>
