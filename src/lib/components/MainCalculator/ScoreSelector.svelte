<script>
	export let name;
	export let maxMarks;
	export let weight;
	export let value;
	export let compact = false;

	if (value === undefined || value === null || value === '') {
		value = 0;
	}

	$: displayValue = value ?? 0;

	function updateValue(event) {
		const nextValue = event.currentTarget.value;
		value = nextValue === '' ? 0 : Math.min(maxMarks, Math.max(0, Number(nextValue)));
	}
</script>

<div class:compact class="slider">
	<div class="slider-meta">
		<p class="name">{name}</p>
		<p class="weight">{weight * 100}%</p>
	</div>
	<div class="c">
		<input
			type="range"
			value={displayValue}
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

	.slider-meta {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}

	.weight {
		color: var(--color-text-muted);
		font-size: 0.8rem;
		white-space: nowrap;
	}

	.name {
		font-style: italic;
		margin-bottom: 5px;
	}
	.c {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
	}

	.slider.compact {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		max-width: none;
		padding: 9px 10px 8px;
	}

	.slider.compact .name {
		max-width: calc(100% - 42px);
		overflow: hidden;
		font-size: 0.84rem;
		font-weight: 650;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.slider.compact .c {
		margin-top: 5px;
		min-width: 0;
	}

	.slider.compact input[type='range'] {
		flex: 1 1 0;
		width: 0;
		min-width: 70px;
	}

	.slider.compact .c p {
		flex: none;
		font-size: 0.78rem;
		white-space: nowrap;
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

	@media screen and (max-width: 380px) {
		input[type='range'] {
			width: 27vw;
		}
	}
</style>
