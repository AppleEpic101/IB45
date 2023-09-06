<script>
	import { scale } from 'svelte/transition';
</script>

<div in:scale={{ delay: 400, duration: 1000, scale: 0.5 }} class="middle-links">
	<a href="/">Home</a> •
	<a href="/subjects">Subject List</a> •
	<a href="/changelog">Changelog</a> •
	<a href="/faq">FAQ</a>
</div>

<style>
	.middle-links {
		text-align: center;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
