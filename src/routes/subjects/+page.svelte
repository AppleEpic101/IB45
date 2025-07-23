<script>
	import data from '$lib/assets/courses.json';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	let courses = [];
	for (let course in data) {
		if (course !== 'meta') {
			courses.push({ name: course, ...data[course] });
		}
	}

	const groups = data.meta.groups;
	import Discord from '$lib/components/Discord.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="IB DP Subject List"
	description="View all the subjects offered in the IB DP. Click to calculate your IB grade for an individual subject."
/>

<div class="body" in:fly={{ duration: 1400, x: 200 }}>
	<h1>Subject List</h1>

	<p class="intro">
		View course descriptions, calculate your grade for a subject, and see historical grade
		boundaries all from a single page! <strong>Click on a subject to get started.</strong>
	</p>
	<Discord />
	<div in:fade={{ delay: 300, duration: 500 }} class="subjects">
		{#each { length: 6 } as _, i}
			<h3>{groups[i]}</h3>
			<div class="list">
				{#each courses as course}
					{#if course.name !== 'meta' && course?.groupNumber?.includes(i + 1)}
						<a href="./subjects/{course.short}"
							><button class="subject"
								>{course.name}{#if course.groupNumber.length === 2 && course.groupNumber[1] === 's'}**
								{:else if course.groupNumber.length === 2}*
								{/if}</button
							></a
						>
					{/if}
				{/each}
			</div>
		{/each}
		<h3>Core</h3>
		<div class="list">
			{#each courses as course}
				{#if course?.name !== 'meta' && course?.groupNumber?.includes(99)}
					<a href="./subjects/{course.short}"
						><button class="subject">
							{course.name}
						</button></a
					>
				{/if}
			{/each}
		</div>
		<h3>Upcoming Syllabus Changes</h3>
		<div class="list">
			<button class="subject"><a href="./subjects/physics">Physics (2025)</a></button>
			<button class="subject"><a href="./subjects/chemistry">Chemistry (2025)</a></button>
			<button class="subject"><a href="./subjects/digital-society">Biology (2025)</a></button>
		</div>
	</div>
	<p class="p">
		* = Interdisciplinary subject <br />
		** = School-based syllabus subject
	</p>
</div>

<style lang="scss">
	.body {
		width: 1115px;
		margin: 0 auto;

		.intro {
			line-height: 2;
		}
	}

	@media screen and (max-width: 1200px) {
		.body {
			width: 100%;
			margin: 0 10px;
		}
	}

	.list {
		display: flex;
		flex-wrap: wrap;
	}
	.subjects {
		margin-bottom: 25px;
	}
	.subject {
		margin: 4px;
		background-color: #e0f2fe;
		padding: 10px;
		border-radius: 10px;
		border: 2px solid black;
		text-decoration: none;
		color: black;
		font-weight: 500;
		font-size: 1.15em;
		font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
	}

	.subject:hover {
		transition: all 0.2s ease;
		cursor: pointer;
		background-color: #053f54;
		color: white;
	}
</style>
