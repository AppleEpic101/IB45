<script>
	import { group1, group6, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import courses from '$lib/assets/courses.json';
	import { calculateResults, constructURL } from '$lib/group.js';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Groupstat from '$lib/components/main/groupstat.svelte';
	import Slider from '$lib/components/slider.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import SelectedGroup6 from '$lib/components/main/selectedGroup6.svelte';

	onDestroy(() => {
		if (groupNumber == 6)
			$group6 = '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}';
	});

	const subjects = courses.meta.group1;
	const languages = courses.meta.lang;
	const SLOnly = courses.meta.SLOnly;

	export let groupNumber = 1;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group1);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group1 = JSON.stringify(store);
	}

	$: sufficientInformation =
		store.name !== 'Literature And Performance'
			? store.name != '' && store.level != '' && store.language != ''
			: store.name != '' && store.level != '';

	$: fullName =
		store.name === 'Literature And Performance'
			? store.level + ' ' + store.name
			: store.level + ' ' + store.language + ' ' + store.name;

	$: matchedCourse = courses[store.name]?.[store.level + 'Assessments'];
	$: matchedLang = $gradeBoundaryData.find((course) => course.name === fullName); // HL English Language A: Language And Literature
	$: {
		if (SLOnly.includes(store.name)) {
			store.level = 'SL';
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
			Group {groupNumber}: Studies In Language And Literature
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
	{#if store.name !== 'Literature And Performance'}
		<Dropdown str="Enter language" bind:value={store.language} arr={languages} />
	{/if}

	<div class="content">
		{#if sufficientInformation}
			{#each matchedCourse as assessment, i}
				<div>
					<Slider
						max={assessment.maxMarks}
						name={assessment.name}
						weight={assessment.weight}
						bind:value={store.sliderPosition[i]}
					/>
				</div>
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
		<button class="btn btn-sik"><a href={url} target="_blank">More details</a></button>
	{/if}
</div>

<link rel="stylesheet" href="/style/group.css" />

<style>
	button {
		margin: 0;
		margin-top: 10px;
	}
</style>
