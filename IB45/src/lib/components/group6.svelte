<script>
	import { group6, courses, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import { onDestroy } from 'svelte';
	import Slider from '$lib/components/slider.svelte';
	import Groupstat from '$lib/components/groupstat.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import SelectedGroup6 from '$lib/components/selectedGroup6.svelte';

	onDestroy(() => {
		if (groupNumber == 6)
			$group6 = '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}';
	});

	let subjects = ['Dance', 'Film', 'Music', 'Theatre', 'Visual Arts', 'Literature And Performance'];

	const groupNumber = 6;
	export let awardedMark;

	let store = JSON.parse($group6);
	$: {
		$group6 = JSON.stringify(store);
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

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: awardedMark = boundary.length > 1 ? boundary[parseInt($timezone) - 1] : boundary[0];
	$: if (!matchedCourse || !match || !awardedMark) awardedMark = 0;
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group 6: The Arts
		{:else}
			{fullName}
		{/if}
	</h2>

	<SelectedGroup6 />
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
</div>
