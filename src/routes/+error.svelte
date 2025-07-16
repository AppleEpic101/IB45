<script>
	import { page } from '$app/stores';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>Error: {$page.status}</title>
	<meta name="description" content="An error occurred on the IB Predict website." />
	<meta name="og:title" content="Error: {$page.status}" />
	<meta name="og:description" content={$page.error.message} />
</svelte:head>

<div in:fly={{ duration: 1400, x: 100 }}>
	<h1>Status Code: {$page.status}</h1>
	<h3>Message: {$page.error.message}</h3>
</div>

{#if parseInt($page.status) === 500}
	<h1>
		This site requires the use of cookies. Please turn on or allow cookies in your browser settings
		for functionality. If this doesn't work, try resetting your cache and local storage for this
		site.
	</h1>
{/if}

<!-- svelte-ignore a11y-missing-attribute -->
<img in:scale={{ duration: 1500, start: 0.3, opacity: 0.5 }} src="/flc_design20230531154582.png" />

<style>
	h1,
	h3 {
		padding: 0 50px;
		text-align: center;
	}
	img {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: 500px;
	}
</style>
