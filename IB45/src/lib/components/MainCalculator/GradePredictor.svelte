<script>
	import SubjectGroup from '$lib/components/MainCalculator/SubjectGroup.svelte';
	import MiscGroup from '$lib/components/MainCalculator/MiscGroup.svelte';
	import GradeTable from '$lib/components/MainCalculator/GradeTable.svelte';
	import Refresh from '$lib/components/MainCalculator/Refresh.svelte';

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
</script>

<Refresh />
<div class="main">
	<div>
		{#each Array(6).fill(0) as _, i}
			<SubjectGroup
				group={i}
				bind:predictedGrade={subjectGrades[i].grade}
				bind:level={subjectGrades[i].level}
			/>
		{/each}
		<MiscGroup
			bind:tokGrade={subjectGrades.tokGrade}
			bind:eeGrade={subjectGrades.eeGrade}
			bind:coreGrade={subjectGrades.coreGrade}
		/>
	</div>
	<div>
		<GradeTable gradeData={subjectGrades} />
	</div>
</div>

<style>
	.main {
		display: grid;
		grid-template-columns: 4fr 275px;
		margin: 20px auto;
	}
</style>
