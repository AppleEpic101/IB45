<script>
	export let name;
	export let maxMarks;
	export let weight;
	export let value;

	if (value === undefined) {
		value = Math.floor(maxMarks / 2);
	}

	$: {
		if (!value) {
			value = 0;
		} else if (value > maxMarks) {
			value = maxMarks;
		}
	}
</script>

<div class="slider">
	<p class="name">{name}</p>
	<p>Weight: {weight * 100}%</p>
	<div class="c">
		<input type="range" bind:value min={0} max={maxMarks} />
		<p><input type="number" bind:value min={0} max={maxMarks} /> / {maxMarks}</p>
	</div>
</div>

<style>
	p {
		margin: 0;
	}
	.slider {
		padding: 10px;
		margin-right: 5px;
		margin-bottom: 5px;
		border: 2px solid black;
		background-color: var(--lightprimary);
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
		background-color: var(--lightprimary);
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
		border: 2px solid black;
		background-color: white;
	}

	@media screen and (max-width: 380px) {
		input[type='range'] {
			width: 27vw;
		}
	}
</style>
