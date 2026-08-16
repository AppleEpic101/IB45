<script>
	export let group;
	export let predictedGrade;
	export let level;
	export let summary = {};
	$: level = $settings['level'];

	import courses from '$lib/assets/courses.json';
	import {
		availableBoundaries,
		getPredictorSelectedOptions,
		selectedBoundary,
		selectedTimezone,
		selectedBoundaryId
	} from '$lib/stores/stores.js';

	import Select from '$lib/components/MainCalculator/Select.svelte';
	import ScoreSelector from '$lib/components/MainCalculator/ScoreSelector.svelte';
	import GradeResults from '$lib/components/MainCalculator/GradeResults.svelte';
	import BoundaryInsight from '$lib/components/MainCalculator/BoundaryInsight.svelte';
	import CompactSubjectInsights from '$lib/components/MainCalculator/CompactSubjectInsights.svelte';
	import Bulletin from '$lib/data/bulletin.js';

	import { constructURL } from '$lib/utils/urls.js';
	import { page } from '$app/stores';

	let settings = getPredictorSelectedOptions(group);
	$settings['chosenScores'] = $settings['chosenScores'] || [];

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

	// grade prediction algorithm
	let predictedScore, predictedTimezoneGrades, inputsComplete, completedAssessments;
	$: {
		completedAssessments = sufficientData ? assessments.length : 0;
		inputsComplete = sufficientData && assessments.length > 0;

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
	$: historicalResults = sufficientData
		? availableBoundaries.flatMap((boundarySession) =>
				(boundarySession[groupTitle]?.TZ ?? [])
					.filter((timezoneBoundary) => timezoneBoundary?.length)
					.map((timezoneBoundary) => ({
						short: boundarySession.info.short,
						name: boundarySession.info.name,
						tz: timezoneBoundary
					}))
		  )
		: [];
	$: bulletinSession = sufficientData
		? Bulletin[groupTitle]?.grades?.find(
				(session) => session.short === $selectedBoundary.info.short
		  )
		: undefined;
	$: percentile =
		predictedGrade && bulletinSession?.distribution?.length
			? bulletinSession.distribution
					.slice(0, predictedGrade)
					.reduce((sum, percentage) => sum + (Number(percentage) || 0), 0)
			: undefined;
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

<div
	class="main"
	class:incomplete={!sufficientData}
	class:complete={sufficientData}
	class:collapsed={sufficientData && !show}
>
	<div class="group-header">
		<h2 class="group-title">{groupTitle}</h2>
		{#if show || !sufficientData}
			<div class="selection-row">
				{#if group == 5}
					<div class="select-control group-select">
						<Select options={groupSixOptions} bind:selected={$settings['groupSixGroup']} />
					</div>
				{/if}
				<div class="select-control subject-select">
					<Select
						options={subjects}
						placeholder="Enter subject"
						bind:selected={$settings['subject']}
					/>
				</div>
				{#if !slOnly}
					<div class="select-control level-select">
						<Select
							options={['HL', 'SL']}
							placeholder="Enter level"
							bind:selected={$settings['level']}
						/>
					</div>
				{/if}
				{#if isLang}
					<div class="select-control language-select">
						<Select
							options={languages}
							placeholder="Enter language"
							bind:selected={$settings['language']}
						/>
					</div>
				{/if}
				{#if isHistoryHL}
					<div class="select-control region-select">
						<Select
							options={courses.meta.region}
							placeholder="Enter History HL region"
							bind:selected={$settings['region']}
						/>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	{#if slOnly}
		<h5 class="slOnlyWarning">{$settings['subject']} is only offered at the SL level</h5>
	{/if}
	{#if sufficientData}
		<button
			type="button"
			class="toggle-button"
			class:flipped={show}
			aria-expanded={show}
			aria-label={show ? `Collapse ${groupTitle}` : `Expand ${groupTitle}`}
			on:click={toggleShow}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true">
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
		</button>
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
								compact={true}
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
								compact={true}
								name={assessment.name}
								maxMarks={assessment.maxMarks}
								weight={assessment.weight}
								bind:value={$settings['chosenScores'][i]}
							/>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if show}
			{#if inputsComplete && selectedBoundaryValues.length}
				<BoundaryInsight
					boundary={selectedBoundaryValues}
					score={predictedScore}
					{predictedGrade}
					session={`${$selectedBoundary.info.name}${
						boundaries.length > 1 ? ` · TZ${$selectedTimezone + 1}` : ''
					}`}
				/>
				<CompactSubjectInsights
					{assessments}
					scores={$settings['chosenScores']}
					currentScore={predictedScore}
					currentGrade={predictedGrade}
					boundary={selectedBoundaryValues}
					session={$selectedBoundary.info.short}
					results={historicalResults}
					firstAssessment={courses[$settings['subject']]?.firstAssessment}
					{percentile}
				/>
			{:else if inputsComplete}
				<div class="boundary-unavailable">
					<strong>Boundary unavailable</strong>
					<span>No grade boundary was published for this subject and session.</span>
				</div>
			{/if}

			<a href={url} target="_blank"><button class="goto">Full subject analysis →</button></a>
		{/if}
	{/if}
</div>

<style lang="scss">
	.main {
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		margin-bottom: 10px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		background-color: var(--color-surface);
		position: relative;
	}

	.main.incomplete {
		padding-block: 0.75rem;
	}

	.main.collapsed {
		padding-bottom: 0.75rem;
	}

	.main.collapsed .group-header {
		grid-template-columns: minmax(0, 1fr);
		min-height: 40px;
	}

	.group-title {
		font-size: 1.2rem;
		line-height: 1.2;
		margin: 0;
	}

	.group-header,
	.selection-row {
		display: flex;
		align-items: center;
	}

	.group-header {
		display: grid;
		grid-template-columns: minmax(240px, 1fr) minmax(330px, 0.9fr);
		gap: 16px;
		padding-right: 48px;
	}

	.selection-row {
		justify-content: flex-end;
		gap: 6px;
		min-width: 0;
	}

	.select-control {
		min-width: 0;
	}

	.select-control :global(select) {
		box-sizing: border-box;
		width: 100%;
		margin: 0;
		padding: 8px 10px;
	}

	.subject-select {
		flex: 1 1 210px;
	}

	.level-select {
		flex: 0 1 116px;
	}

	.group-select,
	.language-select {
		flex: 0 1 155px;
	}

	.region-select {
		flex: 1 1 220px;
	}

	.toggle-button {
		cursor: pointer;
		position: absolute;
		right: 12px;
		top: 12px;
		width: 40px;
		height: 40px;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
		transform: rotate(0deg);
		transition: transform 0.5s;
	}

	.toggle-button svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.toggle-button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
		border-radius: 50%;
	}

	.flipped {
		transform: rotate(180deg);
	}

	.grade-panel {
		padding-top: 8px;
		padding-bottom: 6px;
	}

	.main.collapsed .grade-panel {
		padding-top: 6px;
		padding-bottom: 0;
	}

	.main.collapsed .grade-panel :global(.main) {
		box-sizing: border-box;
		width: 100%;
		margin: 0;
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
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		min-width: 0;
	}

	.grade-results {
		margin-top: 1rem;
	}

	@media (min-width: 53rem) {
		.grade-io {
			display: grid;
			grid-template-columns: 172px minmax(0, 1fr);
			align-items: stretch;
			gap: 8px;
		}

		.grade-results {
			margin: 0;
		}
	}

	@media (max-width: 68rem) {
		.group-header {
			align-items: flex-start;
			flex-direction: column;
			display: flex;
			gap: 8px;
			padding-right: 48px;
		}

		.selection-row {
			width: 100%;
		}
	}

	@media (max-width: 52.99rem) {
		.grade-io,
		.grade-sliders {
			min-width: 0;
		}

		.grade-sliders {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 38rem) {
		.main {
			padding: 0.8rem;
		}

		.group-header {
			padding-right: 42px;
		}

		.selection-row {
			display: grid;
			grid-auto-flow: dense;
			grid-template-columns: minmax(0, 1fr) 104px;
			width: 100%;
		}

		.subject-select,
		.region-select {
			grid-column: 1 / -1;
		}

		.group-select,
		.language-select,
		.level-select {
			width: auto;
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
