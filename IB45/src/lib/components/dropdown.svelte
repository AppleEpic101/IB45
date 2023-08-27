<script>
	export let str;
	export let arr;
	export let arrVal;
	export let value;

	if (!arrVal) arrVal = arr.map((a) => a);
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
		background-color: var(--lightprimary);
		padding: 5px 10px;
		color: black;
		border: 2px solid black;
		border-radius: 5px;
		transition: 0.3s ease-in-out;
		cursor: pointer;
		margin-bottom: 5px;
	}

	select:hover {
		background-color: var(--primary);
	}

	select option {
		background-color: var(--lightprimary);
		transition: background-color 0.3s ease;
	}

	select * {
		background-color: black;
	}

	@media screen and (max-width: 380px) {
		select {
			max-width: 100%;
		}
	}
</style>
