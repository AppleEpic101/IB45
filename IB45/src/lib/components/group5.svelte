<script>
	import { group6, group5, courses, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Slider from '$lib/components/slider.svelte';
	import Groupstat from '$lib/components/groupstat.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import SelectedGroup6 from '$lib/components/selectedGroup6.svelte';

	onDestroy(() => {
		if (groupNumber == 6)
			$group6 = '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}';
	});

	const info = $courses.find((c) => c.name === 'info');
	const subjects = info.info.group5;

	export let groupNumber = 5;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group5);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group5 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '';
	$: fullName = store.level + ' ' + store.name;

	$: foo = $courses.find((course) => course.name === store.name);
	let matchedCourse;
	$: if (store.level === 'SL') {
		matchedCourse = foo?.SL;
	} else if (store.level === 'HL') {
		matchedCourse = foo?.HL;
	}
	$: match = $gradeBoundaryData.find((course) => course.name === fullName);

	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: grade = calculateGrade(store, matchedCourse);
	$: awardedMark = boundary.length > 1 ? boundary[parseInt($timezone) - 1] : boundary[0];
	$: if (!matchedCourse || !match || !awardedMark) awardedMark = 0;

	let url = new URL($page.url);
	$: {
		let short;
		$courses.forEach((c) => {
			if (store.name === c.name) {
				short = c.short;
			}
		});
		url.pathname = '/subjects/' + short;

		if (store.level === 'HL') {
			url.searchParams.set('lvl', 'HL');
		} else {
			url.searchParams.set('lvl', 'SL');
		}
	}
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
	<Groupstat {sufficientInformation} {grade} {match} {boundary} {awardedMark} />
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
