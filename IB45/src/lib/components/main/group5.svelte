<script>
	import { group6, group5, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import courses from '$lib/assets/courses.json';
	import { calculateResults, constructURL } from '$lib/group.js';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Slider from '$lib/components/slider.svelte';
	import Groupstat from '$lib/components/main/groupstat.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import SelectedGroup6 from '$lib/components/main/selectedGroup6.svelte';

	onDestroy(() => {
		if (groupNumber == 6)
			$group6 = '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}';
	});

	const subjects = courses.meta.group5;

	export let groupNumber = 5;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group5);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group5 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '';
	$: fullName = store.level + ' ' + store.name;

	$: matchedCourse = courses[store.name]?.[store.level + 'Assessments'];
	$: match = $gradeBoundaryData.find((course) => course.name === fullName);

	$: results = calculateResults(store, matchedCourse, match, $timezone);
	$: awardedMark = results.awardedMark;

	$: url = constructURL(
		new URL($page.url),
		courses[store.name]?.short,
		store.language,
		store.level
	);
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Mathematics
		{:else}
			{fullName}
		{/if}
	</h2>

	{#if groupNumber == 6}
		<SelectedGroup6 />
	{/if}
	<Dropdown str="Enter subject" bind:value={store.name} arr={subjects} />
	<Dropdown str="Enter level" bind:value={store.level} arr={['HL', 'SL']} />

	<div class="content">
		{#if sufficientInformation && matchedCourse}
			{#each matchedCourse as assessment, i}
				<Slider
					max={assessment.maxMarks}
					name={assessment.name}
					weight={assessment.weight}
					bind:value={store.sliderPosition[i]}
				/>
			{/each}
		{/if}
	</div>
	<Groupstat
		{sufficientInformation}
		grade={results.grade}
		{match}
		boundary={results.boundary}
		awardedMark={results.awardedMark}
	/>
	{#if sufficientInformation}
		<br />
		<button class="btn btn-sik"><a href={url} target="_blank">More details</a></button>
	{/if}
</div>

<style>
	button {
		margin: 0;
		margin-top: 10px;
	}
</style>
