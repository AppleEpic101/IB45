<script>
	export let str;
	export let arr;
	export let value;
</script>

<select bind:value>
	<option value="">{str}</option>
	{#each arr as a}
		<option value={a}>{a}</option>
	{/each}
</select>

<style>
	select {
		background-color: var(--lightprimary);
		padding: 10px;
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

	select option::after {
		background-color: black;
	}
</style>
