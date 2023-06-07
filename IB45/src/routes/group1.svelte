<script>
	import Slider from './slider.svelte';
	import data from './assets/courses.json';
	import gradeBoundaryM22 from './assets/Grade_BoundariesM22';
	import gradeBoundaryN22 from './assets/Grade_BoundariesN22';
	import { onMount, onDestroy } from 'svelte';

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
	let subjects = ['Language A: Literature', 'Language A: Language And Literature'];

	let courses = Object.keys(data).map((courseName) => ({
		name: courseName,
		assessments: data[courseName].assessments
	}));
	let boundaries;
	export let gradeBoundary;
	let sliderPosition = [];
	let boundary = [];

	$: {
		if(gradeBoundary == "M22") {
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

	export let groupNumber = 1;
	let name = '',
		language = '';
	export let level = '';

	let shortName;
	let grade;
	let fullName;
	export let awardedMark;

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
	if (isLocalStorageAvailable) {
		name = localStorage.getItem('name' + groupNumber) ?? '';
		level = localStorage.getItem('level' + groupNumber) ?? '';
		language = localStorage.getItem('language' + groupNumber) ?? '';
		let storedSliderPosition = localStorage.getItem('sliderPosition' + groupNumber);
		sliderPosition = storedSliderPosition ? JSON.parse(storedSliderPosition) : [];
	}
	
	$: {
		if (isLocalStorageAvailable) {
			localStorage.setItem('name' + groupNumber, name);
			localStorage.setItem('level' + groupNumber, level);
			localStorage.setItem('language' + groupNumber, language);
			localStorage.setItem('sliderPosition' + groupNumber, JSON.stringify(sliderPosition));
		}
	}

	$: sufficientInformation = name != '' && level != '' && language != '';
	$: shortName = level + ' ' + name;

	$: if (sufficientInformation) fullName = level + ' ' + language + ' ' + name;
	$: {
		grade = 0;
		if (matchedCourse !== undefined) {
			matchedCourse.assessments.forEach((assessment, i) => {
				grade += (sliderPosition[i] / assessment.maxMarks) * assessment.weight * 100;
			});
		}

		grade = Math.round(grade);
	}

	$: matchedCourse = courses.find((course) => course.name === shortName); // HL Language A: Language And Literature
	$: matchedLang = boundaries.find((course) => course.name === fullName); // HL English Language A: Language And Literature
	$: {
		// calculate grade boundary
		if (matchedLang !== undefined) {
			matchedLang.TZ.forEach((arr, i) => {
				boundary[i] = 0;
				arr.forEach((element) => {
					if (grade >= element) {
						boundary[i]++;
					}
				});
			});
		}
	}

	function reset() {
		// default slider values
		if (matchedCourse !== undefined)
			sliderPosition = matchedCourse.assessments.map((assessment) => assessment.maxMarks / 2);
	}

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

	<select bind:value={language} on:change={reset}>
		<option value="">Enter language</option>
		{#each LitLanguages as language}
			<option value={language}>{language}</option>
		{/each}
	</select>

	<div class="content">
		{#if matchedCourse}
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
			{#if matchedLang}
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

<link rel="stylesheet" href="group.css" />
