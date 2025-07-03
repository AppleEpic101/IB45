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
		if (Number.isNaN(value)) {
			value = 0;
		}
		if (value === undefined || value === null) {
			value = 0;
		}
	}
</script>

{#key max}
	<div class="slider">
		<p class="name">{name}</p>
		<p>Weight: {weight * 100}%</p>
		<div class="c">
			<input type="range" bind:value {min} {max} />
			<p><input type="number" bind:value {min} {max} /> / {max}</p>
		</div>
	</div>
{/key}

<style>
	p {
		margin: 0;
	}
	
	.slider {
		padding: 10px;
		margin-right: 5px;
		margin-bottom: 5px;
		border: 1px solid var(--bordercolor);
		background-color: var(--primary);
		border-radius: 5px;
		max-width: 300px;
	}

	.name {
		font-style: italic;
		margin-bottom: 5px;
	}
	.c {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		background-color: var(--primary);
	}

	input[type='range']::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		appearance: none;
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
		border: 1px solid var(--bordercolor);
		border-radius: 6px;
		background-color: white;
		margin-left: 4px;
		position: relative;
		top: -2px;
	}

	@media screen and (max-width: 380px) {
		input[type='range'] {
			width: 27vw;
		}
	}
</style>
