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
	<p>
		Here you can calculate your grade for a single subject and get a breakdown of the course. By inputting specific details about the subject, level, and other relevant factors, you gain insight into your performance and potential outcomes. This feature offers a tailored evaluation, allowing you to analyze your strengths and areas for improvement within the subject's curriculum.
	</p>
	<br />
	<div class="subjects">
		{#each { length: 6 } as _, i}
			<h3>{groups[i]}</h3>
			<div class="list">
				{#each $courses as course}
					{#if course.groupNumber.includes(i + 1)}
						<div class="subject">
							<a href="./subjects/{course.short}"
								>{course.name}{#if course.groupNumber.length === 2 && course.groupNumber[1] === 's'}**
								{:else if course.groupNumber.length === 2}*
								{/if}</a
							>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
		<h3>Core</h3>
		<div class="list">
			{#each $courses as course}
				{#if course.groupNumber.includes(99)}
					<div class="subject">
						<a href="./subjects/{course.short}">{course.name}</a>
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<p>
		* = Interdisciplinary subject <br />
		** = School-based syllabus subject
	</p>
</div>

<style>
	.body {
		margin: 0 12%;
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
	p {
		font-size: small;
		font-weight: bold;
	}
</style>
