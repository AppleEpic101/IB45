<script>
	import { courses } from '$lib/stores/store.js';
	import { fade, fly, scale } from 'svelte/transition';
	import Links from '$lib/components/links.svelte';
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => (ready = true));

	const groups = [
		'Group 1: Studies in Language and Literature',
		'Group 2: Language Acquisition',
		'Group 3: Individuals and Societies',
		'Group 4: Sciences',
		'Group 5: Mathematics',
		'Group 6: The Arts'
	];
</script>

<svelte:head>
	<title>IB DP Subject List</title>
	<meta
		name="description"
		content="View all the subjects offered in the IB DP. Click to calculate your IB grade for an individual subject."
	/>
</svelte:head>

{#if ready}
	<div class="body">
		<h1 in:fly={{ duration: 1400, x: 200 }}>Subject List</h1>

		<Links />
		<p in:fly={{ duration: 1400, y: 50 }}>
			View course descriptions, calculate your grade for a subject, and see historical grade
			boundaries all from a single page! Click on a subject to get started.
		</p>
		<br />
		<div in:fade={{ delay: 300, duration: 500 }} class="subjects">
			{#each { length: 6 } as _, i}
				<h3 in:fly={{ duration: 1400, x: 200 }}>{groups[i]}</h3>
				<div class="list">
					{#each $courses as course}
						{#if course.name !== 'info' && course.groupNumber.includes(i + 1)}
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
					{#if course.name !== 'info' && course.groupNumber.includes(99)}
						<div class="subject">
							<a href="./subjects/{course.short}">{course.name}</a>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<p class="p">
			* = Interdisciplinary subject <br />
			** = School-based syllabus subject
		</p>
	</div>
{/if}

<style>
	.body {
		margin: 0 18%;
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
	@media screen and (max-width: 480px) {
		.body {
			margin: 0 10px;
		}
	}
</style>
