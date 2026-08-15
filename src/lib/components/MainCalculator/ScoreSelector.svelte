<script>
	export let name;
	export let maxMarks;
	export let weight;
	export let value;
	export let allowEmpty = false;
	export let entered = !allowEmpty;

	if (!allowEmpty && (value === undefined || value === null || value === '')) {
		value = Math.floor(maxMarks / 2);
		entered = true;
	}

	$: displayValue =
		(allowEmpty && !entered) || value === undefined || value === null || value === '' ? '' : value;
	$: rangeValue = displayValue === '' ? 0 : displayValue;

	function updateValue(event) {
		const nextValue = event.currentTarget.value;
		value = nextValue === '' ? undefined : Math.min(maxMarks, Math.max(0, Number(nextValue)));
		entered = nextValue !== '';
	}
</script>

<div class="slider">
	<p class="name">{name}</p>
	<p>Weight: {weight * 100}%</p>
	<div class="c">
		<input
			type="range"
			value={rangeValue}
			min={0}
			max={maxMarks}
			aria-label={`${name} score`}
			on:input={updateValue}
		/>
		<p>
			<input
				type="number"
				value={displayValue}
				min={0}
				max={maxMarks}
				placeholder="—"
				aria-label={`${name} mark`}
				on:input={updateValue}
			/>
			/ {maxMarks}
		</p>
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
		width: 3.4em;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background-color: var(--color-surface);
		color: var(--color-text-main);
		margin-left: 4px;
		position: relative;
		top: -2px;
	}

	input[type='number']::placeholder {
		color: var(--color-text-muted);
	}

	@media screen and (max-width: 380px) {
		input[type='range'] {
			width: 27vw;
		}
	}
</style>
