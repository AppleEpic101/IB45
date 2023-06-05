<script>
	export let points;
	export let awardedMarks;
	export let tok;
	export let ee;
	export let levels;
	export let corePoints;
	export let HLCount;
	export let SLCount;
	let messages = [];
	let message = '';

	let diplomaAwarded = true;

	$: messages[0] = HLCount != 3 && HLCount != 4 ? 'You must have 3-4 HL subjects. ' : '';
	$: messages[1] = points < 24 ? 'You must have at least 24 points. ' : ' ';

	$: message = messages.join('\n');

	const p = ['E', 'D', 'C', 'B', 'A'];
	const q = [0, 1, 3, 5, 7];

	$: {
		diplomaAwarded = true;
		if(HLCount + SLCount != 6) {
			console.log("6 subjects")
			diplomaAwarded = false;
		}
		if(parseInt(points) < 24) {
			console.log("points")
			diplomaAwarded = false;
		}
		if(ee == "E" || tok == "E") {
			console.log("gg")
			diplomaAwarded = false;
		}
		if(HLCount != 3 && HLCount != 4) {
			console.log("L")
			diplomaAwarded = false;
		}

		let oneCount = 0, twoCount = 0, threeCount = 0;
		let HLSum = 0, SLSum = 0;
		levels.forEach((arr, i) => {
			if(arr == "HL") HLSum += awardedMarks[i];
			else if (arr == "SL") SLSum += awardedMarks[i];
		});
		awardedMarks.forEach((arr) => {
			if(arr == 1) oneCount++;
			else if(arr == 2) twoCount++;
			else if(arr == 3) threeCount++;
		})

		if(oneCount > 1 || twoCount > 2 || threeCount > 3) {
			console.log("here1")
			diplomaAwarded = false;
		}

		if(HLCount == 3 && HLSum < 12) {
			console.log("here2")
			diplomaAwarded = false;
		}

		if(SLCount == 3 && SLSum < 9) {
			console.log("here3");
			diplomaAwarded = false;
		}

		if(SLCount == 2 && SLSum < 5) {
			console.log("here4")
			diplomaAwarded = false;
		}
	}

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
		<th style="background-color: {getRowColor(parseInt(points) / 6.42)}">{points} / 45</th>
	</tr>
	<tr>
		<th style="background-color: var(--primary)">Diploma Awarded?</th>
		{#if diplomaAwarded}
			<th style="background-color: {getRowColor(7)}">{diplomaAwarded}</th>
		{:else}
			<th style="background-color: {getRowColor(0)}">{diplomaAwarded}</th>
		{/if}
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
	<tr>
		<td style="background-color: var(--primary)">Core Points</td>
		<td style="background-color: {getRowColor((parseInt(corePoints) * 7) / 3)}">{corePoints}</td>
	</tr>
</table>
HL: {HLCount}
SL: {SLCount}

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
