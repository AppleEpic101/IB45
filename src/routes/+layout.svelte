<script>
	import Navigation from '$lib/components/navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DiscordWidget from '$lib/components/DiscordWidget.svelte';
	import { showDiscord } from '$lib/stores/stores.js';
	import { onMount } from 'svelte';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<Navigation />

<div class="slot">
	<slot />
</div>

<Footer />

{#if $showDiscord && mounted}
	<DiscordWidget />
{/if}

<link rel="stylesheet" href="/style/light.css" />

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@300&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

	:global(html) {
		font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
		background-color: #e0f2fe;
		color: black;
	}

	:global(body) {
		background-color: #f8fafc;
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
		font-weight: 500;
		color: black;
	}

	:global(input[type='range']::-moz-range-track) {
		background-color: #053f54;
		height: 8px;
		border-radius: 4px;
	}

	:global(.btn-sik) {
		transition: all 0.2s ease;
		background-color: #e0f2fe;
		border: 1px solid #d1d5db;
		padding: 5px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: 0 1px 1px black;
		color: black;
	}

	:global(.btn-sik:hover) {
		cursor: pointer;
	}

	.slot {
		min-height: 60vh;
	}
</style>
