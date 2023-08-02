<script>
	import { group5, courses, gradeBoundaryData } from '$lib/stores/store.js';
	import { calculateGradeBoundary, calculateGrade } from '$lib/group.js';
	import Slider from './slider.svelte';
	import Groupstat from './groupstat.svelte';

	let subjects = [
		'Mathematics: Analysis And Approaches',
		'Mathematics: Applications And Interpretation'
	];

	export let groupNumber = 5;
	export let awardedMark;

	let store = JSON.parse($group5);
	$: {
		$group5 = JSON.stringify(store);
	}

	$: sufficientInformation = store.name != '' && store.level != '';
	$: fullName = store.level + ' ' + store.name;

	$: matchedCourse = $courses.find((course) => course.name === fullName);
	$: match = $gradeBoundaryData.find((course) => course.name === fullName);

	function reset() {
		if (matchedCourse !== undefined)
			store.sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
	}

	$: boundary = calculateGradeBoundary(match, boundary, grade);
	$: grade = calculateGrade(store, matchedCourse);
	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !match) awardedMark = 0;
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Mathematics
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
