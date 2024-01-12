<script>
	import Navigation from '$lib/components/navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navigation />

<div class="slot">
	<slot />
</div>

<Footer />

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
</style>
