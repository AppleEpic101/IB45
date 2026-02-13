<script>
	import {
		availableBoundaries,
		selectedBoundaryId,
		selectedBoundary,
		selectedTimezone
	} from '$lib/stores/stores.js';

	let availableTimezones = 1;

	$: {
		if ($selectedBoundary) {
			let maxTZ = 0;
			// Iterate over all values in the selected boundary object
			for (const subject of Object.values($selectedBoundary)) {
				// Skip the info object which doesn't have TZ
				if (subject.TZ && Array.isArray(subject.TZ)) {
					if (subject.TZ.length > maxTZ) {
						maxTZ = subject.TZ.length;
					}
				}
			}
			availableTimezones = maxTZ > 0 ? maxTZ : 1;
		}
	}

	function processSelectedBoundary(boundary) {
		$selectedBoundaryId = boundary.info.short;
	}

	// Reset selectedTimezone if it exceeds the available number of timezones
	$: if ($selectedTimezone >= availableTimezones) {
		$selectedTimezone = 0;
	}

	let chosenTimezone;
	$: chosenTimezone = $selectedTimezone.toString();
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
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						processSelectedBoundary(boundary);
					}
				}}
				role="button"
				tabindex="0"
			>
				{boundary.info.name}
			</div>
		</label>
	{/each}
</div>

<div>
	<p><strong>Select the timezone.</strong></p>
	{#each Array(availableTimezones) as _, i}
		<label>
			<input
				type="radio"
				name="timezones"
				value={i.toString()}
				bind:group={chosenTimezone}
				on:change={() => ($selectedTimezone = i)}
			/>
			<div
				class="option"
				on:click={() => ($selectedTimezone = i)}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						$selectedTimezone = i;
					}
				}}
				role="button"
				tabindex="0"
			>
				Timezone {i + 1}
			</div>
		</label>
	{/each}
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
		background-color: var(--color-surface-variant);
		border: 2px solid var(--color-text-main);
		padding: 7px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: var(--shadow-sm);
	}

	input[type='radio'] {
		display: none;
	}

	input[type='radio']:checked + div {
		background-color: var(--color-primary);
		color: white;
		text-shadow: none;
		border-color: var(--color-primary);
	}
</style>
