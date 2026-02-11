<script>
	export let identifier; // unique identifier
	export let arr;
	export let arrVal;
	export let value;
</script>

<div class="wrap">
	{#each arr as item, i}
		<label>
			<input type="radio" name={identifier} value={arrVal[i]} bind:group={value} />
			<div class="btn">{item}</div>
		</label>
	{/each}
</div>

<style lang="scss">
	.wrap {
		display: inline-flex;
		background-color: var(--color-surface-variant);
		border: 1px solid var(--color-border);
		padding: 4px;
		border-radius: var(--radius-md);
		gap: 4px;

		label {
			position: relative;
			display: inline-block;
			text-align: center;
			cursor: pointer;
		}
	}

	input[type='radio'] {
		position: absolute;
		visibility: hidden;
	}

	.btn {
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-muted);
		transition: all 0.2s ease;
		border: none;
		box-shadow: none;
		margin: 0;

		&:hover {
			color: var(--color-text-main);
		}
	}

	input[type='radio']:checked + .btn {
		background-color: var(--color-surface);
		color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}
</style>
