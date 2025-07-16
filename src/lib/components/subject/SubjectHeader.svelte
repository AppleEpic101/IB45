<script>
	export let syllabus;
</script>

<div>
	<h1>
		{syllabus.name}
		({syllabus.firstAssessment})
	</h1>

	<h4>
		{#if syllabus.groupNumber.length === 2}
			{#if syllabus.groupNumber[1] === 's'}
				Group {syllabus.groupNumber[0]} school-based syllabus subject <br />
			{:else}
				Group {syllabus.groupNumber[0]} and {syllabus.groupNumber[1]} interdisciplinary subject<br
				/>
			{/if}
		{:else if syllabus.groupNumber[0] === 99}
			Core subject <br />
		{:else if syllabus.groupNumber.length === 1}
			Group {syllabus.groupNumber} subject <br />
		{/if}
		Assessments from {syllabus.firstAssessment} to {syllabus.lastAssessment}
	</h4>
</div>

<style>
	h1 {
		margin: 0;
	}
</style>
