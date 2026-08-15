<script>
	export let group;
	export let predictedGrade;
	export let level;
	export let summary = {};
	$: level = $settings['level'];

	import courses from '$lib/assets/courses.json';
	import {
		getPredictorSelectedOptions,
		selectedBoundary,
		selectedTimezone,
		selectedBoundaryId
	} from '$lib/stores/stores.js';

	import Select from '$lib/components/MainCalculator/Select.svelte';
	import NotEnoughDetails from '$lib/components/MainCalculator/NotEnoughDetails.svelte';
	import ScoreSelector from '$lib/components/MainCalculator/ScoreSelector.svelte';
	import GradeResults from '$lib/components/MainCalculator/GradeResults.svelte';
	import BoundaryInsight from '$lib/components/MainCalculator/BoundaryInsight.svelte';

	import { constructURL } from '$lib/utils/urls.js';
	import { page } from '$app/stores';

	let settings = getPredictorSelectedOptions(group);
	$settings['chosenScores'] = $settings['chosenScores'] || [];
	$settings['enteredScores'] = $settings['enteredScores'] || [];

	let selectedGroup;
	$: selectedGroup = $settings['groupSixGroup'] !== undefined ? $settings['groupSixGroup'] : group;

	let groupSixOptions = [
		{ value: 5, name: 'Group 6 (Default)' },
		{ value: 0, name: 'Group 1' },
		{ value: 1, name: 'Group 2' },
		{ value: 2, name: 'Group 3' },
		{ value: 3, name: 'Group 4' },
		{ value: 4, name: 'Group 5' }
	];

	let subjects;
	$: {
		subjects = courses.meta[`group${selectedGroup + 1}`];
		if (selectedGroup == 1) {
			subjects = courses.meta.group1
				.concat(subjects)
				.filter((value) => value != 'Literature And Performance');
		}
	}

	$: isLang = courses[$settings['subject']]?.isLang || false;
	let slOnly;
	$: {
		slOnly = courses[$settings['subject']]?.SLOnly || false;
		if (slOnly) {
			$settings['level'] = 'SL';
		}
	}

	$: languages =
		$settings['subject'] == 'Classical Language' ? courses.meta.classical : courses.meta.lang;

	$: console.log(courses.name);

	$: isHistoryHL = $settings['subject'] == 'History' && $settings['level'] == 'HL';

	let sufficientData = false;
	$: {
		sufficientData = $settings['subject'] && $settings['level'];
		if (isLang) {
			sufficientData = sufficientData && $settings['language'];
		}
		if (isHistoryHL) {
			sufficientData = sufficientData && $settings['region'];
		}
	}

	// sets the group title
	let groupTitle = courses.meta.groups[selectedGroup];
	$: {
		if (sufficientData) {
			if (isLang) {
				groupTitle = `${$settings['level']} ${$settings['language'] || ''} ${$settings['subject']}`;
			} else if (isHistoryHL) {
				groupTitle = `${$settings['level']} ${$settings['subject']} ${$settings['region'] || ''}`;
			} else {
				groupTitle = `${$settings['level']} ${$settings['subject']}`;
			}
		} else {
			groupTitle = courses.meta.groups[selectedGroup];
			groupTitle = groupTitle.substring(0, 6) + (group + 1) + groupTitle.substring(7);
		}
	}

	// accesses assessment and grade boundary data
	let assessments, boundaries;
	$: {
		if (sufficientData) {
			let query = groupTitle;
			query = query.trim();
			query = query.replaceAll('  ', ' ');
			assessments = courses[$settings['subject']][`${$settings['level']}`];
			boundaries = $selectedBoundary[query]?.TZ;
			if (!boundaries) {
				boundaries = [];
			}
		}
	}

	const hasEnteredScore = (value) =>
		value !== undefined && value !== null && value !== '' && Number.isFinite(Number(value));

	// grade prediction algorithm
	let predictedScore, predictedTimezoneGrades, inputsComplete, completedAssessments;
	$: {
		completedAssessments = sufficientData
			? assessments.filter(
					(_, index) =>
						$settings['enteredScores'][index] && hasEnteredScore($settings['chosenScores'][index])
			  ).length
			: 0;
		inputsComplete =
			sufficientData && assessments.length > 0 && completedAssessments === assessments.length;

		if (inputsComplete) {
			predictedScore = 0;
			for (let i = 0; i < assessments.length; i++) {
				predictedScore +=
					($settings['chosenScores'][i] / assessments[i].maxMarks) * assessments[i].weight;
			}
			predictedScore *= 100;
			predictedScore = Math.round(predictedScore + 1e-10);
			predictedTimezoneGrades = [];
			for (let boundary of boundaries) {
				let grade = 0;
				for (let i = 0; i < boundary.length; i++) {
					if (predictedScore >= boundary[i]) {
						grade = i + 1;
					}
				}
				predictedTimezoneGrades.push(grade);
			}
			predictedGrade =
				boundaries.length > 1
					? predictedTimezoneGrades[$selectedTimezone] ?? predictedTimezoneGrades[0]
					: predictedTimezoneGrades[0];
		} else {
			predictedScore = undefined;
			predictedTimezoneGrades = [];
			predictedGrade = 0;
		}
	}

	$: selectedBoundaryValues =
		boundaries?.length > 1 ? boundaries[$selectedTimezone] ?? boundaries[0] : boundaries?.[0] ?? [];
	$: marksToNext =
		inputsComplete && predictedGrade && predictedGrade < selectedBoundaryValues.length
			? Math.max(0, selectedBoundaryValues[predictedGrade] - predictedScore)
			: null;
	$: safetyMargin =
		inputsComplete && predictedGrade
			? Math.max(0, predictedScore - selectedBoundaryValues[predictedGrade - 1])
			: null;
	$: summary = {
		group,
		name: groupTitle,
		level: $settings['level'],
		subjectSelected: Boolean($settings['subject']),
		selectionComplete: sufficientData,
		inputsComplete,
		completedAssessments,
		totalAssessments: assessments?.length ?? 0,
		boundariesAvailable: selectedBoundaryValues.length > 0,
		score: predictedScore,
		grade: predictedGrade,
		marksToNext,
		safetyMargin,
		nextGrade: predictedGrade && predictedGrade < 7 ? predictedGrade + 1 : null
	};

	$: url = constructURL(
		new URL($page.url),
		courses[$settings['subject']]?.short,
		$settings['language'],
		$settings['level']
	);

	let show = true;
	function toggleShow() {
		show = !show;
	}
</script>

<div class="main">
	<h2 class="group-title">{groupTitle}</h2>
	{#if slOnly}
		<h5 class="slOnlyWarning">{$settings['subject']} is only offered at the SL level</h5>
	{/if}
	{#if group == 5}
		<Select options={groupSixOptions} bind:selected={$settings['groupSixGroup']} />
	{/if}
	<Select options={subjects} placeholder="Enter subject" bind:selected={$settings['subject']} />
	{#if !slOnly}
		<Select options={['HL', 'SL']} placeholder="Enter level" bind:selected={$settings['level']} />
	{/if}
	{#if isLang}
		<Select
			options={languages}
			placeholder="Enter language"
			bind:selected={$settings['language']}
		/>
	{/if}
	{#if isHistoryHL}
		<Select
			options={courses.meta.region}
			placeholder="Enter History HL region"
			bind:selected={$settings['region']}
		/>
	{/if}
	{#if !sufficientData}
		<NotEnoughDetails />
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			class="toggle-button"
			class:flipped={!show}
			on:click={toggleShow}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					toggleShow();
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
		<div class="grade-panel">
			{#if !show}
				{#if inputsComplete}
					<GradeResults
						isCondensed={true}
						grades={predictedTimezoneGrades}
						{predictedGrade}
						score={predictedScore}
						name={$selectedBoundaryId}
					/>
				{:else}
					<div class="input-status">
						<strong>Scores incomplete</strong>
						<span>{completedAssessments} of {assessments.length} assessment scores entered</span>
					</div>
				{/if}
			{:else}
				<div class="grade-io">
					<div class="grade-results">
						{#if inputsComplete}
							<GradeResults
								grades={predictedTimezoneGrades}
								{predictedGrade}
								score={predictedScore}
								name={$selectedBoundaryId}
							/>
						{:else}
							<div class="input-status">
								<strong>Enter every assessment score</strong>
								<span
									>{completedAssessments} of {assessments.length} complete · no estimate shown until
									then</span
								>
							</div>
						{/if}
					</div>
					<div class="grade-sliders">
						{#each assessments as assessment, i}
							<ScoreSelector
								name={assessment.name}
								maxMarks={assessment.maxMarks}
								weight={assessment.weight}
								allowEmpty={true}
								bind:value={$settings['chosenScores'][i]}
								bind:entered={$settings['enteredScores'][i]}
							/>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if inputsComplete && selectedBoundaryValues.length}
			<BoundaryInsight
				boundary={selectedBoundaryValues}
				score={predictedScore}
				{predictedGrade}
				session={`${$selectedBoundary.info.name}${
					boundaries.length > 1 ? ` · TZ${$selectedTimezone + 1}` : ''
				}`}
			/>
		{:else if inputsComplete}
			<div class="boundary-unavailable">
				<strong>Boundary unavailable</strong>
				<span>No grade boundary was published for this subject and session.</span>
			</div>
		{/if}

		<a href={url} target="_blank"><button class="goto">Goto subject page</button></a>
	{/if}
</div>

<style lang="scss">
	.main {
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		margin-bottom: 10px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		background-color: var(--color-surface);
		position: relative;
	}

	.group-title {
		font-size: 1.75rem;
		padding-bottom: 10px;
		margin: 0;
	}

	.toggle-button {
		cursor: pointer;
		position: absolute;
		right: 8px;
		top: 10px;
		width: 56px;
		filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
		transform: rotate(0deg);
		transition: transform 0.5s;
	}

	.flipped {
		transform: rotate(180deg);
	}

	.grade-panel {
		padding-top: 10px;
		padding-bottom: 15px;
	}

	.input-status,
	.boundary-unavailable {
		display: grid;
		gap: 4px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 14px;
		background: var(--color-surface-variant);
	}

	.input-status strong,
	.boundary-unavailable strong {
		font-size: 0.9rem;
	}

	.input-status span,
	.boundary-unavailable span {
		color: var(--color-text-muted);
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.boundary-unavailable {
		margin: 12px 0 18px;
	}

	.grade-sliders {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
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
			margin: 0;
			margin-right: 0.5rem;
		}
	}

	.goto {
		transition: all 0.2s ease;
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
		border: 1px solid var(--color-border);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		border-radius: 10px;
		font-weight: bolder;

		&:hover {
			background-color: var(--color-primary-dark);
			color: white;
			cursor: pointer;
		}
	}

	.group-title {
		margin: 0;
	}

	.slOnlyWarning {
		margin-top: 0;
	}
</style>
