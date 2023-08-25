<script>
	import { page } from '$app/stores';
</script>

<h1>Status Code: {$page.status}</h1>
<h3>Message: {$page.error.message}</h3>

<br /><br /><br />

{#if parseInt($page.status) === 500}
	<h1>
		This site requires the use of cookies. Please turn on or allow cookies in your browser settings
		for functionality.
	</h1>
{/if}

<img src="/flc_design20230531154582.png" />

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
	}
</style>
