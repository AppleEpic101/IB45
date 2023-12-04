<script>
	import Navigation from '$lib/components/navigation.svelte';
	import { onMount } from 'svelte';
</script>

<Navigation />

<div class="slot">
	<slot />
</div>

<footer>
	<div>
		<strong>THE SYNDICATE</strong>
		<br>
		Alexander Du
		<br>
		Richard Yang
		<br>
		Winston Thov
	</div>
	<!-- <div>
		<strong>RESOURCES</strong><br />
		<a href="/May 2019 Grade Boundaries.pdf" target="_blank">M19</a>
		<a href="/November 2019 Grade Boundaries.pdf" target="_blank">N19</a><br />
		<a href="/May 2022 Grade Boundaries.pdf" target="_blank">M22</a>
		<a href="/November 2022 Grade Boundaries.pdf" target="_blank">N22</a>
	</div> -->
	<div>
		<strong>CONTACT</strong>
		<br>
		Report errors, ask questions, etc.
		<br>
		<a href="mailto:admin@ibpredict.org">admin@ibpredict.org</a>
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

	:global(a, table, label) {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	:global(a) {
		text-decoration: none;
		text-shadow: 0px 0px 0.8px black;
		color: black;
	}

	:global(input[type='range']::-moz-range-track) {
		background-color: #053f54;
		height: 8px;
		border-radius: 4px;
	}

	:global(.btn:hover) {
		cursor: pointer;
	}

	:global(.btn) {
		text-align: center;
	}
	:global(.btn-sik) {
		transition: all 0.2s ease;
		background-color: var(--lightprimary);
		border: 2px solid black;
		padding: 5px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: 0 1px 1px black;
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
		border-top: 1px solid black;
		padding-bottom: 25px;
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
		}
	}
</style>
