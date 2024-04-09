<script>
	import { group3, group6, gradeBoundaryData, timezone } from '$lib/stores/store.js';
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

	const subjects = courses.meta.group3;
	const SLOnly = courses.meta.SLOnly;
	const regions = courses.meta.region;

	export let groupNumber = 3;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group3);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group3 = JSON.stringify(store);
	}

	$: sufficientInformation = !(
		(shortName == 'HL History' && store.region == '') ||
		store.name == '' ||
		store.level == ''
	);
	$: shortName = store.level + ' ' + store.name;
	$: fullName = store.level + ' ' + store.name + ' ' + store.region;

	$: matchedCourse = courses[store.name]?.[store.level + 'Assessments'];
	$: match = $gradeBoundaryData.find((course) => {
		if (store.name == 'Digital Society') {
			return course.name === store.level + ' ' + 'Information Technology In A Global Society';
		}
		return course.name === fullName.trim();
	});

	$: {
		if ((store.name === 'History' && store.level === 'SL') || store.name !== 'History') {
			store.region = '';
		}
	}

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
			Group {groupNumber}: Individuals And Societies
		{:else}
			{fullName}
		{/if}
	</h2>

	{#if SLOnly.includes(store.name)}
		<h5>{store.name} is only offered at the SL level</h5>
	{/if}

	{#if groupNumber == 6}
		<SelectedGroup6 />
	{/if}
	<Dropdown str="Enter subject" bind:value={store.name} arr={subjects} />
	{#if !SLOnly.includes(store.name)}
		<Dropdown str="Enter level" bind:value={store.level} arr={['HL', 'SL']} />
	{/if}
	{#if store.name === 'History' && store.level === 'HL'}
		<Dropdown str="Enter HL History Region" bind:value={store.region} arr={regions} />
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
		<button class="btn btn-sik"><a href={url} target="_blank">More details</a></button>
	{/if}
</div>

<style>
	button {
		margin: 0;
		margin-top: 10px;
	}
</style>
