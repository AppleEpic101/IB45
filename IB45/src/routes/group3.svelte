<script>
	import Slider from './slider.svelte';
	import data from './assets/courses.json';
	import gradeBoundaryM19 from './assets/Grade_BoundariesM19';
	import gradeBoundaryM22 from './assets/Grade_BoundariesM22';
	import gradeBoundaryN22 from './assets/Grade_BoundariesN22';
	import { onMount, onDestroy } from 'svelte';

	let subjects = [
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
	let SLOnly = ['Environmental Systems And Societies', 'World Religions'];

	let regions = ['Africa And Middle East', 'Americas', 'Asia And Oceania', 'Europe'];

	let sliderPosition = [];
	export let gradeBoundary;
	let boundary = [];
	let boundaries;

	let courses = Object.keys(data).map((courseName) => ({
		name: courseName,
		assessments: data[courseName].assessments
	}));

	$: {
		if(gradeBoundary == 'M19') {
			boundaries = Object.keys(gradeBoundaryM19).map((courseName) => ({
				name: courseName,
				TZ: gradeBoundaryM19[courseName].TZ
			}));
		}
		else if (gradeBoundary == 'M22') {
			boundaries = Object.keys(gradeBoundaryM22).map((courseName) => ({
				name: courseName,
				TZ: gradeBoundaryM22[courseName].TZ
			}));
		} else {
			boundaries = Object.keys(gradeBoundaryN22).map((courseName) => ({
				name: courseName,
				TZ: gradeBoundaryN22[courseName].TZ
			}));
		}
		boundary = [];
	}

	let name;
	let region = '';
	export let level;

	export let groupNumber = 3;
	let shortName;
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

	$: sufficientInformation = !(
		(shortName == 'HL History' && region == '') ||
		name == '' ||
		level == ''
	);
	$: shortName = level + ' ' + name;
	$: fullName = level + ' ' + name + ' ' + region;
	$: {
		grade = 0;
		if (matchedCourse !== undefined) {
			matchedCourse.assessments.forEach((assessment, i) => {
				grade += (sliderPosition[i] / assessment.maxMarks) * assessment.weight * 100;
			});
		}

		grade = Math.round(grade);
	}

	$: matchedCourse = courses.find((course) => course.name === shortName);
	$: match = boundaries.find((course) => course.name === fullName.trim());

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
	$: {
		if (name === 'History' && level === 'SL') region = '';
	}

	$: {
		if (SLOnly.includes(name) && level == 'HL') level = 'SL';
	}

	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
	$: if (!matchedCourse || !match) awardedMark = 0;

	function reset() {
		if (matchedCourse !== undefined)
			sliderPosition = matchedCourse.assessments.map((assessment) =>
				Math.trunc(assessment.maxMarks / 2)
			);
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
	<select bind:value={name} on:change={reset}>
		<option value="">Enter subject</option>
		{#each subjects as subject}
			<option value={subject}>{subject}</option>
		{/each}
	</select>

	<select bind:value={level} on:change={reset}>
		<option value="">Enter level</option>
		{#if !SLOnly.includes(name)}
			<option value="HL">HL</option>
		{/if}
		<option value="SL">SL</option>
	</select>

	{#if name === 'History' && level === 'HL'}
		<select bind:value={region} on:change={reset}>
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
					bind:value={sliderPosition[i]}
				/>
			{/each}
		{/if}
	</div>
	<div class="stats">
		{#if sufficientInformation}
			Grade: {grade} / 100
			{#if match}
				<div>
					{gradeBoundary}&nbsp;&nbsp;&nbsp;&nbsp;
					{#if boundary.length == 1}
						Timezone 0: {boundary[0]}
					{:else}
						{#each boundary as b, i}
							Timezone {i + 1}: {b} &nbsp&nbsp&nbsp&nbsp
						{/each}
					{/if}
				</div>
				Awarded Mark: {awardedMark}
			{:else}
				<h4>Boundary Not Found.</h4>
			{/if}
		{:else}
			<h4>Please provide more details</h4>
		{/if}
	</div>
</div>
