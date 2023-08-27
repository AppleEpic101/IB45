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
				<div class="txt">Boundary Not Found.</div>
				<span class="tooltiptext">
					<p>
						Your selected subject may have fewer than 100 candidates, those of which do not have
						official, published boundaries.
					</p>
					<p>
						Your selected subject may not exist and therefore incompatible with your current grade
						boundary year.
					</p>
				</span>
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

	.tooltip .tooltiptext {
		visibility: hidden;
		background-color: var(--lightprimary);
		text-align: left;
		border-radius: 6px;
		padding-left: 10px;
		border: 2px solid black;

		position: absolute;
		z-index: 1;
	}

	.tooltip:hover {
		cursor: pointer;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}

	.awarded {
		font-weight: bold;
		font-size: 18px;
	}
</style>
