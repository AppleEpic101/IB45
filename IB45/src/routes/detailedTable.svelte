<script>
	export let courses;
	export let awardedMarks;

	let defined = courses !== undefined && awardedMarks !== undefined;
</script>

<table>
	<tr>
		<th>Subject</th>
		<th>Awarded Mark</th>
	</tr>
	{#if defined}
		<tr>
			<td>Group 1</td>
			<td>{awardedMarks[0]}</td>
		</tr>
		<tr>
			<td>Group 2</td>
			<td>{awardedMarks[1]}</td>
		</tr>
		<tr>
			<td>Group 3</td>
			<td>{awardedMarks[2]}</td>
		</tr>
		<tr>
			<td>Group 4</td>
			<td>{awardedMarks[3]}</td>
		</tr>
		<tr>
			<td>Group 5</td>
			<td>{awardedMarks[4]}</td>
		</tr>
		<tr>
			<td>Group 6</td>
			<td>{awardedMarks[5]}</td>
		</tr>
	{/if}
</table>

<style>
	table,
	tr,
	th,
	td {
		border: 2px solid black;
		text-align: center;
	}
</style>
