<script>
	import { group2, group6, courses, gradeBoundaryData } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';

	const LitLanguages = [
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
	let fullName, shortName, grade;
	export let awardedMark;

	let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group2);
	$: {
		if (groupNumber == 6) $group6 = JSON.stringify(store);
		else $group2 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '' && store.language != '';
	$: shortName = store.level + ' ' + store.name;
	$: if (sufficientInformation) fullName = store.level + ' ' + store.language + ' ' + store.name;

	$: matchedCourse = $courses.find((course) => course.name === shortName);
	$: matchedLang = $gradeBoundaryData.find((course) => course.name === fullName);

	$: {
		if (SLOnly.includes(store.name) && store.level == 'HL') store.level = 'SL';
	}

	function reset() {
		if (matchedCourse !== undefined) {
			store.sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
		}
		boundary = [];
	}

	$: boundary = calculateGradeBoundary(matchedLang, boundary, grade);
	$: grade = calculateGrade(store, matchedCourse);
	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !matchedLang) awardedMark = 0;
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Language Acquisition
		{:else}
			{fullName}
		{/if}
	</h2>
	<select bind:value={store.name} on:change={reset}>
		<option value="">Enter subject</option>
		{#each subjects as subject}
			<option value={subject}>{subject}</option>
		{/each}
	</select>

	<select bind:value={store.level} on:change={reset}>
		<option value="">Enter level</option>
		{#if !SLOnly.includes(store.name)}
			<option value="HL">HL</option>
		{/if}
		<option value="SL">SL</option>
	</select>

	<select bind:value={store.language} on:change={reset}>
		<option value="">Enter language</option>
		{#each LitLanguages as language}
			<option value={language}>{language}</option>
		{/each}
	</select>

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
