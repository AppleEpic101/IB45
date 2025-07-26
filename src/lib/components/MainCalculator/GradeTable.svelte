<script>
	export let gradeData;

	import { selectedBoundaryId, selectedTimezone } from '$lib/stores/stores.js';

	const letterGrades = ['E', 'D', 'C', 'B', 'A'];
	const tokGradeWeights = [0, 1, 3, 5, 7];

	let diplomaAwarded;
	let message;
	$: {
		diplomaAwarded = true;
		let gradesTally = [0, 0, 0, 0, 0, 0, 0];
		for (let i = 0; i < 6; i++) {
			gradesTally[gradeData[i].grade - 1] += 1;
		}

		// only 3 highest HL grades count
		let HLgrades = [];
		for (let i = 0; i < 6; i++) {
			if (gradeData[i].level == 'HL') {
				HLgrades.push(gradeData[i].grade);
			}
		}
		HLgrades.sort((a, b) => b - a);
		let HLsum = HLgrades.slice(0, 3).reduce((sum, grade) => sum + grade, 0);

		let SLsum = 0;
		for (let i = 0; i < 6; i++) {
			if (gradeData[i].level != 'SL') {
				continue;
			}
			SLsum += gradeData[i].grade;
		}

		if (HLcount + SLcount != 6) {
			message = 'Fewer than 6 subjects selected';
			diplomaAwarded = false;
		} else if (totalPoints < 24) {
			message = 'Fewer than 24 total points';
			diplomaAwarded = false;
		} else if (HLcount != 3 && HLcount != 4) {
			message = '3 or 4 HLs not selected';
			diplomaAwarded = false;
		} else if (gradesTally[0] >= 1) {
			message = 'Grade 1s in any subject';
			diplomaAwarded = false;
		} else if (gradesTally[1] > 2) {
			message = 'More than two grade 2s in any subject';
			diplomaAwarded = false;
		} else if (gradesTally[2] > 3) {
			message = 'More than three grade 3s in any subject';
			diplomaAwarded = false;
		} else if (HLsum < 12) {
			if (HLcount == 3) {
				message = 'Fewer than 12 HL points';
			} else if (HLcount == 4) {
				message = 'Fewer than 12 HL points (Only the 3 highest HLs count)';
			}
			diplomaAwarded = false;
		} else if (SLcount == 3 && SLsum < 9) {
			message = 'Fewer than 9 SL points';
			diplomaAwarded = false;
		} else if (SLcount == 2 && SLsum < 5) {
			message = 'Fewer than 5 SL points';
			diplomaAwarded = false;
		} else if (gradeData.tokGrade == 'E' || gradeData.eeGrade == 'E') {
			message = 'E grade for TOK or EE';
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

	{#if !diplomaAwarded}
		<div class="additional-info">
			<div class="title">Failing Condition:</div>
			<div class="failing">{message}</div>
		</div>
	{/if}
	<div class="">
		HL Count: {HLcount} <br />
		SL Count: {SLcount} <br />
		Boundary: {$selectedBoundaryId} <br />
		Timezone: {$selectedTimezone + 1}
	</div>
</div>

<style lang="scss">
	.main {
		background-color: #e0f2fe;
		position: sticky;
		top: 80px;
		text-align: center;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	table,
	tr,
	th,
	td {
		border: 1px solid #d1d5db;
		border-collapse: collapse;
		background-color: #e0f2fe;
	}

	table {
		width: 100%;
	}

	th {
		height: 50px;
	}

	.additional-info {
		border-top: 0;
		margin: 10px;
		border: red 1px solid;

		.title {
			color: rgb(204, 43, 43);
			font-weight: bold;
			text-shadow: 0.2px 0.2px 0.2px black;
		}
		.failing {
			color: rgb(204, 43, 43);
			text-shadow: 0.2px 0.2px 0.2px black;
		}
	}

	.red {
		color: rgb(204, 43, 43);
		text-shadow: 0.2px 0.2px 0.2px black;
	}
</style>
