<script>
	import { group3, group6, courses, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';
	import Dropdown from './dropdown.svelte';

	const subjects = [
		'Business Management',
		'Economics',
		'Environmental Systems And Societies',
		'Geography',
		'Global Politics',
		'History',
		'Information Technology In A Global Society',
		'Philosophy',
		'Psychology',
		'Social And Cultural Anthropology',
		'World Religions'
	];
	const SLOnly = ['Environmental Systems And Societies', 'World Religions'];
	const regions = ['Africa And Middle East', 'Americas', 'Asia And Oceania', 'Europe'];

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
		if (SLOnly.includes(store.name) && store.level == 'HL') store.level = 'SL';
	}

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: awardedMark = boundary.length > 1 ? boundary[parseInt($timezone) - 1] : boundary[0];
	$: if (!matchedCourse || !match || !awardedMark) awardedMark = 0;
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

	<Dropdown str="Enter subject" bind:value={store.name} arr={subjects} />
	<Dropdown str="Enter level" bind:value={store.level} arr={['HL', 'SL']} />
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
</div>
