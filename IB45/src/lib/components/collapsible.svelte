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
		border-bottom: 2px solid var(--banner);
	}

	.b {
		width: 100%;
		border: none;
		padding: 0;
		margin: 0;
		padding-bottom: 10px;
		border-bottom: 2px solid var(--banner);
		background-color: transparent;
		text-align: left;
		font-size: x-large;
		font-weight: bold;
		display: flex;
	}

	.answer {
		margin-left: 5px;
		margin-top: 10px;
		line-height: 1.5;
	}

	li {
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
