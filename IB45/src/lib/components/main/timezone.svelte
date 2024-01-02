<script>
	import { timezone, gradeBoundary } from '$lib/stores/store.js';

	const singleTimezones = ['N19', 'N20', 'N21', 'N22'];
	const doubleTimezones = ['M19', 'M21', 'M22', 'M23'];

	let numTimezones;
	$: {
		if (singleTimezones.includes($gradeBoundary)) {
			numTimezones = 1;
		} else if (doubleTimezones.includes($gradeBoundary)) {
			numTimezones = 2;
		}
	}

	$: {
		if (parseInt($timezone) > numTimezones) {
			$timezone = '1';
		}
	}
</script>

<div class="wrap">
	<p><strong>Select the timezone.</strong></p>
	{#each { length: numTimezones } as _, i}
		<label>
			<input type="radio" name="radio" bind:group={$timezone} value={i + 1 + ''} />
			<div class="btn btn-sık"><span>{'Timezone ' + (i + 1)}</span></div>
		</label>
	{/each}
</div>

<style>
	label {
		position: relative;
		display: inline-block;
		text-align: center;
	}

	.btn:hover {
		cursor: pointer;
	}

	.btn {
		text-align: center;
	}
	.btn-sık {
		transition: all 0.2s ease;
		background-color: var(--lightprimary);
		border: 2px solid black;
		padding: 5px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: 0 1px 1px black;
	}

	input[type='radio'] {
		position: absolute;
		visibility: hidden;
	}

	input[type='radio']:checked + div {
		background-color: var(--banner);
	}
	input[type='radio']:checked + div > span {
		color: white;
		text-shadow: 0 2px 2px #808080;
	}
</style>
