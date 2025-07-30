<script>
	import SegmentedCircle from "./SegmentedCircle.svelte";

	export let score;
	export let name;
	export let predictedGrade;
	export let isCore = false;
	export let isCondensed = false;
	export let maxScore = 100;
</script>

<div class="main">
	<div>{name} Grade: <span class="grade">{score}</span>/{maxScore}</div>
	<!-- {#if !isCore}
		{#each grades as grade, i}
			<div>Timezone {i + (grades.length == 2 ? 1 : 0)}: {grade}</div>
		{/each}
	{/if} -->
	{#if predictedGrade}
		{#if isCondensed}
			<b class="awarded-mark">Awarded Mark: {predictedGrade}</b>
		{:else}
			<b class="awarded-mark">Awarded Mark:</b>
			<div class="circle-parent">
				<SegmentedCircle 
					totalSegments={isCore ? 5 : 7} 
					mark={predictedGrade}
					isCore={isCore}
				/>
			</div>
		{/if}
	{:else}
		<b class="not-found"><a href="/faq" target="_blank">Boundary Not Found</a></b>
	{/if}
</div>

<style lang="scss">
	.main {
		background-color: #e0f2fe;
		border: 1px solid #d1d5db;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		width: 15ch;
		padding: 0.5rem;
		margin: 0 0.5rem 0.5rem 0;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.grade {
		display: inline-block;
		width: 2.5ch;
		text-align: end;
	}

	.not-found {
		border-bottom: 1px dotted black;
		cursor: pointer;
	}

	.circle-parent {
		margin-top: 8px;
		filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));
	}
</style>

