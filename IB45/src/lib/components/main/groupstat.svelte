<script>
	import { gradeBoundary } from '$lib/stores/store.js';
	export let sufficientInformation;
	export let match;
	export let grade;
	export let boundary;
	export let awardedMark;
</script>

<div class="stats">
	{#if sufficientInformation}
		{$gradeBoundary}
		Grade: {grade}/100
		{#if match}
			<div>
				{#if boundary.length == 1}
					Timezone 0: {boundary[0]}
				{:else}
					{#each boundary as b, i}
						Timezone {i + 1}: {b} <br />
					{/each}
				{/if}
			</div>
			<div class="awarded">Awarded Mark: {awardedMark}</div>
		{:else}
			<br />
			<div class="tooltip">
				<div class="txt"><a href="/faq">Boundary Not Found.</a></div>
			</div>
		{/if}
	{:else}
		<h4>Please provide more details</h4>
	{/if}
</div>

<style>
	.txt {
		font-weight: bold;
		font-size: large;
		margin: 0 5px;
	}
	.tooltip {
		position: relative;
		display: inline-block;
		border-bottom: 1px dotted black;
	}

	.awarded {
		font-weight: bold;
		font-size: 18px;
	}
</style>
