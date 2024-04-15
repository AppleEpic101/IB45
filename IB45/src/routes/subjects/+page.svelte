<script>
	import data from '$lib/assets/courses.json';
	import { fade, fly, scale } from 'svelte/transition';
	import Links from '$lib/components/links.svelte';
	import { onMount } from 'svelte';

	let courses = [];
	for (let course in data) {
		if (course !== 'meta') {
			courses.push({ name: course, ...data[course] });
		}
	}

	const groups = data.meta.groups;
</script>

<svelte:head>
	<title>IB DP Subject List</title>
	<meta
		name="description"
		content="View all the subjects offered in the IB DP. Click to calculate your IB grade for an individual subject."
	/>
</svelte:head>

<div class="body">
	<h1 in:fly={{ duration: 1400, x: 200 }}>Subject List</h1>

	<Links />
	<p class="intro" in:fly={{ duration: 1400, y: 50 }}>
		View course descriptions, calculate your grade for a subject, and see historical grade
		boundaries all from a single page! <strong>Click on a subject to get started.</strong>
	</p>
	<br />
	<div in:fade={{ delay: 300, duration: 500 }} class="subjects">
		{#each { length: 6 } as _, i}
			<h3 in:fly={{ duration: 1400, x: 200 }}>{groups[i]}</h3>
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
			<button class="subject"
				><a href="./subjects/business-management">Business Management (2024)</a></button
			>
			<button class="subject"
				><a href="./subjects/classical-language">Classical Language (2024)</a></button
			>
			<button class="subject"
				><a href="./subjects/digital-society">Digital Society (2024)</a></button
			>
			<button class="subject"
				><a href="./subjects/literature-and-performance">Literature And Performance (2024)</a
				></button
			>
			<button class="subject"><a href="./subjects/theatre">Theatre (2024)</a></button>
		</div>
	</div>
	<p class="p">
		* = Interdisciplinary subject <br />
		** = School-based syllabus subject
	</p>
</div>

<style>
	.body {
		margin: 0 18%;
	}

	.intro {
		line-height: 2;
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
		text-decoration: none;
		text-shadow: 0px 0px 0.8px black;
		color: black;
		font-size: 1.15em;
	}

	.subject:hover {
		transition: all 0.2s ease;
		cursor: pointer;
		background-color: var(--banner);
		color: white;
	}
	@media screen and (max-width: 480px) {
		.body {
			margin: 0 10px;
		}
	}
</style>
