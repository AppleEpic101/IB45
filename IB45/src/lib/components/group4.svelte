<script>
	import { group4, group6, courses, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';
	import Dropdown from './dropdown.svelte';
	import SelectedGroup6 from '$lib/components/selectedGroup6.svelte';

	const subjects = [
		'Biology',
		'Chemistry',
		'Computer Science',
		'Design Technology',
		'Environmental Systems And Societies',
		'Physics',
		'Sports, Excercise And Health Science'
	];

	const SLOnly = ['Environmental Systems And Societies'];

	export let groupNumber = 4;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group4);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group4 = JSON.stringify(store);
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

	$: {
		if (SLOnly.includes(store.name) && store.level == 'HL') {
			store.level = 'SL';
		}
	}

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: awardedMark = boundary.length > 1 ? boundary[parseInt($timezone) - 1] : boundary[0];
	$: if (!matchedCourse || !match || !awardedMark) awardedMark = 0;
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Sciences
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
