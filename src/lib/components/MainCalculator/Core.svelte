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
	import GradeResults from '$lib/components/MainCalculator/GradeResults.svelte';

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

	let showTok = true;
	let showEe = true;
	function toggleShowTok() {
		showTok = !showTok;
	}
	function toggleShowEe() {
		showEe = !showEe;
	}
</script>

<div class="main">
	<div class="tok">
		<h2 class="groupTitle">Theory Of Knowledge</h2>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			class="toggle-button"
			class:flipped={!showTok}
			on:click={toggleShowTok}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					toggleShowTok();
				}
			}}
		>
			<circle
				cx="31.9997"
				cy="31.9998"
				r="31.5"
				fill="var(--color-surface-variant)"
				stroke="var(--color-border)"
			/>
			<path
				d="M30.2319 43.7676C31.2082 44.7439 32.7911 44.7439 33.7674 43.7676L49.6773 27.8577C50.6536 26.8814 50.6536 25.2985 49.6773 24.3222C48.701 23.3459 47.1181 23.3459 46.1418 24.3222L31.9996 38.4643L17.8575 24.3222C16.8812 23.3459 15.2983 23.3459 14.322 24.3222C13.3456 25.2985 13.3456 26.8814 14.322 27.8577L30.2319 43.7676ZM31.9996 41.9998H29.4996V41.9999H31.9996H34.4996V41.9998H31.9996Z"
				fill="var(--color-text-main)"
			/>
		</svg>
		{#if !showTok}
			<GradeResults
				isCondensed={true}
				grades={[tokPredictedGrade]}
				predictedGrade={tokGrade}
				score={tokPredictedScore}
				name={$selectedBoundaryId}
				isCore={true}
				maxScore={30}
			/>
		{:else}
			<div class="grade-io">
				<div class="grade-results">
					<GradeResults
						grades={[tokPredictedGrade]}
						predictedGrade={tokGrade}
						score={tokPredictedScore}
						name={$selectedBoundaryId}
						isCore={true}
						maxScore={30}
					/>
				</div>
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
			</div>
		{/if}

		<a href="/subjects/theory-of-knowledge" target="_blank"
			><button class="goto">Goto subject page</button></a
		>
	</div>

	<br />
	<br />

	<div class="ee">
		<h2 class="groupTitle">Extended Essay</h2>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			class="toggle-button"
			class:flipped={!showEe}
			on:click={toggleShowEe}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					toggleShowEe();
				}
			}}
		>
			<circle
				cx="31.9997"
				cy="31.9998"
				r="31.5"
				fill="var(--color-surface-variant)"
				stroke="var(--color-border)"
			/>
			<path
				d="M30.2319 43.7676C31.2082 44.7439 32.7911 44.7439 33.7674 43.7676L49.6773 27.8577C50.6536 26.8814 50.6536 25.2985 49.6773 24.3222C48.701 23.3459 47.1181 23.3459 46.1418 24.3222L31.9996 38.4643L17.8575 24.3222C16.8812 23.3459 15.2983 23.3459 14.322 24.3222C13.3456 25.2985 13.3456 26.8814 14.322 27.8577L30.2319 43.7676ZM31.9996 41.9998H29.4996V41.9999H31.9996H34.4996V41.9998H31.9996Z"
				fill="var(--color-text-main)"
			/>
		</svg>
		{#if !showEe}
			<GradeResults
				isCondensed={true}
				grades={[eePredictedGrade]}
				predictedGrade={eeGrade}
				score={eePredictedScore}
				name={$selectedBoundaryId}
				isCore={true}
				maxScore={34}
			/>
		{:else}
			<div class="grade-io">
				<div class="grade-results">
					<GradeResults
						grades={[eePredictedGrade]}
						predictedGrade={eeGrade}
						score={eePredictedScore}
						name={$selectedBoundaryId}
						isCore={true}
						maxScore={34}
					/>
				</div>
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
			</div>
		{/if}

		<a href="/subjects/extended-essay" target="_blank"
			><button class="goto">Goto subject page</button></a
		>
		<br /><br />
	</div>

	<div class="core-points">
		<b>Core Points: {coreGrade}</b>
	</div>
</div>

<style>
	.main {
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		margin-bottom: 10px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		background-color: var(--color-surface);
		position: relative;
	}

	.groupTitle {
		font-size: 1.75rem;
		padding-bottom: 10px;
		margin: 0;
	}

	.tok,
	.ee {
		position: relative;
	}

	.toggle-button {
		cursor: pointer;
		position: absolute;
		right: calc(-1.5rem + 8px);
		top: calc(-1.5rem + 10px);
		width: 56px;
		filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
		transform: rotate(0deg);
		transition: transform 0.5s;
	}

	.flipped {
		transform: rotate(180deg);
	}

	.gradeSelectors {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 10px;
		margin-bottom: 15px;
	}

	.grade-results {
		margin-top: 1rem;
	}

	@media (min-width: 53rem) {
		.grade-io {
			display: flex;
			justify-content: left;
			align-items: start;
		}

		.grade-results {
			margin-top: 10px;
			margin-right: 0.5rem;
		}

		.tok .gradeSelectors {
			max-width: 400px;
		}
	}

	.core-points {
		background-color: var(--color-surface-variant);
		border: 1px solid var(--color-border);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		width: fit-content;
		padding: 0.5rem 0.75rem;
		margin: 0 0.5rem 0.5rem 0;
	}

	.goto {
		transition: all 0.2s ease;
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
		border: 1px solid var(--color-border);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		margin-top: 8px;
		border-radius: 10px;
		font-weight: bolder;

		&:hover {
			background-color: var(--color-primary-dark);
			color: white;
			cursor: pointer;
		}
	}
</style>
