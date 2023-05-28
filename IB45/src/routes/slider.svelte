<script>
	export let value = 20;
	let min = 0;
	export let max;
	export let name;

	function handleChange(event) {
		value = event.target.value;
	}
</script>

<div class="slider">
	<h5>{name}</h5>

	<div class="c">
		<input type="range" bind:value {min} {max} />
		<p><input type="number" bind:value {min} {max} /> / {max}</p>
	</div>
</div>

<style>
	.slider {
		padding-right: 100px;
	}
	.c {
		display: flex;
		flex-direction: row;
	}
</style>
