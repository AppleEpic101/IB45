<script>
	import SegmentedCircle from "./SegmentedCircle.svelte";

	export let grades;
	export let score;
	export let name;
	export let predictedGrade;
	export let isCore = false;
	export let maxScore = 100;
</script>

<div class="main">
	<div>{name} Grade: {score}/{maxScore}</div>
	<!-- {#if !isCore}
		{#each grades as grade, i}
			<div>Timezone {i + (grades.length == 2 ? 1 : 0)}: {grade}</div>
		{/each}
	{/if} -->
	{#if predictedGrade}
		<b class="progress-container">Awarded Mark:</b>
		<div class="circle-parent">
			<SegmentedCircle mark={predictedGrade} />
		</div>
	{:else}
		<b class="not-found"><a href="/faq" target="_blank">Boundary Not Found</a></b>
	{/if}
</div>

<style lang="scss">
	.main {
		background-color: #e0f2fe;
		border: 1px solid #d1d5db;
		border-radius: 5px;
		width: fit-content;
		padding: 0.5rem;
		margin: 0 0.5rem 0.5rem 0;
	}

	.not-found {
		border-bottom: 1px dotted black;
		cursor: pointer;
	}

	.circle-parent {
		margin-top: 8px;
		filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.2));
	}
</style>
