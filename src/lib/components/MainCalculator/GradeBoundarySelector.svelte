<script>
	import {
		availableBoundaries,
		selectedBoundaryId,
		selectedBoundary,
		selectedTimezone
	} from '$lib/stores/stores.js';

	const singleTimezones = ['N19', 'N20', 'N21', 'N22'];

	let availableTimezones = singleTimezones.includes(selectedBoundaryId) ? 1 : 2;

	function processSelectedBoundary(boundary) {
		if (singleTimezones.includes(boundary.info.short)) {
			availableTimezones = 1;
		} else {
			availableTimezones = 2;
		}

		$selectedBoundaryId = boundary.info.short;
	}

	let chosenTimezone = $selectedTimezone.toString();
	$: $selectedTimezone = parseInt(chosenTimezone);
</script>

<p><strong>Select the grade boundary.</strong></p>
<div>
	{#each availableBoundaries as boundary}
		<label>
			<input
				type="radio"
				name="boundaries"
				value={boundary.info.name}
				bind:group={$selectedBoundary.info.name}
			/>
			<div
				class="option"
				on:click={() => {
					processSelectedBoundary(boundary);
				}}
			>
				{boundary.info.name}
			</div>
		</label>
	{/each}
</div>

<div>
	{#if availableTimezones > 1}
		<p><strong>Select the timezone.</strong></p>
		<label>
			<input type="radio" name="timezones" value="0" bind:group={chosenTimezone} />
			<div class="option" on:click={() => ($selectedTimezone = 0)}>Timezone 1</div>
		</label>
		<label>
			<input type="radio" name="timezones" value="1" bind:group={chosenTimezone} />
			<div class="option" on:click={() => ($selectedTimezone = 1)}>Timezone 2</div>
		</label>
	{/if}
</div>

<style>
	p {
		margin-bottom: 4px;
		margin-left: 7px;
	}

	label {
		position: relative;
		display: inline-block;
		text-align: center;
	}

	.option:hover {
		cursor: pointer;
	}

	.option {
		text-align: center;
		transition: all 0.2s ease;
		background-color: #e0f2fe;
		border: 2px solid black;
		padding: 7px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: 0 1px 1px black;
	}

	input[type='radio'] {
		display: none;
	}

	input[type='radio']:checked + div {
		background-color: #053f54;
		color: white;
		text-shadow: 0 2px 2px #808080;
	}
</style>
