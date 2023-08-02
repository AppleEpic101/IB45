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
			Awarded Mark: {awardedMark}
		{:else}
			<h4>Boundary Not Found.</h4>
		{/if}
	{:else}
		<h4>Please provide more details</h4>
	{/if}
</div>
