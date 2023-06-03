<script>
	import Slider from './slider.svelte';
	import data from './assets/TOK/tok.json';
	import gradeBoundary from './assets/TOK/tokGradeBoundaries.json';

	let courses = Object.keys(data).map((courseName) => ({
		name: courseName,
		assessments: data[courseName].assessments
	}));
	let boundaries = Object.keys(gradeBoundary).map((courseName) => ({
		name: courseName,
		TZ: gradeBoundary[courseName].TZ
	}));

	const letterGrades = ['E', 'D', 'C', 'B', 'A'];
	let sliderPosition = [];
	let boundary = [];

	let grade;
	let eeRaw;
	export let ee;
	let fullName = 'Theory Of Knowledge';
	export let awardedMark;

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	if (isLocalStorageAvailable) {
		let storedSliderPosition = localStorage.getItem('sliderPositionTOK');
		sliderPosition = storedSliderPosition ? JSON.parse(storedSliderPosition) : [];
		eeRaw = localStorage.getItem('sliderPositionEE');
	}

	$: {
		if (isLocalStorageAvailable) {
			localStorage.setItem('sliderPositionTOK', JSON.stringify(sliderPosition));
			localStorage.setItem('sliderPositionEE', eeRaw);
		}
	}

	$: {
		grade = sliderPosition[0] + sliderPosition[1];
	}

	$: matchedCourse = courses.find((course) => course.name === fullName);
	$: match = boundaries.find((course) => course.name === fullName);

	$: {
		// tok
		if (match !== undefined) {
			match.TZ.forEach((arr, i) => {
				boundary[i] = 0;
				arr.forEach((element) => {
					if (grade >= element) {
						boundary[i]++;
					}
				});
				boundary[i] = letterGrades[boundary[i] - 1];
			});
		}
	}

	$: {
		const b = boundaries.find((course) => course.name == 'Extended Essay').TZ;
		let x = 0;
		b.forEach((arr, i) => {
			arr.forEach((element) => {
				if (eeRaw >= element) {
					x++;
				}
			});
		});
		ee = letterGrades[x - 1];
		console.log(b);
	}
	$: awardedMark = boundary[0];
</script>

<div class="group">
	<h2>Theory Of Knowledge</h2>
	<div class="content">
		{#each matchedCourse.assessments as assessment, i}
			<Slider
				max={assessment.maxMarks}
				name={assessment.name}
				weight={assessment.weight}
				bind:value={sliderPosition[i]}
			/>
		{/each}
	</div>
	<div>
		Grade: {grade} / 30 <br />Awarded Mark: {awardedMark}
	</div>
	<h2>Extended Essay</h2>
	<div class="content">
		<Slider max="34" name="Extended Essay" weight="1" bind:value={eeRaw} />
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
