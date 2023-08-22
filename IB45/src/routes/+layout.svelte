<script>
	import Navigation from '$lib/components/navigation.svelte';
</script>

<Navigation />

<div class="slot">
	<slot />
</div>

<footer>
	<div>
		<strong>THE SYNDICATE</strong><br />Alexander Du<br />Winston Thov<br />Richard Yang
	</div>
	<div class="title">
		<strong>RESOURCES</strong><br />
		<a href="May 2019 Grade Boundaries.pdf" target="_blank">May 2019 Grade Boundary</a><br />
		<a href="May 2022 Grade Boundaries.pdf" target="_blank">May 2022 Grade Boundary</a><br />
		<a href="November 2022 Grade Boundaries.pdf" target="_blank">November 2022 Grade Boundary</a>
	</div>
	<div>
		<strong>CONTACT</strong><br />Report errors, ask questions, etc.<br />admin@ibpredict.com
	</div>
</footer>

<link rel="stylesheet" href="/style/light.css" />

<style>
	:global(html) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: var(--primary);
		color: black;
	}

	:global(body) {
		background-color: var(--background);
		margin: 0;
		padding: 0;
		overscroll-behavior-x: none;
	}

	:global(a:link, a:visited) {
		color: black;
	}

	.slot {
		min-height: 60vh;
	}

	footer {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		background-color: var(--primary);
		height: 25vh;
		border-top: 1px solid black;
	}

	footer div {
		text-align: center;
		line-height: 2;
	}

	footer div::before {
		content: '\A';
		white-space: pre;
	}

	@media screen and (max-width: 560px) {
		footer {
			display: block;
			height: 450px;
		}
	}
</style>
