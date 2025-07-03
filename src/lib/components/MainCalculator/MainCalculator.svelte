<script>
	import Group from '$lib/components/MainCalculator/Group.svelte';
	import Core from '$lib/components/MainCalculator/Core.svelte';
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

<div class="mobile-table">
	<GradeTable gradeData={subjectGrades} />
</div>
<Refresh />

<div class="main">
	<div class="left-column">
		{#each Array(6).fill(0) as _, i}
			<Group
				group={i}
				bind:predictedGrade={subjectGrades[i].grade}
				bind:level={subjectGrades[i].level}
			/>
		{/each}
		<Core
			bind:tokGrade={subjectGrades.tokGrade}
			bind:eeGrade={subjectGrades.eeGrade}
			bind:coreGrade={subjectGrades.coreGrade}
		/>
	</div>
	<div class="desktop-table">
		<GradeTable gradeData={subjectGrades} />
	</div>
</div>
<div class="mobile-table">
	<GradeTable gradeData={subjectGrades} />
</div>
<Refresh />

<style lang="scss">
	.main {
		display: grid;
		grid-template-columns: 1fr 225px;
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
