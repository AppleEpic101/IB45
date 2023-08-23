<script>
	import { timezone, gradeBoundary } from '$lib/stores/store.js';

	const singleTimezones = ['N19', 'N20', 'N21', 'N22'];
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
	<h3>Select the timezone.</h3>

	<div class="buttons">
		{#each { length: numTimezones } as _, i}
			<input type="radio" bind:group={$timezone} value={i + 1 + ''} label={'Timezone ' + (i + 1)} />
		{/each}
	</div>
</div>

<style>
	.buttons {
		padding: 4px;
		border-radius: 3px;
		position: relative;
		width: fit-content;
	}

	.buttons input {
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		border-radius: 10px;
		padding: 5px 10px;
		background-color: var(--lightprimary);
		color: black;
		font-size: 15px;
		font-family: sans-serif;
		transition: all 0.1s;
		border: 2px solid black;
	}

	.buttons input:checked {
		background: var(--banner);
		color: white;
		box-shadow: 0 1px 1px black;
		text-shadow: 0 2px 2px #808080;
	}

	.buttons input::before {
		content: attr(label);
		text-align: center;
	}
</style>
