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
