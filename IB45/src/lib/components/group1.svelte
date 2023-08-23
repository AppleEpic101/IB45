<script>
	import { group1, group6, courses, gradeBoundaryData, timezone } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import { onDestroy } from 'svelte';
	import Groupstat from '$lib/components/groupstat.svelte';
	import Slider from '$lib/components/slider.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import SelectedGroup6 from '$lib/components/selectedGroup6.svelte';

	onDestroy(() => {
		if (groupNumber == 6)
			$group6 = '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}';
	});

	const languages = [
		'English',
		'French',
		'Spanish',
		'Arabic',
		'Chinese',
		'Catalan',
		'Danish',
		'Dutch',
		'Finnish',
		'German',
		'Hindi',
		'Indonesian',
		'Italian',
		'Japanese',
		'Korean',
		'Lithuanian',
		'Malay',
		'Modern Greek',
		'Norwegian',
		'Polish',
		'Portuguese',
		'Russian',
		'Swedish',
		'Tamil',
		'Thai',
		'Turkish',
		'Vietnamese'
	];

	const subjects = ['Language A: Literature', 'Language A: Language And Literature'];

	export let groupNumber = 1;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group1);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group1 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '' && store.language != '';

	$: fullName = store.level + ' ' + store.language + ' ' + store.name;

	$: foo = $courses.find((course) => course.name === store.name);
	let matchedCourse;
	$: if (store.level === 'SL') {
		matchedCourse = foo?.SL;
	} else if (store.level === 'HL') {
		matchedCourse = foo?.HL;
	}
	$: matchedLang = $gradeBoundaryData.find((course) => course.name === fullName); // HL English Language A: Language And Literature

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(matchedLang, boundary, grade);
	$: awardedMark = boundary.length > 1 ? boundary[parseInt($timezone) - 1] : boundary[0];
	$: if (!matchedCourse || !matchedLang || !awardedMark) awardedMark = 0;
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Studies In Language And Literature
		{:else}
			{fullName}
		{/if}
	</h2>

	{#if groupNumber == 6}
		<SelectedGroup6 />
	{/if}
	<Dropdown str="Enter subject" bind:value={store.name} arr={subjects} />
	<Dropdown str="Enter level" bind:value={store.level} arr={['HL', 'SL']} />
	<Dropdown str="Enter language" bind:value={store.language} arr={languages} />

	<div class="content">
		{#if sufficientInformation && foo}
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

	<Groupstat {sufficientInformation} {grade} match={matchedLang} {boundary} {awardedMark} />
</div>

<link rel="stylesheet" href="/style/group.css" />
