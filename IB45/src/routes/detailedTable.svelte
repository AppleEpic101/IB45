<script>
	export let points;
	export let courses;
	export let awardedMarks;
	export let tok;
	export let ee;
	export let HLCount;
	export let SLCount;
	let messages = [];
	let message = "";

	$: messages[0] = (HLCount + SLCount != 6) ? "Not enough subject choices. " : "";
	$: messages[1] = (HLCount != 3 || HLCount != 4) ? "You must have 3-4 HL subjects. " : "";

	$: message = messages.join("");

	$: console.log(messages);
</script>

<table>
	<tr>
		<th>Subject</th>
		<th>Awarded Mark</th>
	</tr>
	<tr>
		<th>Points</th>
		<th>{points} / 45</th>

	</tr>
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
	<tr>
		<td>TOK</td>
		<td>{tok}</td>
	</tr>
	<tr>
		<td>EE</td>
		<td />
	</tr>
</table>

<div class="notice">
	{message}
</div>

<style>
	table,
	tr,
	th,
	td {
		border: 2px solid black;
		text-align: center;
		width: 100%;
	}
	table {
		margin-top: 10px;
	}

	td {
		background-color: yellow;
	}
</style>
