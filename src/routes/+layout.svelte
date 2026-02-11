<script>
	import Navigation from '$lib/components/navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DiscordWidget from '$lib/components/DiscordWidget.svelte';
	import { showDiscord, darkMode } from '$lib/stores/stores.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	$: if (browser && mounted) {
		document.documentElement.setAttribute('data-theme', $darkMode ? 'dark' : 'light');
	}
</script>

<Navigation />

<div class="slot">
	<slot />
</div>

<Footer />

{#if $showDiscord && mounted}
	<DiscordWidget />
{/if}

<link rel="stylesheet" href="/style/main.css" />

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

	:global(html) {
		font-family: var(--font-body);
		background-color: var(--color-bg);
		color: var(--color-text-main);
	}

	:global(body) {
		background-color: var(--color-bg);
		margin: 0;
		padding: 0;
		overscroll-behavior-x: none;
		overflow-x: hidden;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		font-family: var(--font-heading);
		color: var(--color-text-main);
	}

	:global(a, table, label) {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	:global(a) {
		text-decoration: none;
		font-weight: 500;
		color: var(--color-text-main);
	}

	:global(input[type='range']::-moz-range-track) {
		background-color: var(--color-primary-dark);
		height: 8px;
		border-radius: 4px;
	}

	:global(.btn-sik) {
		transition: all 0.2s ease;
		background-color: var(--color-surface-variant);
		border: 1px solid var(--color-border);
		padding: 6px 16px;
		border-radius: var(--radius-md);
		margin: 5px;
		box-shadow: var(--shadow-sm);
		color: var(--color-text-main);
		font-weight: 600;
		font-size: 0.875rem;

		&:hover {
			background-color: var(--color-primary);
			border-color: var(--color-primary);
			color: #000;
			cursor: pointer;
		}
	}

	.slot {
		min-height: 60vh;
	}
</style>
