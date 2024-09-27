<script>
	export let gradeData;

	import { selectedBoundaryId, selectedTimezone } from '$lib/stores/stores.js';

	const letterGrades = ['E', 'D', 'C', 'B', 'A'];
	const tokGradeWeights = [0, 1, 3, 5, 7];

	let diplomaAwarded;
	$: {
		diplomaAwarded = true;
		let gradesTally = [0, 0, 0, 0, 0, 0, 0];
		for (let i = 0; i < 6; i++) {
			gradesTally[gradeData[i].grade - 1] += 1;
		}

		let HLsum = 0;
		for (let i = 0; i < 6; i++) {
			if (gradeData[i].level != 'HL') {
				continue;
			}
			HLsum += gradeData[i].grade;
		}

		let SLsum = 0;
		for (let i = 0; i < 6; i++) {
			if (gradeData[i].level != 'SL') {
				continue;
			}
			SLsum += gradeData[i].grade;
		}

		if (HLcount + SLcount != 6) {
			console.log('Not 6 subjects');
			diplomaAwarded = false;
		} else if (totalPoints < 24) {
			console.log('Not enough points');
			diplomaAwarded = false;
		} else if (HLcount != 3 && HLcount != 4) {
			console.log('Not 3 or 4 HLs');
			diplomaAwarded = false;
		} else if (
			gradesTally[0] >= 1 ||
			gradesTally[1] >= 1 ||
			gradesTally[2] >= 2 ||
			gradesTally[3] >= 3
		) {
			console.log('Not enough high grades');
			diplomaAwarded = false;
		} else if (HLsum < 12) {
			console.log('Not enough HL points');
			diplomaAwarded = false;
		} else if (SLcount == 3 && SLsum < 9) {
			console.log('Not enough SL points');
			diplomaAwarded = false;
		} else if (SLcount == 2 && SLsum < 5) {
			console.log('Not enough SL points');
			diplomaAwarded = false;
		} else if (gradeData.tokGrade == 'E' || gradeData.eeGrade == 'E') {
			console.log('EE or TOK grade is E');
			diplomaAwarded = false;
		}
	}

	let totalPoints;
	$: {
		totalPoints = 0;
		for (let i = 0; i < 6; i++) {
			totalPoints += gradeData[i].grade || 0;
		}
		totalPoints += gradeData.coreGrade;
	}

	let HLcount;
	$: {
		HLcount = 0;
		for (let i = 0; i < 6; i++) {
			if (!gradeData[i].grade) {
				continue;
			}
			HLcount += gradeData[i].level == 'HL' && gradeData[i].grade ? 1 : 0;
		}
	}
	let SLcount;
	$: {
		SLcount = 0;
		for (let i = 0; i < 6; i++) {
			SLcount += gradeData[i].level == 'SL' && gradeData[i].grade ? 1 : 0;
		}
	}

	function getRowColor(mark) {
		const hue = (mark / 5) * 120;
		return `hsl(${hue}, 100%, 68%)`;
	}
</script>

<div class="main">
	<table>
		<tr>
			<th>Subject</th>
			<th>Awarded Mark</th>
		</tr>
		<tr>
			<td>Points</td>
			<td style="background-color: {getRowColor(parseInt(totalPoints) / 6.42)}"
				>{totalPoints} / 45</td
			>
		</tr>
		<tr>
			<td>Diploma Awarded?</td>
			{#if diplomaAwarded}
				<td style="background-color: {getRowColor(7)}">YES</td>
			{:else}
				<td style="background-color: {getRowColor(0)}">NO</td>
			{/if}
		</tr>
		{#each Array(6).fill(0) as _, i}
			<tr>
				<td>Group {i + 1}</td>
				<td style="background-color: {getRowColor(gradeData[i].grade || 0)}"
					>{gradeData[i].grade || 0}</td
				>
			</tr>
		{/each}
		<tr>
			<td>TOK</td>
			<td
				style="background-color: {getRowColor(
					tokGradeWeights[letterGrades.indexOf(gradeData.tokGrade)]
				)}"
			>
				{gradeData.tokGrade}
			</td>
		</tr>
		<tr>
			<td>EE</td>
			<td
				style="background-color: {getRowColor(
					tokGradeWeights[letterGrades.indexOf(gradeData.eeGrade)]
				)}"
			>
				{gradeData.eeGrade}
			</td>
		</tr>
		<tr>
			<td>Core Points</td>
			<td style="background-color: {getRowColor((parseInt(gradeData.coreGrade) * 7) / 3)}">
				{gradeData.coreGrade}
			</td>
		</tr>
	</table>

	<div class="additional-info">
		HL Count: {HLcount} <br />
		SL Count: {SLcount} <br />
		Boundary: {$selectedBoundaryId} <br />
		Timezone: {$selectedTimezone + 1}
	</div>
</div>

<style>
	.main {
		position: sticky;
		top: 80px;
		text-align: center;
	}

	table,
	tr,
	th,
	td {
		border: 2px solid black;
		border-collapse: collapse;
		background-color: var(--primary);
	}

	table {
		width: 100%;
	}

	th {
		height: 50px;
	}

	.additional-info {
		background-color: var(--primary);
		border: 2px solid black;
		border-top: 0;
	}
</style>
