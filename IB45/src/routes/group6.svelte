<script>
	import Slider from './slider.svelte';
	import data from './assets/Group6/group6.json';
	import gradeBoundary from './assets/Group6/Group6GradeBoundaries-M22.json';

	import Group1 from './group1.svelte';
	import Group2 from './group2.svelte';
	import Group3 from './group3.svelte';
	import Group4 from './group4.svelte';

	let subjects = ['Dance', 'Film', 'Music', 'Theatre', 'Visual Arts'];

	let courses = Object.keys(data).map((courseName) => ({
		name: courseName,
		assessments: data[courseName].assessments
	}));
	let boundaries = Object.keys(gradeBoundary).map((courseName) => ({
		name: courseName,
		TZ: gradeBoundary[courseName].TZ
	}));

	export let groupSelection = '6';
	let sliderPosition = [];
	let boundary = [];

	const groupNumber = 6;
	let name;
	let level;

	let grade;
	let fullName;
	export let awardedMark;

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	if (isLocalStorageAvailable) {
		name = localStorage.getItem('name' + groupNumber) ?? '';
		level = localStorage.getItem('level' + groupNumber) ?? '';
		let storedSliderPosition = localStorage.getItem('sliderPosition' + groupNumber);
		sliderPosition = storedSliderPosition ? JSON.parse(storedSliderPosition) : [];
	}

	$: {
		if (isLocalStorageAvailable) {
			localStorage.setItem('name' + groupNumber, name);
			localStorage.setItem('level' + groupNumber, level);
			localStorage.setItem('sliderPosition' + groupNumber, JSON.stringify(sliderPosition));
		}
	}

	$: sufficientInformation = name != '' && level != '';
	$: fullName = level + ' ' + name;
	$: {
		grade = 0;
		if (matchedCourse !== undefined) {
			matchedCourse.assessments.forEach((assessment, i) => {
				grade += (sliderPosition[i] / assessment.maxMarks) * assessment.weight * 100;
			});
		}

		grade = Math.trunc(grade);
	}

	$: matchedCourse = courses.find((course) => course.name === fullName);
	$: match = boundaries.find((course) => course.name === fullName);

	$: {
		// calculate grade boundary
		if (match !== undefined) {
			match.TZ.forEach((arr, i) => {
				boundary[i] = 0;
				arr.forEach((element) => {
					if (grade >= element) {
						boundary[i]++;
					}
				});
			});
		}
	}

	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;

	function reset() {
		if (matchedCourse !== undefined)
			sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
	}
</script>

{#if groupSelection == '6'}
	<div class="group">
		<h2>
			{#if !sufficientInformation}
				Group 6: The Arts
			{:else}
				{fullName}
			{/if}
		</h2>
		<select bind:value={name} on:change={reset}>
			<option value="">Enter subject</option>
			{#each subjects as subject}
				<option value={subject}>{subject}</option>
			{/each}
		</select>

		<select bind:value={level} on:change={reset}>
			<option value="">Enter level</option>
			<option value="HL">HL</option>
			<option value="SL">SL</option>
		</select>

		<div class="content">
			{#if !sufficientInformation}
				<h2>Please provide more details.</h2>
			{:else if matchedCourse}
				{#each matchedCourse.assessments as assessment, i}
					<Slider
						max={assessment.maxMarks}
						name={assessment.name}
						weight={assessment.weight}
						bind:value={sliderPosition[i]}
					/>
				{/each}
			{/if}
		</div>
		<div>
			{#if sufficientInformation}
				Grade: {grade} / 100 &nbsp&nbsp&nbsp&nbsp
				{#if boundary.length == 1}
					Timezone 0:&nbsp{boundary[0]}
				{:else}
					{#each boundary as b, i}
						Timezone {i + 1}:&nbsp{b} &nbsp&nbsp&nbsp&nbsp
					{/each}
				{/if}
				<br />
				Awarded Mark: {awardedMark}
			{/if}
		</div>
	</div>
{:else if groupSelection == '1'}
	<Group1 {groupNumber} />
{:else if groupSelection == '2'}
	<Group2 {groupNumber} />
{:else if groupSelection == '3'}
	<Group3 {groupNumber} />
{:else if groupSelection == '4'}
	<Group4 {groupNumber} />
{/if}

<style>
	.content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: left;
	}

	.group {
		border: 2px solid black;
		margin: 0 20px 20px 0;
		padding: 0 0 20px 20px;
	}
</style>
