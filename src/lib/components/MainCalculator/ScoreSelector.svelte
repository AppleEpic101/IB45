<script>
	export let name;
	export let maxMarks;
	export let weight;
	export let value;
	export let compact = false;
	let showFullName = false;

	if (value === undefined || value === null || value === '') {
		value = 0;
	}

	$: displayValue = Math.min(maxMarks, Math.max(0, Number(value) || 0));

	function updateValue(event) {
		const nextValue = event.currentTarget.value;
		value = nextValue === '' ? 0 : Math.min(maxMarks, Math.max(0, Number(nextValue)));
	}
</script>

<div class:compact class="slider">
	<div class="slider-meta">
		<div class="name-shell">
			{#if compact}
				<button
					type="button"
					class="name"
					title={name}
					aria-expanded={showFullName}
					on:click={() => (showFullName = !showFullName)}
					on:blur={() => (showFullName = false)}>{name}</button
				>
				<span class="full-name" class:visible={showFullName} role="tooltip">{name}</span>
			{:else}
				<p class="name">{name}</p>
			{/if}
		</div>
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
	.name-shell {
		position: relative;
		flex: 1;
		min-width: 0;
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
		position: relative;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		max-width: none;
		padding: 9px 10px 8px;
	}
	.slider.compact:hover,
	.slider.compact:focus-within {
		z-index: 5;
	}

	.slider.compact .name {
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font-family: inherit;
		text-align: left;
		width: 100%;
		overflow: hidden;
		font-size: 0.84rem;
		font-weight: 650;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: help;
		outline: none;
	}

	.full-name {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		z-index: 20;
		width: max-content;
		max-width: min(280px, 80vw);
		padding: 7px 9px;
		border: 1px solid var(--color-border);
		border-radius: 7px;
		background: var(--color-surface);
		box-shadow: var(--shadow-md);
		color: var(--color-text-main);
		font-size: 0.72rem;
		font-style: normal;
		font-weight: 650;
		line-height: 1.25;
		opacity: 0;
		pointer-events: none;
		translate: 0 -3px;
		transition: opacity 120ms ease, translate 120ms ease;
	}

	.name-shell:hover .full-name,
	.name:focus + .full-name,
	.full-name.visible {
		opacity: 1;
		translate: 0 0;
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
