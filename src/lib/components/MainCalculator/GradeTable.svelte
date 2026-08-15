<script>
	export let gradeData;
	export let summaries = [];
	export let coreComplete = false;

	import { selectedBoundaryId, selectedTimezone } from '$lib/stores/stores.js';
	import Refresh from './Refresh.svelte';

	$: completedSubjects = summaries.filter(
		(summary) => summary.inputsComplete && summary.boundariesAvailable && summary.grade
	);
	$: completedCount = completedSubjects.length;
	$: subjectPoints = completedSubjects.reduce((total, summary) => total + summary.grade, 0);
	$: totalPoints = subjectPoints + (coreComplete ? gradeData.coreGrade : 0);

	$: hlSubjects = completedSubjects
		.filter((summary) => summary.level === 'HL')
		.sort((a, b) => b.grade - a.grade);
	$: slSubjects = completedSubjects.filter((summary) => summary.level === 'SL');
	$: hlCount = hlSubjects.length;
	$: slCount = slSubjects.length;
	$: hlPoints = hlSubjects.slice(0, 3).reduce((total, summary) => total + summary.grade, 0);
	$: slPoints = slSubjects.reduce((total, summary) => total + summary.grade, 0);

	$: gradeCounts = completedSubjects.reduce((counts, summary) => {
		counts[summary.grade] = (counts[summary.grade] || 0) + 1;
		return counts;
	}, {});
	$: subjectsComplete = completedCount === 6;
	$: requirements = [
		{
			label: 'Six subjects calculated',
			detail: `${completedCount} of 6 complete`,
			state: subjectsComplete ? 'pass' : 'pending'
		},
		{
			label: 'TOK and Extended Essay entered',
			detail: coreComplete ? `${gradeData.coreGrade} core points` : 'Core scores incomplete',
			state: coreComplete ? 'pass' : 'pending'
		},
		{
			label: 'At least 24 total points',
			detail: subjectsComplete && coreComplete ? `${totalPoints} points` : 'Waiting for all scores',
			state: !subjectsComplete || !coreComplete ? 'pending' : totalPoints >= 24 ? 'pass' : 'fail'
		},
		{
			label: 'Three or four HL subjects',
			detail: subjectsComplete ? `${hlCount} HL subjects` : 'Waiting for all subjects',
			state: !subjectsComplete ? 'pending' : hlCount === 3 || hlCount === 4 ? 'pass' : 'fail'
		},
		{
			label: 'At least 12 points across the three highest HLs',
			detail: subjectsComplete ? `${hlPoints} HL points` : 'Waiting for all subjects',
			state:
				!subjectsComplete || (hlCount !== 3 && hlCount !== 4)
					? 'pending'
					: hlPoints >= 12
					? 'pass'
					: 'fail'
		},
		{
			label: slCount === 2 ? 'At least 5 SL points' : 'At least 9 SL points',
			detail: subjectsComplete ? `${slPoints} SL points` : 'Waiting for all subjects',
			state: !subjectsComplete
				? 'pending'
				: slCount === 2
				? slPoints >= 5
					? 'pass'
					: 'fail'
				: slCount === 3
				? slPoints >= 9
					? 'pass'
					: 'fail'
				: 'pending'
		},
		{
			label: 'No disqualifying subject grades',
			detail: 'No grade 1, no more than two 2s, and no more than three 3s',
			state: !subjectsComplete
				? 'pending'
				: (gradeCounts[1] || 0) === 0 && (gradeCounts[2] || 0) <= 2 && (gradeCounts[3] || 0) <= 3
				? 'pass'
				: 'fail'
		},
		{
			label: 'TOK and EE are above an E',
			detail: coreComplete
				? `TOK ${gradeData.tokGrade} · EE ${gradeData.eeGrade}`
				: 'Waiting for core scores',
			state: !coreComplete
				? 'pending'
				: gradeData.tokGrade !== 'E' && gradeData.eeGrade !== 'E'
				? 'pass'
				: 'fail'
		}
	];
	$: failedRequirements = requirements.filter((requirement) => requirement.state === 'fail');
	$: diplomaAwarded =
		subjectsComplete && coreComplete && failedRequirements.length === 0 && slCount >= 2;

	$: opportunities = completedSubjects
		.filter(
			(summary) => summary.nextGrade && summary.marksToNext !== null && summary.marksToNext <= 3
		)
		.sort((a, b) => a.marksToNext - b.marksToNext)
		.slice(0, 3);
	$: risks = completedSubjects
		.filter((summary) => summary.safetyMargin !== null && summary.safetyMargin <= 2)
		.sort((a, b) => a.safetyMargin - b.safetyMargin)
		.slice(0, 3);
	$: incompleteSubjects = summaries.filter(
		(summary) => !summary.inputsComplete || !summary.boundariesAvailable
	);
</script>

<aside class="summary" aria-label="Diploma overview">
	<div class="summary-header">
		<div>
			<span class="eyebrow">Diploma overview</span>
			<strong class="score">{totalPoints}<span> / 45</span></strong>
		</div>
		<span
			class="status"
			class:awarded={diplomaAwarded}
			class:warning={subjectsComplete && coreComplete && !diplomaAwarded}
		>
			{subjectsComplete && coreComplete
				? diplomaAwarded
					? 'On track'
					: 'Needs attention'
				: 'Setup incomplete'}
		</span>
	</div>

	<div class="completion">
		<div class="completion-label">
			<span>{completedCount} of 6 subjects calculated</span><span
				>{coreComplete ? 'Core ready' : 'Core incomplete'}</span
			>
		</div>
		<div class="progress" aria-label={`${completedCount} of 6 subjects calculated`}>
			<span style={`width: ${(completedCount / 6) * 100}%`} />
		</div>
	</div>

	<div class="metrics">
		<div><span>HL points</span><strong>{hlPoints}</strong><small>{hlCount} selected</small></div>
		<div><span>SL points</span><strong>{slPoints}</strong><small>{slCount} selected</small></div>
		<div>
			<span>Core</span><strong>{coreComplete ? gradeData.coreGrade : '—'}</strong><small
				>{coreComplete ? `${gradeData.tokGrade} / ${gradeData.eeGrade}` : 'Not ready'}</small
			>
		</div>
	</div>

	{#if opportunities.length || risks.length}
		<div class="priorities">
			{#if opportunities.length}
				<div class="priority-group">
					<h3>Closest opportunities</h3>
					{#each opportunities as subject}
						<div class="priority-row">
							<span>{subject.name}</span>
							<strong
								>{subject.marksToNext}
								{subject.marksToNext === 1 ? 'mark' : 'marks'} to {subject.nextGrade}</strong
							>
						</div>
					{/each}
				</div>
			{/if}
			{#if risks.length}
				<div class="priority-group risk-group">
					<h3>Borderline subjects</h3>
					{#each risks as subject}
						<div class="priority-row">
							<span>{subject.name}</span>
							<strong
								>{subject.safetyMargin}
								{subject.safetyMargin === 1 ? 'mark' : 'marks'} above the lower boundary</strong
							>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<details class="requirements" open={failedRequirements.length > 0}>
		<summary>Diploma requirements</summary>
		<div class="requirement-list">
			{#each requirements as requirement}
				<div class="requirement" data-state={requirement.state}>
					<span class="requirement-icon" aria-hidden="true"
						>{requirement.state === 'pass' ? '✓' : requirement.state === 'fail' ? '!' : '·'}</span
					>
					<div><strong>{requirement.label}</strong><span>{requirement.detail}</span></div>
				</div>
			{/each}
		</div>
	</details>

	{#if incompleteSubjects.length}
		<div class="incomplete-note">
			<strong>Still needed</strong>
			<span>
				{incompleteSubjects.length}
				{incompleteSubjects.length === 1 ? 'subject needs' : 'subjects need'}
				selection, assessment scores, or an available boundary.
			</span>
		</div>
	{/if}

	<div class="summary-footer">
		<span>{$selectedBoundaryId} · TZ{$selectedTimezone + 1}</span>
		<Refresh />
	</div>
</aside>

<style>
	.summary {
		position: sticky;
		top: 90px;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background: var(--color-surface);
		color: var(--color-text-main);
	}

	.summary-header,
	.completion,
	.metrics,
	.priorities,
	.requirements,
	.incomplete-note,
	.summary-footer {
		padding: 16px;
	}

	.summary-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.summary-header > div {
		display: grid;
		gap: 4px;
	}

	.eyebrow {
		color: var(--color-text-muted);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.score {
		font-size: 2rem;
		line-height: 1;
	}

	.score span {
		color: var(--color-text-muted);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.status {
		border: 1px solid var(--color-border);
		border-radius: 999px;
		padding: 5px 8px;
		color: var(--color-text-muted);
		font-size: 0.68rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.status.awarded {
		border-color: color-mix(in srgb, var(--color-success) 45%, var(--color-border));
		color: var(--color-success);
	}

	.status.warning {
		border-color: color-mix(in srgb, #d97706 45%, var(--color-border));
		color: #d97706;
	}

	.completion,
	.metrics,
	.priorities,
	.requirements,
	.incomplete-note,
	.summary-footer {
		border-top: 1px solid var(--color-border);
	}

	.completion-label,
	.summary-footer {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		color: var(--color-text-muted);
		font-size: 0.7rem;
	}

	.progress {
		height: 4px;
		margin-top: 9px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-surface-variant);
	}

	.progress span {
		display: block;
		height: 100%;
		background: var(--color-primary);
		transition: width 0.2s ease;
	}

	.metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.metrics div {
		display: grid;
		gap: 2px;
	}

	.metrics span,
	.metrics small {
		color: var(--color-text-muted);
		font-size: 0.66rem;
	}

	.metrics strong {
		font-size: 1.15rem;
	}

	.priority-group + .priority-group {
		margin-top: 15px;
	}

	.priority-group h3 {
		margin: 0 0 8px;
		font-size: 0.78rem;
	}

	.priority-row {
		display: grid;
		gap: 2px;
		padding: 7px 0;
		border-top: 1px solid var(--color-border);
	}

	.priority-row span {
		font-size: 0.75rem;
	}

	.priority-row strong {
		color: var(--color-primary-dark);
		font-size: 0.68rem;
	}

	.risk-group .priority-row strong {
		color: #d97706;
	}

	.requirements summary {
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
	}

	.requirement-list {
		display: grid;
		gap: 11px;
		margin-top: 14px;
	}

	.requirement {
		display: grid;
		grid-template-columns: 18px 1fr;
		gap: 7px;
		align-items: start;
	}

	.requirement-icon {
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border: 1px solid var(--color-border);
		border-radius: 50%;
		color: var(--color-text-muted);
		font-size: 0.62rem;
		font-weight: 800;
	}

	.requirement[data-state='pass'] .requirement-icon {
		border-color: var(--color-success);
		color: var(--color-success);
	}

	.requirement[data-state='fail'] .requirement-icon {
		border-color: #dc2626;
		color: #dc2626;
	}

	.requirement div {
		display: grid;
		gap: 2px;
	}

	.requirement strong {
		font-size: 0.7rem;
		line-height: 1.35;
	}

	.requirement div span,
	.incomplete-note span {
		color: var(--color-text-muted);
		font-size: 0.65rem;
		line-height: 1.45;
	}

	.incomplete-note {
		display: grid;
		gap: 3px;
	}

	.incomplete-note strong {
		font-size: 0.72rem;
	}

	.summary-footer {
		align-items: center;
	}

	.summary-footer :global(button) {
		font-size: 0.7rem;
	}

	@media (max-width: 700px) {
		.summary {
			position: relative;
			top: 0;
			margin-bottom: 20px;
		}
	}
</style>
