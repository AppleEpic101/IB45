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
		padding: 12px 10px;
		border: 1px solid var(--color-border);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		background-color: var(--color-surface-variant);
		border-radius: 8px;
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
		background-color: var(--color-surface-variant);
	}

	input[type='range']::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		appearance: none;
		height: 10px;
		background-color: var(--color-primary-dark);
		border-radius: 5px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--color-surface-variant);
		border: 5px solid var(--color-primary-dark);
		margin-top: -5px;
	}

	input[type='number'] {
		width: 3em;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background-color: var(--color-surface);
		color: var(--color-text-main);
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
