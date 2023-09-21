<script>
	import { courses, gradeBoundaryData, timezone, tok } from '$lib/stores/store.js';
	import Slider from '$lib/components/slider.svelte';

	const letterGrades = ['E', 'D', 'C', 'B', 'A'];
	let boundary = [];

	export let ee;
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

	let store = JSON.parse($tok);
	$: {
		$tok = JSON.stringify(store);
	}

	const foo = $courses.find((course) => course.name === 'Theory Of Knowledge');
	const bar = $courses.find((course) => course.name === 'Extended Essay');
	const tokAssessments = foo?.SL;
	const eeAssessments = bar?.SL;
	$: tokBoundary = $gradeBoundaryData.find((course) => course.name === 'Theory Of Knowledge');
	$: eeBoundary = $gradeBoundaryData.find((course) => course.name === 'Extended Essay');

	$: tokGrade = store.tok.reduce((acc, curr) => acc + curr, 0);
	$: eeGrade = store.ee.reduce((acc, curr) => acc + curr, 0);

	$: {
		tokBoundary.TZ.forEach((arr, i) => {
			boundary[i] = 0;
			arr.forEach((element) => {
				if (tokGrade >= element) {
					boundary[i]++;
				}
			});
			boundary[i] = letterGrades[boundary[i] - 1];
		});
	}

	$: {
		let x = 0;
		eeBoundary.TZ.forEach((arr, i) => {
			arr.forEach((element) => {
				if (eeGrade >= element) {
					x++;
				}
			});
		});
		ee = letterGrades[x - 1];
	}
	$: awardedMark = boundary.length > 1 ? boundary[parseInt($timezone) - 1] : boundary[0];
</script>

<div class="group">
	<h2>Theory Of Knowledge</h2>
	<div class="content">
		{#each tokAssessments as assessment, i}
			<Slider
				max={assessment.maxMarks}
				name={assessment.name}
				weight={assessment.weight}
				bind:value={store.tok[i]}
			/>
		{/each}
	</div>
	<div class="stats">
		Grade: {tokGrade} / 30
		<div class="awarded">Awarded Mark: {awardedMark}</div>
	</div>
	<br />
	<button class="btn btn-sik"
		><a href="/subjects/theory-of-knowledge" target="_blank">More details</a></button
	>
	<h2>Extended Essay</h2>
	<div class="content">
		{#each eeAssessments as assessment, i}
			<Slider
				max={assessment.maxMarks}
				name={assessment.name}
				weight={assessment.weight}
				bind:value={store.ee[i]}
			/>
		{/each}
	</div>
	<div class="stats">
		Grade: {eeGrade} / 34
		<div class="awarded">Awarded Mark: {ee}</div>
	</div>
	<br />
	<button class="btn btn-sik"
		><a href="/subjects/extended-essay" target="_blank">More details</a></button
	>
	<br />
	<div class="stats">
		<div class="awarded">Core Points: {corePoints}</div>
	</div>
</div>

<style>
	.awarded {
		font-weight: bold;
		font-size: 18px;
	}

	button {
		margin: 0;
		margin-top: 10px;
		margin-bottom: 15px;
	}
</style>
