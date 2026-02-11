<script>
	export let str;
	export let arr;
	export let arrVal;
	export let value;

	if (!arrVal) arrVal = arr.map((a) => a);
	$: {
		if (!arrVal.includes(value)) {
			value = arrVal[0];
		}
	}
</script>

<select bind:value>
	{#if str}
		<option value="">{str}</option>
	{/if}
	{#each arr as a, i}
		<option value={arrVal[i]}>{a}</option>
	{/each}
</select>

<style>
	select {
		background-color: var(--color-surface-variant);
		padding: 5px 10px;
		color: var(--color-text-main);
		border: 1px solid var(--color-border);
		border-radius: 5px;
		cursor: pointer;
		margin-bottom: 5px;
	}

	select:hover {
		transition: all 0.2s ease;
		text-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
		color: white;
		background-color: var(--color-primary-dark);
	}

	select option {
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
	}

	@media screen and (max-width: 380px) {
		select {
			max-width: 100%;
		}
	}
</style>
