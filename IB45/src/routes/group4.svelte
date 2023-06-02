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

	let courses = [];
	Object.keys(data).forEach((courseName) => {
		const course = {
			name: courseName,
			assessments: data[courseName].assessments
		};
		courses.push(course);
	});

	let boundaries = [];
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

	export let groupNumber = 4;
	let grade;
	export let fullName;
	export let awardedMark;

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
		if (match !== undefined) {
			match.TZ.forEach((arr, i) => {
				if (grade >= arr[6]) boundary[i] = 7;
				else if (grade >= arr[5]) boundary[i] = 6;
				else if (grade >= arr[4]) boundary[i] = 5;
				else if (grade >= arr[3]) boundary[i] = 4;
				else if (grade >= arr[2]) boundary[i] = 3;
				else if (grade >= arr[1]) boundary[i] = 2;
				else boundary[i] = 1;
			});
		}
	}

	$: {
		if (SLOnly.includes(name) && level == 'HL') level = 'SL';
	}

	$: awardedMark = Math.min(...boundary);

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
