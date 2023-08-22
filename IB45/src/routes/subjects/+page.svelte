<script>
	import { courses } from '$lib/stores/store.js';
	import Links from '$lib/components/links.svelte';
</script>

<div class="body">
	<h1>Subject List</h1>

	<Links />

	<br />
	<div class="subjects">
		{#each $courses as course}
			<div class="subject">
				<a href="./subjects/{course.name}">{course.name}</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.body {
		margin: 0 50px;
	}
	.subjects {
		display: flex;
		flex-wrap: wrap;
	}
	.subject {
		margin: 10px;
		background-color: var(--lightprimary);
		padding: 10px;
		border-radius: 10px;
		border: 2px solid black;
	}
	@media screen and (max-width: 380px) {
		.body {
			margin: 0 10px;
		}
	}
</style>
