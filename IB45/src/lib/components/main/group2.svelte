<script>
	import { group2, group6, gradeBoundaryData, timezone } from '$lib/stores/store.js';
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

	const languages = courses.meta.lang;
	const classical = courses.meta.classical;
	const subjects = courses.meta.group1
		.concat(courses.meta.group2)
		.filter((e) => e !== 'Literature And Performance');
	const SLOnly = courses.meta.SLOnly;

	export let groupNumber = 2;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group2);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group2 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '' && store.language != '';
	$: fullName = store.level + ' ' + store.language + ' ' + store.name;

	$: matchedCourse = courses[store.name]?.[store.level + 'Assessments'];
	$: matchedLang = $gradeBoundaryData.find((course) => course.name === fullName);
	$: {
		if (SLOnly.includes(store.name)) {
			store.level = 'SL';
		}
	}

	$: {
		if (store.name !== 'Classical Language' && classical.includes(store.language)) {
			store.language = '';
		}
		if (store.name === 'Classical Language' && !classical.includes(store.language)) {
			store.language = '';
		}
	}

	$: results = calculateResults(store, matchedCourse, matchedLang, $timezone);
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
			Group {groupNumber}: Language Acquisition
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
	{#if store.name === 'Classical Language'}
		<Dropdown str="Enter language" bind:value={store.language} arr={classical} />
	{:else}
		<Dropdown str="Enter language" bind:value={store.language} arr={languages} />
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
		match={matchedLang}
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
