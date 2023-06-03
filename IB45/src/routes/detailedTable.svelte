<script>
	export let points;
	export let awardedMarks;
	export let tok;
	export let ee;
	export let HLCount;
	export let SLCount;
	let messages = [];
	let message = '';

	$: messages[0] = HLCount + SLCount != 6 ? 'Not enough subject choices. ' : '';
	$: messages[1] = HLCount != 3 || HLCount != 4 ? 'You must have 3-4 HL subjects. ' : '';

	$: message = messages.join('');

	$: console.log(messages);
	const p = ['E', 'D', 'C', 'B', 'A'];
	const q = [0, 1, 3, 5, 7];

	function getRowColor(mark) {
		const hue = (mark / 5) * 120;
		return `hsl(${hue}, 100%, 50%)`;
	}
</script>

<table>
	<tr style="background-color: var(--primary)">
		<th>Subject</th>
		<th>Awarded Mark</th>
	</tr>
	<tr>
		<th style="background-color: var(--primary)">Points</th>
		<th style="background-color: {points ? getRowColor(parseInt(points) / 6.42) : 0}"
			>{points} / 45</th
		>
	</tr>
	{#each awardedMarks as mark, i}
		<tr>
			<td style="background-color: var(--primary)">Group {i + 1}</td>
			<td style="background-color: {getRowColor(mark)}">{mark}</td>
		</tr>
	{/each}
	<tr>
		<td style="background-color: var(--primary)">TOK</td>
		<td style="background-color: {tok ? getRowColor(q[p.indexOf(tok)]) : 0}">{tok}</td>
	</tr>
	<tr>
		<td style="background-color: var(--primary)">EE</td>
		<td style="background-color: {ee ? getRowColor(q[p.indexOf(ee)]) : 0}">{ee}</td>
	</tr>
</table>

<div class="notice">
	{message}
</div>

<link rel="stylesheet" href="light.css" />

<style>
	table,
	tr,
	th,
	td {
		border: 2px solid black;
		border-collapse: collapse;
		text-align: center;
		width: 100%;
	}
	table {
		margin-top: 10px;
	}
</style>
