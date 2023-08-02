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
		Grade: {grade} / 100
		{#if match}
			<div>
				{$gradeBoundary}&nbsp;&nbsp;&nbsp;&nbsp;
				{#if boundary.length == 1}
					Timezone 0: {boundary[0]}
				{:else}
					{#each boundary as b, i}
						Timezone {i + 1}: {b} &nbsp&nbsp&nbsp&nbsp
					{/each}
				{/if}
			</div>
			Awarded Mark: {awardedMark}
		{:else}
			<h4>Boundary Not Found.</h4>
		{/if}
	{:else}
		<h4>Please provide more details</h4>
	{/if}
</div>
