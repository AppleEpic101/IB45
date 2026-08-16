<script>
	export let gradeBoundaryUsed;
	export let mark;
	export let maxScore = 100;

	const gradeMap = {
		5: 'A',
		4: 'B',
		3: 'C',
		2: 'D',
		1: 'E'
	};

	// Reactive function to determine if a markband should be shaded
	$: shouldShade = (markbandIndex) => {
		return mark === markbandIndex + 1;
	};
</script>

<table style="table-layout: fixed; width: 100%;">
	<tr>
		<th colspan={gradeBoundaryUsed?.marks?.length} style="text-align: center;"
			>{gradeBoundaryUsed?.name ? gradeBoundaryUsed.name : ''} Markband</th
		>
	</tr>
	<tr class="small">
		{#each gradeBoundaryUsed?.marks ?? [] as boundary, i}
			{#if gradeBoundaryUsed?.marks?.length == 5}
				<th class:shaded={shouldShade(i)} title={`Starts at ${boundary}`}>{gradeMap[i + 1]}</th>
			{:else}
				<th class:shaded={shouldShade(i)} title={`Starts at ${boundary}`}>{i + 1}</th>
			{/if}
		{/each}
	</tr>

	{#if gradeBoundaryUsed?.marks}
		<tr class="small">
			{#each gradeBoundaryUsed.marks as tz, i}
				<td class:shaded={shouldShade(i)}>
					{tz}-{gradeBoundaryUsed.marks[i + 1] - 1 ? gradeBoundaryUsed.marks[i + 1] - 1 : maxScore}
				</td>
			{/each}
		</tr>
	{:else}
		<tr>
			<td colspan="7">No results found</td>
		</tr>
	{/if}
</table>

<style>
	table {
		width: 100%;
		margin-top: 20px;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid var(--color-border);
		text-align: center;
	}

	.small {
		font-size: 12px;
	}

	.shaded {
		background-color: #4a90e2;
		color: white;
		font-weight: bold;
	}
</style>
