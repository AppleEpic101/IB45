<script>
	import Slider from './slider.svelte';
	import data from './assets/courses.json';
	import gradeBoundary from './assets/Grade_BoundariesM22.json';

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
	export let corePoints;

	const a = ['AA', 'AB', 'BA'];
	const b = ['AC', 'AD', 'BB', 'CA', 'DA', 'BC', 'CB'];
	const c = ['BD', 'CC', 'DB'];

	$: {
		let combine = awardedMark + ee;
		if (a.includes(combine)) corePoints = 3;
		else if (b.includes(combine)) corePoints = 2;
		else if (c.includes(combine)) corePoints = 1;
		else corePoints = 0;
	}

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	if (isLocalStorageAvailable) {
		let storedSliderPosition = localStorage.getItem('sliderPositionTOK');
		sliderPosition = storedSliderPosition ? JSON.parse(storedSliderPosition) : [0, 0];
		eeRaw = localStorage.getItem('sliderPositionEE') ?? 0;
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
	<div class="stats">
		Grade: {grade} / 30 <br />Awarded Mark: {awardedMark}
	</div>
	<h2>Extended Essay</h2>
	<div class="content">
		<Slider max="34" name="Extended Essay" weight="1" bind:value={eeRaw} />
	</div>
	<div class="stats">
		Grade: {eeRaw} / 34 <br /> Awarded Mark: {ee}
	</div>
	<br />
	<div class="stats">
		Core Points: {corePoints}
	</div>
</div>
