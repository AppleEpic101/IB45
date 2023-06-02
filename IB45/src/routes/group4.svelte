<script>
	import Slider from './slider.svelte';
	import data from './assets/Group4/group4.json';
	import gradeBoundary from './assets/Group4/Group4GradeBoundaries-M22.json';

	let subjects = [
		'Biology',
		'Chemistry',
		'Computer Science',
		'Design Technology',
		'Environmental Systems And Societies',
		'Physics',
		'Sports, Excercise, And Health Science'
	];

	let SLOnly = ['Sports, Excercise, And Health Science'];

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

	let name;
	let level;

	export let groupNumber = 4;
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

	$: {
		if (SLOnly.includes(name) && level == 'HL') level = 'SL';
	}

	$: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;

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
			Group {groupNumber}: Sciences
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
