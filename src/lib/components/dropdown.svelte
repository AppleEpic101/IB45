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
		background-color: #e0f2fe;
		padding: 5px 10px;
		color: black;
		border: 1px solid #d1d5db;
		border-radius: 5px;
		cursor: pointer;
		margin-bottom: 5px;
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

	@media screen and (max-width: 380px) {
		select {
			max-width: 100%;
		}
	}
</style>
