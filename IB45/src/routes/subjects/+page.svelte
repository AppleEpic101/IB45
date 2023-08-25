<script>
	import { courses } from '$lib/stores/store.js';
	import Links from '$lib/components/links.svelte';

	const groups = [
		'Group 1: Studies in Language and Literature',
		'Group 2: Language Acquisition',
		'Group 3: Individuals and Societies',
		'Group 4: Sciences',
		'Group 5: Mathematics',
		'Group 6: The Arts'
	];
</script>

<div class="body">
	<h1>Subject List</h1>

	<Links />

	<br />
	<div class="subjects">
		{#each { length: 6 } as _, i}
			<h3>{groups[i]}</h3>
			<div class="list">
				{#each $courses as course}
					{#if course.groupNumber == i + 1}
						<div class="subject">
							<a href="./subjects/{course.short}">{course.name}</a>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
		<h3>Core</h3>
		<div class="list">
			{#each $courses as course}
				{#if course.groupNumber == 99}
					<div class="subject">
						<a href="./subjects/{course.short}">{course.name}</a>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.body {
		margin: 0 50px;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
	}
	.subjects {
		margin-bottom: 25px;
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
