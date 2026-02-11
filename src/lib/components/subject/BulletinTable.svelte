<script>
	import Bulletin from '$lib/assets/Bulletin.json';

	export let name;

	$: data = Bulletin[name]?.grades;
</script>

<div class="table-wrapper">
	<table>
		<tr>
			<th colspan="11">{name} Grade Distribution</th>
		</tr>
		<tr>
			<th rowspan="2">Exam Session</th>
			<th rowspan="2">Total Candidates</th>
			<th rowspan="2">Mean</th>
			<th colspan="8">Markband (%)</th>
		</tr>

		<tr>
			<th>N</th>
			{#each { length: 7 } as _, i}
				<th>{i + 1}</th>
			{/each}
		</tr>

		{#if data && data.length}
			{#each data as res}
				<tr>
					<td>{res.short}</td>
					<td>{res.total.toLocaleString('en-US')}</td>
					<td>{res.mean}</td>
					{#each res?.distribution as dist, i}
						<td>{dist}</td>
					{/each}
				</tr>
			{/each}
		{:else}
			<tr><td colspan="11">No results found</td></tr>{/if}
	</table>
</div>

<style>
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
</style>
