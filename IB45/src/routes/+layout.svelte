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

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Space+Grotesk:wght@300..700&display=swap');
	$font-family: 'Space Grotesk', sans-serif;

	:global(html) {
		font-family: $font-family;
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
