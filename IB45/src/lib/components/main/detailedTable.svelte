<script>
	import {
		gradeBoundary,
		timezone,
		group1,
		group2,
		group3,
		group4,
		group5,
		group6
	} from '$lib/stores/store.js';
	export let points;
	export let awardedMarks;
	export let tok;
	export let ee;
	export let corePoints;

	let data = [];
	const levels = [];
	$: {
		data = [$group1, $group2, $group3, $group4, $group5, $group6];
		data.forEach((item, i) => {
			if (JSON.parse(item)) levels[i] = JSON.parse(item).level;
		});
	}

	let HLCount, SLCount;
	$: {
		HLCount = SLCount = 0;
		levels.forEach((item) => {
			item == 'HL' ? HLCount++ : item == 'SL' && SLCount++;
		});
	}

	const p = ['E', 'D', 'C', 'B', 'A'];
	const q = [0, 1, 3, 5, 7];

	let diplomaAwarded;
	$: {
		diplomaAwarded = true;
		if (HLCount + SLCount != 6) {
			diplomaAwarded = false;
		}
		if (parseInt(points) < 24) {
			diplomaAwarded = false;
		}
		if (ee == 'E' || tok == 'E') {
			diplomaAwarded = false;
		}
		if (HLCount != 3 && HLCount != 4) {
			diplomaAwarded = false;
		}

		let zeroCount, oneCount, twoCount, threeCount, HLSum, SLSum;
		zeroCount = oneCount = twoCount = threeCount = HLSum = SLSum = 0;
		HLSum = SLSum = 0;
		levels.forEach((arr, i) => {
			if (arr == 'HL') HLSum += awardedMarks[i];
			else if (arr == 'SL') SLSum += awardedMarks[i];
		});
		awardedMarks.forEach((arr) => {
			if (arr == 1) oneCount++;
			else if (arr == 0) zeroCount++;
			else if (arr == 2) twoCount++;
			else if (arr == 3) threeCount++;
		});

		if (zeroCount >= 1 || oneCount >= 1 || twoCount > 2 || threeCount > 3) {
			diplomaAwarded = false;
		}

		if (HLSum < 12) {
			diplomaAwarded = false;
		}

		if (SLCount == 3 && SLSum < 9) {
			diplomaAwarded = false;
		}

		if (SLCount == 2 && SLSum < 5) {
			diplomaAwarded = false;
		}
	}

	function getRowColor(mark) {
		const hue = (mark / 5) * 120;
		return `hsl(${hue}, 100%, 68%)`;
	}
</script>

<table>
	<tr>
		<th>Subject</th>
		<th>Awarded Mark</th>
	</tr>
	<tr>
		<td>Points</td>
		<td style="background-color: {getRowColor(parseInt(points) / 6.42)}">{points} / 45</td>
	</tr>
	<tr>
		<td>Diploma Awarded?</td>
		{#if diplomaAwarded}
			<td style="background-color: {getRowColor(7)}">YES</td>
		{:else}
			<td style="background-color: {getRowColor(0)}">NO</td>
		{/if}
	</tr>
	{#each awardedMarks as mark, i}
		<tr>
			<td>Group {i + 1}</td>
			<td style="background-color: {getRowColor(mark)}">{mark}</td>
		</tr>
	{/each}
	<tr>
		<td>TOK</td>
		<td style="background-color: {tok ? getRowColor(q[p.indexOf(tok)]) : 0}">{tok}</td>
	</tr>
	<tr>
		<td>EE</td>
		<td style="background-color: {ee ? getRowColor(q[p.indexOf(ee)]) : 0}">{ee}</td>
	</tr>
	<tr>
		<td>Core Points</td>
		<td style="background-color: {getRowColor((parseInt(corePoints) * 7) / 3)}">{corePoints}</td>
	</tr>
</table>

<div class="box">
	HLCount: {HLCount} <br />
	SLCount: {SLCount} <br />
	Boundary: {$gradeBoundary} <br />
	Timezone: {$timezone}
</div>

<div class="notice" />

<style>
	table,
	tr,
	th,
	td {
		border: 2px solid black;
		border-collapse: collapse;
		text-align: center;
		width: 100%;
		background-color: var(--lightprimary);
	}
	table {
		margin-top: 10px;
	}

	th {
		height: 50px;
	}

	.box {
		border: 2px solid black;
		border-top: 0;
		margin-top: 0px;
		background-color: var(--lightprimary);
		text-align: center;
	}
</style>
