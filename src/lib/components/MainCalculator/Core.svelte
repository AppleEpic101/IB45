<script>
	export let tokGrade;
	export let eeGrade;
	export let coreGrade;
	$: tokGrade = letterGrades[tokPredictedGrade];
	$: eeGrade = letterGrades[eePredictedGrade];

	import courses from '$lib/assets/courses.json';
	import {
		getPredictorSelectedOptions,
		selectedBoundary,
		selectedBoundaryId
	} from '$lib/stores/stores.js';

	import ScoreSelector from '$lib/components/MainCalculator/ScoreSelector.svelte';
	import GradeResults from '$lib/components/MainCalculator/GroupGradeResults.svelte';

	let letterGrades = ['E', 'D', 'C', 'B', 'A'];

	let settings = getPredictorSelectedOptions(6);
	$settings['chosenScores'] = $settings['chosenScores'] || { tok: [0, 0], ee: [0] };

	let tokAssessments = courses['Theory Of Knowledge'].SL,
		tokBoundaries = $selectedBoundary['Theory Of Knowledge'].TZ[0],
		tokPredictedScore,
		tokPredictedGrade;

	$: {
		tokPredictedScore =
			$settings['chosenScores']['tok'][0] * 2 + $settings['chosenScores']['tok'][1];

		for (let i = 0; i < tokBoundaries.length; i++) {
			if (tokPredictedScore >= tokBoundaries[i]) {
				tokPredictedGrade = i;
			}
		}
	}

	let eeAssesments = courses['Extended Essay'].SL,
		eeBoundaries = $selectedBoundary['Extended Essay'].TZ[0],
		eePredictedScore,
		eePredictedGrade;
	$: {
		eePredictedScore = $settings['chosenScores']['ee'][0];
		for (let i = 0; i < eeBoundaries.length; i++) {
			if (eePredictedScore >= eeBoundaries[i]) {
				eePredictedGrade = i;
			}
		}
	}

	$: {
		if (tokPredictedGrade == 0 || eePredictedGrade == 0) {
			coreGrade = 0;
		} else {
			let cumScore = tokPredictedGrade + eePredictedGrade;
			if (cumScore >= 7) {
				coreGrade = 3;
			} else if (cumScore >= 5) {
				coreGrade = 2;
			} else if (cumScore >= 4) {
				coreGrade = 1;
			} else {
				coreGrade = 0;
			}
		}
	}
</script>

<div class="main">
	<h2 class="groupTitle">Theory Of Knowledge</h2>
	<div class="gradeSelectors">
		{#each tokAssessments as assessment, i}
			<ScoreSelector
				name={assessment.name}
				maxMarks={assessment.maxMarks}
				weight={assessment.weight}
				bind:value={$settings['chosenScores']['tok'][i]}
			/>
		{/each}
	</div>
	<GradeResults
		grades={[tokPredictedGrade]}
		predictedGrade={tokGrade}
		score={tokPredictedScore}
		name={$selectedBoundaryId}
		isCore={true}
		maxScore={30}
	/>
	<a href="/subjects/theory-of-knowledge" target="_blank"
		><button class="goto">Goto subject page</button></a
	>
	<br />
	<br />
	<h2 class="groupTitle">Extended Essay</h2>
	<div class="gradeSelectors">
		{#each eeAssesments as assessment, i}
			<ScoreSelector
				name={assessment.name}
				maxMarks={assessment.maxMarks}
				weight={assessment.weight}
				bind:value={$settings['chosenScores']['ee'][i]}
			/>
		{/each}
	</div>
	<GradeResults
		grades={[eePredictedGrade]}
		predictedGrade={eeGrade}
		score={eePredictedScore}
		name={$selectedBoundaryId}
		isCore={true}
		maxScore={34}
	/>
	<a href="/subjects/extended-essay" target="_blank"
		><button class="goto">Goto subject page</button></a
	>
	<br /><br />
	<div class="core-points">
		<b>Core Points: {coreGrade}</b>
	</div>
</div>

<style>
	.main {
		border-radius: 0.5rem;
		border: 1px solid #d1d5db;
		padding: 1rem;
		background-color: #ffffff;
	}

	.groupTitle {
		margin-top: 0;
	}

	.gradeSelectors {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 10px;
		margin-bottom: 15px;
	}

	.core-points {
		background-color: #e0f2fe;
		border: 1px solid #d1d5db;
		border-radius: 5px;
		width: fit-content;
		padding: 0.5rem;
		margin: 0 0.5rem 0.5rem 0;
	}

	.goto {
		transition: all 0.2s ease;
		background-color: #e0f2fe;
		border: 1px solid #d1d5db;
		padding: 0.5rem;
		margin-top: 15px;
		border-radius: 10px;
		font-weight: bolder;

		&:hover {
			background-color: #053f54;
			color: white;
			cursor: pointer;
		}
	}
</style>
