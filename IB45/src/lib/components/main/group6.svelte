<script>
	import { group6, gradeBoundaryData, timezone } from '$lib/stores/store.js';
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

	const subjects = courses.meta.group6;
	const SLOnly = courses.meta.SLOnly;

	const groupNumber = 6;
	export let awardedMark;

	let store = JSON.parse($group6);
	$: {
		$group6 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '';
	$: fullName = store.level + ' ' + store.name;

	$: matchedCourse = courses[store.name]?.[store.level + 'Assessments'];
	$: match = $gradeBoundaryData.find((course) => course.name === fullName);

	$: {
		if (SLOnly.includes(store.name)) {
			store.level = 'SL';
		}
	}

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
			Group 6: The Arts
		{:else}
			{fullName}
		{/if}
	</h2>

	{#if SLOnly.includes(store.name)}
		<h5>{store.name} is only offered at the SL level</h5>
	{/if}

	<SelectedGroup6 />
	<Dropdown str="Enter subject" bind:value={store.name} arr={subjects} />
	{#if !SLOnly.includes(store.name)}
		<Dropdown str="Enter level" bind:value={store.level} arr={['HL', 'SL']} />
	{/if}

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
		<button class="btn btn-sik"><a href={url} target="_blank">Goto subject page</a></button>
	{/if}
</div>

<style>
	button {
		margin: 0;
		margin-top: 10px;
	}
</style>
