<script>
	let isOpen = false;

	export let question = '';
	export let answer = '';
	export let bullet = [];

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="collapsible">
	<button class="b" on:click={toggle}>
		<span class:opened={isOpen} class:closed={!isOpen}>&#9658;</span>&nbsp;&nbsp;&nbsp;
		<div class="question">{question}</div></button
	>

	{#if isOpen}
		<div class="answer">{answer}</div>

		<ul>
			{#each bullet as b}
				<li>{b}</li>
				<br />
			{/each}
		</ul>
		<div class="line" />
	{/if}
</div>

<style>
	.collapsible {
		margin-bottom: 10px;
	}

	.line {
		border-bottom: 1px solid #053f54;
	}

	.b {
		width: 100%;
		border: none;
		padding: 0;
		margin: 0;
		padding-bottom: 10px;
		border-bottom: 1px solid #053f54;
		background-color: transparent;
		text-align: left;
		font-size: x-large;
		font-weight: bold;
		display: flex;
		color: black;
	}

	.answer {
		margin-left: 5px;
		margin-top: 10px;
		line-height: 1.5;
	}

	span {
		transition: transform 0.2s;
		display: inline-block;
		width: 1rem;
		height: 1rem;
	}

	.opened {
		transform: rotate(90deg);
		transform-origin: center;
	}

	.closed {
		transform: rotate(0deg);
		transform-origin: center;
	}
</style>
