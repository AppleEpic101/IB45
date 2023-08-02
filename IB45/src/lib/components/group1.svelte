<script>
	import { group1, group6, courses, gradeBoundaryData } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Groupstat from '$lib/components/groupstat.svelte';
	import Slider from '$lib/components/slider.svelte';

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
	$: shortName = store.level + ' ' + store.name;
	$: fullName = store.level + ' ' + store.language + ' ' + store.name;

	$: matchedCourse = $courses.find((course) => course.name === shortName); // HL Language A: Language And Literature
	$: matchedLang = $gradeBoundaryData.find((course) => course.name === fullName); // HL English Language A: Language And Literature

	function reset() {
		if (matchedCourse !== undefined) {
			store.sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
		}
		boundary = [];
	}

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(matchedLang, boundary, grade);
	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !matchedLang) awardedMark = 0;
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Studies In Language And Literature
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
		<option value="HL">HL</option>
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

<link rel="stylesheet" href="/style/group.css" />
