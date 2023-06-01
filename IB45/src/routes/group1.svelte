<script>
	import Slider from './slider.svelte';
	import data from './assets/Group1/LanguageA.json';
	import gradeBoundary from './assets/Group1/LanguageAGradeBoundaries-M22.json';
	import { onMount } from 'svelte';

	const LitLanguages = ['English', 'Spanish', 'French', 'German'];
	let subjects = ['Language A: Literature', 'Language A: Language And Literature'];

	let courses = [];
	let boundaries = [];
	Object.keys(data).forEach((courseName) => {
		const course = {
			name: courseName,
			assessments: data[courseName].assessments
		};
		courses.push(course);
	});
	Object.keys(gradeBoundary).forEach((courseName) => {
		const L = {
			name: courseName,
			TZ: gradeBoundary[courseName].TZ
		};
		boundaries.push(L);
	});

	export let sliderPosition = [];
	let boundary = [];

	let name;
	let level;
	let language;

	let shortName;
	let grade;
	export let fullName;
	export let awardedMark;

	// // test
	// export let storage;
	// $: storage = {
	// 	name: name,
	// 	level: level,
	// 	language: language,
	// 	sliderValues: sliderPosition
	// };

	// name = storage.name ?? '';
	// level = storage.level ?? '';
	// language = storage.language ?? '';
	// sliderPosition = storage.sliderValues ?? [];

	// // test end

	// LOCAL STORAGE
	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	if (isLocalStorageAvailable) {
		name = localStorage.getItem('name1') ?? '';
		level = localStorage.getItem('level1') ?? '';
		language = localStorage.getItem('language1') ?? '';
		let storedSliderPosition = localStorage.getItem('sliderPosition1');
		sliderPosition = storedSliderPosition ? JSON.parse(storedSliderPosition) : [];
	}

	$: {
		if (isLocalStorageAvailable) {
			localStorage.setItem('name1', name);
			localStorage.setItem('level1', level);
			localStorage.setItem('language1', language);
			localStorage.setItem('sliderPosition1', JSON.stringify(sliderPosition));
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

		grade = Math.trunc(grade);
	}

	$: matchedCourse = courses.find((course) => course.name === shortName); // HL Language A: Language And Literature
	$: matchedLang = boundaries.find((course) => course.name === fullName); // HL English Language A: Language And Literature
	$: {
		// calculate grade boundary
		if (matchedLang !== undefined) {
			matchedLang.TZ.forEach((arr, i) => {
				for (let j = 0; j < 7; j++) {
					if (grade >= arr[j]) {
						boundary[i] = j + 1;
					}
				}
			});
		}
	}

	function reset() {
		// default slider values
		if (matchedCourse !== undefined)
			sliderPosition = matchedCourse.assessments.map((assessment) => assessment.maxMarks / 2);
	}

	$: awardedMark = Math.min(...boundary);
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group 1: Language and Literature
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
