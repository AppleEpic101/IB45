<script>
	import { group2, group6, courses, gradeBoundaryData } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';
	import Dropdown from './dropdown.svelte';

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
		'Thai',
		'Turkish',
		'Vietnamese'
	];

	const subjects = [
		'Language A: Literature',
		'Language A: Language And Literature',
		'Language AB Initio',
		'Language B'
	];
	let SLOnly = ['Language AB Initio'];

	export let groupNumber = 2;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group2);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group2 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '' && store.language != '';
	$: shortName = store.level + ' ' + store.name;
	$: fullName = store.level + ' ' + store.language + ' ' + store.name;

	$: matchedCourse = $courses.find((course) => course.name === shortName); // HL Language A: Language And Literature
	$: matchedLang = $gradeBoundaryData.find((course) => course.name === fullName); // HL English Language A: Language And Literature

	$: {
		if (SLOnly.includes(store.name) && store.level == 'HL') {
			store.level = 'SL';
		}
	}

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(matchedLang, boundary, grade);
	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !matchedLang) awardedMark = 0;

	function reset() {
		if (matchedCourse !== undefined) {
			store.sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
		}
		boundary = [];
	}
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Language Acquisition
		{:else}
			{fullName}
		{/if}
	</h2>

	<Dropdown str="Enter subject" bind:value={store.name} arr={subjects} />
	<Dropdown str="Enter level" bind:value={store.level} arr={['HL', 'SL']} />
	<Dropdown str="Enter language" bind:value={store.language} arr={languages} />

	<div class="content">
		{#if sufficientInformation && matchedCourse}
			{#each matchedCourse.assessments as assessment, i}
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
