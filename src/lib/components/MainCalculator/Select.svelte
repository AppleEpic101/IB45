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
		background-color: #e0f2fe;
		padding: 10px 15px;
		color: black;
		border: 1px solid #d1d5db;
		border-radius: 5px;
		cursor: pointer;
		margin-bottom: 5px;
		font-family: 'Montserrat', 'Space Grotesk', sans-serif;
	}

	select:hover {
		transition: all 0.2s ease;
		text-shadow: 0 2px 2px #808080;
		color: white;
		background-color: #053f54;
	}

	select option {
		background-color: #e0f2fe;
		color: black;
	}

	select * {
		background-color: black;
	}
</style>
