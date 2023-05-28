<script>
	import Slider from './slider.svelte';
	export let groupNumber;

	let grade;

	let paper1Value;
	let paper2Value;
	let hlEssayValue;
	let individualOralValue;

	grade =
		(paper1Value / 40) * 35 +
		(paper2Value / 30) * 25 +
		(hlEssayValue / 20) * 20 +
		(individualOralValue / 20) * 20;
</script>

<div class="group">
	<h2>Group {groupNumber}</h2>
	<div class="content">
		<Slider max={40} name={'Paper 1'} bind:value={paper1Value} />
		<Slider max={30} name={'Paper 2'} bind:value={paper2Value} />
		<Slider max={20} name={'HL Essay'} bind:value={hlEssayValue} />
		<Slider max={40} name={'Individual Oral'} bind:value={individualOralValue} />
	</div>
	<div>Grade: {grade}</div>
</div>

<style>
	.content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: left;
	}
</style>
