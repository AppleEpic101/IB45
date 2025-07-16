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
			<div class="btn btn-sik"><span>{item}</span></div>
		</label>
	{/each}
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		label {
			position: relative;
			display: inline-block;
			text-align: center;
		}
	}

	input[type='radio'] {
		position: absolute;
		visibility: hidden;
	}

	input[type='radio']:checked + div {
		background-color: #053f54;
	}
	input[type='radio']:checked + div > span {
		color: white;
		text-shadow: 0 2px 2px #808080;
	}
</style>
