<script>
	export let group;
	export let predictedGrade;
	export let level;
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
	import GradeResults from '$lib/components/MainCalculator/GroupGradeResults.svelte';

	import { constructURL } from '$lib/group.js';
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

	$: slOnly = courses[$settings['subject']]?.SLOnly || false;
	$: isLang = courses[$settings['subject']]?.isLang || false;

	$: languages = courses.name == 'Classical Language' ? courses.meta.classical : courses.meta.lang;

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
	let predictedScore, predictedTimezoneGrades;
	$: {
		if (sufficientData) {
			predictedScore = 0;
			for (let i = 0; i < assessments.length; i++) {
				predictedScore +=
					($settings['chosenScores'][i] / assessments[i].maxMarks) * assessments[i].weight;
			}
			predictedScore *= 100;
			predictedScore = Math.round(predictedScore);
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
			predictedGrade = predictedTimezoneGrades[1]
				? predictedTimezoneGrades[$selectedTimezone]
				: predictedTimezoneGrades[0];
		} else {
			predictedGrade = 0;
		}
	}

	$: url = constructURL(
		new URL($page.url),
		courses[$settings['subject']]?.short,
		$settings['language'],
		$settings['level']
	);
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
	<div class="grade-sliders">
		{#if sufficientData}
			{#each assessments as assessment, i}
				<ScoreSelector
					name={assessment.name}
					maxMarks={assessment.maxMarks}
					weight={assessment.weight}
					bind:value={$settings['chosenScores'][i]}
				/>
			{/each}
		{:else}
			<NotEnoughDetails />
		{/if}
	</div>
	{#if sufficientData}
		<GradeResults
			grades={predictedTimezoneGrades}
			{predictedGrade}
			score={predictedScore}
			name={$selectedBoundaryId}
		/>
		<a href={url} target="_blank"><button class="goto">Goto subject page</button></a>
	{/if}
</div>

<style lang="scss">
	.main {
		border-radius: 0.5rem;
		border: 2px solid black;
		margin-bottom: 10px;
		padding: 1rem;
		background-color: var(--darkwhite);
	}

	.group-title {
		margin-top: 0;
	}

	.grade-sliders {
		display: flex;
		flex-wrap: wrap;
	}

	.goto {
		transition: all 0.2s ease;
		background-color: var(--lightprimary);
		border: 2px solid black;
		padding: 5px 10px;
		margin-top: 15px;
		border-radius: 10px;
		font-weight: bolder;

		&:hover {
			background-color: var(--banner);
			color: white;
			cursor: pointer;
		}
	}
</style>
