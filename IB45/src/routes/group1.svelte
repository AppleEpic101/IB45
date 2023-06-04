<script>
	import Slider from './slider.svelte';
	import data from './assets/Group1/LanguageA.json';
	import gradeBoundary from './assets/Group1/LanguageAGradeBoundaries-M22.json';
	import { onMount, onDestroy } from 'svelte';

	const LitLanguages = ['English', 'Spanish', 'French', 'German'];
	let subjects = ['Language A: Literature', 'Language A: Language And Literature'];

	let courses = Object.keys(data).map((courseName) => ({
		name: courseName,
		assessments: data[courseName].assessments
	}));
	let boundaries = Object.keys(gradeBoundary).map((courseName) => ({
		name: courseName,
		TZ: gradeBoundary[courseName].TZ
	}));

	let sliderPosition = [];
	let boundary = [];

	export let groupNumber = 1;
	let name, language;
	export let level;

	let shortName;
	let grade;
	let fullName;
	export let awardedMark;

	function saveToLocalStorage() {
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.setItem('name' + groupNumber, name);
			localStorage.setItem('level' + groupNumber, level);
			localStorage.setItem('language' + groupNumber, language);
			localStorage.setItem('sliderPosition' + groupNumber, JSON.stringify(sliderPosition));
		}
	}

	onMount(() => {
		name = localStorage.getItem('name' + groupNumber) ?? '';
		level = localStorage.getItem('level' + groupNumber) ?? '';
		language = localStorage.getItem('language' + groupNumber) ?? '';
		let storedSliderPosition = localStorage.getItem('sliderPosition' + groupNumber);
		sliderPosition = storedSliderPosition ? JSON.parse(storedSliderPosition) : [];
	});

	onDestroy(saveToLocalStorage);

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
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group {groupNumber}: Language and Literature
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
