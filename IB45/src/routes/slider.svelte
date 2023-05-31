<script>
	let min = 0;
	export let max;
	export let name;
	export let weight;
	export let value = max / 2;

	function handleChange(event) {
		value = event.target.value;
	} 
	
	$: if(value > max) {
		value = max
	} else if(value < min) {
		value = 0;
	}
</script>

<div class="slider">
	<p>{name}</p>
	<p>Weight: {weight * 100}%</p>

	<div class="c">
		<input type="range" bind:value {min} {max} />
		<p><input type="number" bind:value {min} {max} /> / {max}</p>
	</div>
</div>

<style>
	p {
		margin: 0px;
	}
	.slider {
		margin: 30px 0;
		padding-right: 100px;
		border: 2px solid black;
	}
	.c {
		display: flex;
		flex-direction: row;
	}
</style>
