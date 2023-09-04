<script>
	import { page } from '$app/stores';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Links from '$lib/components/links.svelte';
	let ready = false;
	onMount(() => (ready = true));
</script>

{#if ready}
	<div in:fly={{ duration: 1400, x: 100 }}>
		<h1>Status Code: {$page.status}</h1>
		<h3>Message: {$page.error.message}</h3>
	</div>

	<br /><Links /><br /><br />

	{#if parseInt($page.status) === 500}
		<h1>
			This site requires the use of cookies. Please turn on or allow cookies in your browser
			settings for functionality.
		</h1>
	{/if}

	<!-- svelte-ignore a11y-missing-attribute -->
	<img
		in:scale={{ duration: 1500, start: 0.3, opacity: 0.5 }}
		src="/flc_design20230531154582.png"
	/>
{/if}

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
