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
		<div class="slider-header">
			<p class="name">{name}</p>
			<p class="weight">{weight * 100}%</p>
		</div>
		<div class="c">
			<input type="range" bind:value {min} {max} />
			<p><input type="number" bind:value {min} {max} /> / {max}</p>
		</div>
	</div>
{/key}

<style>
	p {
		min-width: 90px;
		margin: 0;
	}

	.slider {
		box-sizing: border-box;
		padding: 8px 10px;
		margin-bottom: 0;
		border: 1px solid var(--color-border);
		background-color: var(--color-surface-variant);
		border-radius: 5px;
		width: 100%;
	}

	.slider-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 4px;
	}

	.name {
		font-style: italic;
		font-weight: bold;
		font-size: 15px;
		margin-bottom: 0;
	}

	.weight {
		min-width: auto;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 700;
	}
	.c {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		position: relative;
	}

	.c > p {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		min-width: auto;
		white-space: nowrap;
	}

	input[type='range'] {
		flex: 1;
		min-width: 0;
		width: auto;
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
		margin: 0 6px 0 0;
		position: relative;
		top: -2px;
	}

	@media screen and (max-width: 600px) {
		.slider {
			padding: 10px 12px;
		}

		input[type='number'] {
			width: 3.4em;
		}
	}
</style>
