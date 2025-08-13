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
	import Button from '../../lib/components/button.svelte';
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
						<Button
							variant="larger"
							href="./subjects/{course.short}"
							text={course.name + (course.groupNumber.length === 2 ? course.groupNumber[1] === 's' ? '**' : '*' : '')}
						/>
					{/if}
				{/each}
			</div>
		{/each}
		<h3>Core</h3>
		<div class="list">
			{#each courses as course}
				{#if course?.name !== 'meta' && course?.groupNumber?.includes(99)}
					<Button
						variant="larger"
						href="./subjects/{course.short}"
						text={course.name}
					/>
				{/if}
			{/each}
		</div>
		<h3>Upcoming Syllabus Changes</h3>
		<div class="list">
			<Button variant="larger" href="./subjects/physics" text="Physics (2025)" />
			<Button variant="larger" href="./subjects/chemistry" text="Chemistry (2025)" />
			<Button variant="larger" href="./subjects/digital-society" text="Biology (2025)" />
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
</style>
