<script>
	import { group3, group6, courses, gradeBoundaryData } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';

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
	let shortName;
	let grade;
	let fullName;
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

	$: matchedCourse = $courses.find((course) => course.name === shortName);
	$: match = $gradeBoundaryData.find((course) => course.name === fullName.trim());

	$: {
		if ((store.name === 'History' && store.level === 'SL') || store.name !== 'History')
			store.region = '';
	}

	$: {
		if (SLOnly.includes(store.name) && store.level == 'HL') store.level = 'SL';
	}

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !match) awardedMark = 0;

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
			Group {groupNumber}: Individuals And Societies
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

	{#if store.name === 'History' && store.level === 'HL'}
		<select bind:value={store.region} on:change={reset}>
			<option value="">Enter HL History region</option>
			{#each regions as r}
				<option value={r}>{r}</option>
			{/each}
		</select>
	{/if}

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

	<Groupstat {sufficientInformation} {grade} {match} {boundary} {awardedMark} />
</div>
