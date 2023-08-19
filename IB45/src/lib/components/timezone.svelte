<script>
	import { timezone, gradeBoundary } from '$lib/stores/store.js';

	const singleTimezones = ['N21', 'N22'];
	const doubleTimezones = ['M19', 'M21', 'M22'];
	const tripleTimezones = ['M23'];

	const singleLocations = [' (Worldwide)'];
	const doubleLocations = [' (North America, South America)', ' (Europe, Africa, Asia, Oceania)'];

	let numTimezones;
	$: {
		if (singleTimezones.includes($gradeBoundary)) {
			numTimezones = 1;
		} else if (doubleTimezones.includes($gradeBoundary)) {
			numTimezones = 2;
		} else if (tripleTimezones.includes($gradeBoundary)) {
			numTimezones = 3;
		}
	}

	$: {
		if (parseInt($timezone) > numTimezones) {
			$timezone = '1';
		}
	}
</script>

<div class="body">
	<p>Select the timezone.</p>

	<form>
		{#each { length: numTimezones } as _, i}
			<div class="option">
				<input type="radio" bind:group={$timezone} value={i + 1 + ''} />
				<label for="Timezone {i + 1}"
					>Timezone {i + 1}
					{#if numTimezones == 1}
						{singleLocations[i]}
					{:else if numTimezones == 2}
						{doubleLocations[i]}
					{/if}
				</label>
			</div>
		{/each}
	</form>
</div>
