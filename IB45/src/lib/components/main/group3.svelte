<script>
	import { group3, group6, courses, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
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

	const info = $courses.find((c) => c.name === 'info');
	const subjects = info.info.group3;
	const SLOnly = info.info.SLOnly;
	const regions = info.info.region;

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

	$: foo = $courses.find((course) => course.name === store.name);
	let matchedCourse;
	$: if (store.level === 'SL') {
		matchedCourse = foo?.SL;
	} else if (store.level === 'HL') {
		matchedCourse = foo?.HL;
	}
	$: match = $gradeBoundaryData.find((course) => course.name === fullName.trim());

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

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(match, boundary, grade);
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
