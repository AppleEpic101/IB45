<script>
	import Group from '$lib/components/MainCalculator/Group.svelte';
	import Core from '$lib/components/MainCalculator/Core.svelte';
	import GradeTable from '$lib/components/MainCalculator/GradeTable.svelte';

	let subjectGrades = {
		0: {},
		1: {},
		2: {},
		3: {},
		4: {},
		5: {},
		tokGrade: 'E',
		eeGrade: 'E',
		coreGrade: 0
	};
	let subjectSummaries = Array.from({ length: 6 }, () => ({}));
	let tokComplete = true;
	let eeComplete = true;
</script>

<div class="mobile-table">
	<GradeTable
		gradeData={subjectGrades}
		summaries={subjectSummaries}
		coreComplete={tokComplete && eeComplete}
	/>
</div>

<div class="main">
	<div class="left-column">
		{#each [0, 1, 2, 3, 4, 5] as i}
			<Group
				group={i}
				bind:predictedGrade={subjectGrades[i].grade}
				bind:level={subjectGrades[i].level}
				bind:summary={subjectSummaries[i]}
			/>
		{/each}
		<Core
			bind:tokGrade={subjectGrades.tokGrade}
			bind:eeGrade={subjectGrades.eeGrade}
			bind:coreGrade={subjectGrades.coreGrade}
			bind:tokComplete
			bind:eeComplete
		/>
	</div>
	<div class="desktop-table">
		<GradeTable
			gradeData={subjectGrades}
			summaries={subjectSummaries}
			coreComplete={tokComplete && eeComplete}
		/>
	</div>
</div>

<style lang="scss">
	.main {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 225px;
		margin: 20px auto;
		gap: 10px;
	}

	.mobile-table {
		display: none;
	}

	@media (max-width: 700px) {
		.main {
			display: flex;
			margin: 20px auto;
			.left-column {
				width: 100%;
			}
		}
		.desktop-table {
			display: none;
		}

		.mobile-table {
			margin: 10px 0;
			display: block;
		}
	}
</style>
