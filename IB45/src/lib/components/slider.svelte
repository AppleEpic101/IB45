<script>
	let min = 0;
	export let max;
	export let name;
	export let weight;
	export let value = Math.trunc(max / 2);

	$: {
		if (value > max) {
			value = max;
		}
		if (value < min) {
			value = 0;
		}
		if (value % 1 !== 0) {
			value = Math.trunc(value);
		}
		if (value === undefined || value === null || Number.isNaN(value)) {
			value = Math.trunc(max / 2);
		}
	}
</script>

<div class="slider">
	<p>{name}</p>
	<p>Weight: {weight * 100}%</p>
	<div class="c">
		<input type="range" bind:value {min} {max} />
		<p><input type="number" bind:value {min} {max} /> / {max}</p>
	</div>
</div>

<style>
	p {
		margin: 0px;
	}
	.slider {
		padding: 10px;
		margin-right: 5px;
		margin-bottom: 5px;
		border: 2px solid black;
		background-color: var(--lightprimary);
		border-radius: 5px;
	}

	.c {
		display: flex;
		flex-direction: row;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		background-color: var(--lightprimary);
	}

	input[type='range']::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 10px;
		background-color: var(--banner);
		border-radius: 5px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--primary);
		border: 5px solid var(--banner);
		margin-top: -5px;
	}

	input[type='number'] {
		width: 3em;
		border: 2px solid black;
		background-color: white;
	}
</style>
