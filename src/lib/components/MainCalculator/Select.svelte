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
		background-color: var(--primary);
		padding: 10px 15px;
		color: black;
		border: 2px solid black;
		border-radius: 5px;
		cursor: pointer;
		margin-bottom: 5px;
	}

	select:hover {
		transition: all 0.2s ease;
		text-shadow: 0 2px 2px #808080;
		color: white;
		background-color: var(--banner);
	}

	select option {
		background-color: var(--primary);
		color: black;
	}

	select * {
		background-color: black;
	}
</style>
