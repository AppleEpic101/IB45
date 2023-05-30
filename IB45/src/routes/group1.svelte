<script>
	import Slider from './slider.svelte';
	import data from './assets/LanguageA.json';

	const LitLanguages = ['English', 'Spanish', 'French', 'German'];

	let subjects = ['Language A: Literature', 'Language A: Language And Literature'];

	let courses = [];
	Object.keys(data).forEach((courseName) => {
		const course = {
			name: courseName,
			assessments: data[courseName].assessments
		};
		courses.push(course);
	});

	$: {
		console.log('courses: ');
		console.log(courses);
	}
	let name;
	let level;
	let language;

	let assessmentValues = [];
	// $: console.log(matchedCourse.assessments);

	// $: {
	// 	if (matchedCourse !== undefined)
	// 		assessmentValues = matchedCourse.assessments.map((assessment) => assessment.maxMarks / 2);
	// }
	let paper1Value;
	let paper2Value;
	let hlEssayValue;
	let individualOralValue;

	let shortName;
	export let fullName;
	export let grade;

	$: sufficientInformation = name != '' && level != '' && language != '';
	$: shortName = level + ' ' + name;
	$: fullName = level + ' ' + language + ' ' + name; // display
	$: {
		grade = 0;
		if (matchedCourse !== undefined) {
			matchedCourse.assessments.forEach((assessment, i) => {
				grade += (assessmentValues[i] / assessment.maxMarks) * assessment.weight * 100;
			});
		}

		grade = Math.trunc(grade);
	}
	// $: grade = Math.trunc(
	// 	(paper1Value / 40) * 35 +
	// 		(paper2Value / 30) * 25 +
	// 		(hlEssayValue / 20) * 20 +
	// 		(individualOralValue / 40) * 20
	// );
	$: matchedCourse = courses.find((course) => course.name === shortName);

	$: console.log(matchedCourse);
	$: console.log(shortName);
	$: console.log(assessmentValues);
</script>

<div class="group">
	<h2>
		{#if !sufficientInformation}
			Group 1
		{:else}
			{fullName}
		{/if}
	</h2>
	<select
		bind:value={name}
		on:change={() => {
			if (matchedCourse !== undefined)
				assessmentValues = matchedCourse.assessments.map((assessment) => assessment.maxMarks / 2);
		}}
	>
		<option value="">Enter subject</option>
		{#each subjects as subject}
			<option value={subject}>{subject}</option>
		{/each}
	</select>

	<select
		bind:value={level}
		on:change={() => {
			if (matchedCourse !== undefined)
				assessmentValues = matchedCourse.assessments.map((assessment) => assessment.maxMarks / 2);
		}}
	>
		<option value="">Enter level</option>
		<option value="HL">HL</option>
		<option value="SL">SL</option>
	</select>

	<select
		bind:value={language}
		on:change={() => {
			if (matchedCourse !== undefined)
				assessmentValues = matchedCourse.assessments.map((assessment) => assessment.maxMarks / 2);
		}}
	>
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
					bind:value={assessmentValues[i]}
				/>
			{/each}
		{/if}
	</div>
	<div>
		{#if sufficientInformation}
			Grade: {grade}
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
