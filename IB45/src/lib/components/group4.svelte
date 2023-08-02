<script>
	import { group4, group6, courses, gradeBoundaryData } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';

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

	$: matchedCourse = $courses.find((course) => course.name === fullName);
	$: match = $gradeBoundaryData.find((course) => course.name === fullName);

	$: {
		if (SLOnly.includes(store.name) && store.level == 'HL') store.level = 'SL';
	}

	$: grade = calculateGrade(store, matchedCourse);
	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !match) awardedMark = 0;

	function reset() {
		if (matchedCourse !== undefined)
			store.sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
	}
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Sciences
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
