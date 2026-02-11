<script>
	export let selected;
	export let options;
	export let placeholder;

	$: {
		if (
			selected === null ||
			(selected !== undefined &&
				!options.includes(selected) &&
				!options.some((option) => option.value == selected))
		) {
			selected = '';
		}
	}
</script>

<select bind:value={selected}>
	{#if placeholder}
		<option value="" selected>{placeholder}</option>
	{/if}
	{#each options as option}
		<option value={option.value !== undefined ? option.value : option}
			>{option.name || option}</option
		>
	{/each}
</select>

<style>
	select {
		background-color: var(--color-surface-variant);
		padding: 10px 15px;
		color: var(--color-text-main);
		border: 1px solid var(--color-border);
		border-radius: 5px;
		cursor: pointer;
		margin-bottom: 5px;
		margin-right: calc(1rem - 6px);
		font-family: var(--font-body);
	}

	select:hover {
		transition: all 0.2s ease;
		text-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
		color: white;
		background-color: var(--color-primary-dark);
	}

	select option {
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
	}
</style>
