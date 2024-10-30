<script>
	import ExcelJS from 'exceljs';
	import Dropdown from '$lib/components/dropdown.svelte';

	// Sample data
	export let name;
	export let level;
	export let language;
	export let firstAssessment;

	export let SLResults;
	export let HLResults;

	export let assessments;

	let boundary;

	let fullName;
	$: {
		fullName = `${level} ${language || ''} ${name} (${firstAssessment})`;
	}

	let results;
	$: {
		if (level === 'SL') {
			results = SLResults.slice().reverse();
		} else {
			results = HLResults.slice().reverse();
		}
	}
	$: console.log(boundary);

	// Function to create and download the Excel file
	async function downloadExcel() {
		const response = await fetch('/IB Predict.xlsx');
		const arrayBuffer = await response.arrayBuffer();
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(arrayBuffer);
		const worksheet = workbook.getWorksheet(1);

		// Preserve the style using ExcelJS
		worksheet.getCell('B1').value = fullName + ' Calculator';
		worksheet.getCell('L4:04').value = fullName + ' Assessment Details';
		worksheet.getCell('K11:L11').value = fullName + ' Grade Boundaries';

		worksheet.getCell('L5').value = assessments[0].name;
		worksheet.getCell('L6').value = assessments[0].maxMarks;
		worksheet.getCell('L7').value = assessments[0].weight;

		worksheet.getCell('M5').value = assessments[1].name;
		worksheet.getCell('M6').value = assessments[1].maxMarks;
		worksheet.getCell('M7').value = assessments[1].weight;

		worksheet.getCell('N5').value = assessments[2].name;
		worksheet.getCell('N6').value = assessments[2].maxMarks;
		worksheet.getCell('N7').value = assessments[2].weight;

		if (assessments.length > 3) {
			worksheet.getCell('O5').value = assessments[3].name;
			worksheet.getCell('O6').value = assessments[3].maxMarks;
			worksheet.getCell('O7').value = assessments[3].weight;
		}

		worksheet.getCell('L13').value = boundary[0];
		worksheet.getCell('L14').value = boundary[1];
		worksheet.getCell('L15').value = boundary[2];
		worksheet.getCell('L16').value = boundary[3];
		worksheet.getCell('L17').value = boundary[4];
		worksheet.getCell('L18').value = boundary[5];
		worksheet.getCell('L19').value = boundary[6];
		// Write the file using ExcelJS to preserve styles
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${fullName} (IB PREDICT) v1.0.xlsx`;
		link.click();
	}
</script>

<div class="container">
	<img src="/excel.png" width="25" />
	<div>Educators Predicted Grades Excel Tool</div>
	<div>
		<Dropdown
			arr={results.map((result) => result.fullName)}
			arrVal={results.map((result) => result.tz)}
			bind:value={boundary}
		/>
	</div>
	<button class="btn-sik hover" on:click={downloadExcel}>Download for {fullName}</button>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 2px solid black;
		padding: 10px;
	}
</style>
