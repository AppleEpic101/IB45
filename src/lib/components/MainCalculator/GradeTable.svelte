<script>
	export let gradeData;
	export let summaries = [];
	export let coreComplete = true;

	import { selectedBoundaryId, selectedTimezone } from '$lib/stores/stores.js';
	import Refresh from './Refresh.svelte';

	const letterGrades = ['E', 'D', 'C', 'B', 'A'];
	const tokGradeWeights = [0, 1, 3, 5, 7];

	$: completedSubjects = summaries.filter((summary) => summary.inputsComplete);
	$: allSubjectsComplete = completedSubjects.length === 6;
	$: unavailableSubjects = completedSubjects.filter((summary) => !summary.boundariesAvailable);
	$: gradesAvailable = allSubjectsComplete && unavailableSubjects.length === 0;
	$: totalPoints =
		completedSubjects.reduce((total, summary) => total + (summary.grade || 0), 0) +
		(coreComplete ? gradeData.coreGrade : 0);

	$: hlGrades = completedSubjects
		.filter((summary) => summary.level === 'HL' && summary.grade)
		.map((summary) => summary.grade)
		.sort((a, b) => b - a);
	$: slGrades = completedSubjects
		.filter((summary) => summary.level === 'SL' && summary.grade)
		.map((summary) => summary.grade);
	$: hlCount = completedSubjects.filter((summary) => summary.level === 'HL').length;
	$: slCount = completedSubjects.filter((summary) => summary.level === 'SL').length;
	$: hlPoints = hlGrades.slice(0, 3).reduce((sum, grade) => sum + grade, 0);
	$: slPoints = slGrades.reduce((sum, grade) => sum + grade, 0);
	$: gradeCounts = completedSubjects.reduce((counts, summary) => {
		if (summary.grade) counts[summary.grade] = (counts[summary.grade] || 0) + 1;
		return counts;
	}, {});

	$: failureMessage = getFailureMessage(
		allSubjectsComplete,
		unavailableSubjects,
		coreComplete,
		totalPoints,
		hlCount,
		gradeCounts,
		hlPoints,
		slCount,
		slPoints,
		gradeData.tokGrade,
		gradeData.eeGrade
	);
	$: diplomaAwarded = gradesAvailable && coreComplete && !failureMessage;
	$: rowValues = [0, 1, 2, 3, 4, 5].map((index) => {
		const summary = summaries[index] || {};
		if (!summary.inputsComplete) return 0;
		if (!summary.boundariesAvailable) return 'N/A';
		return summary.grade || 0;
	});

	function getFailureMessage(
		areSubjectsComplete,
		missingBoundaries,
		isCoreComplete,
		points,
		higherLevelCount,
		counts,
		higherLevelPoints,
		standardLevelCount,
		standardLevelPoints,
		tokGrade,
		eeGrade
	) {
		if (missingBoundaries.length) {
			return `${missingBoundaries.length} selected ${
				missingBoundaries.length === 1 ? 'subject has' : 'subjects have'
			} no boundary for this session. The remaining results are still complete.`;
		}
		if (!areSubjectsComplete) return 'Select all six subjects to complete the diploma calculation.';
		if (!isCoreComplete) return 'TOK or Extended Essay scores are incomplete.';
		if (points < 24) return 'Fewer than 24 total points.';
		if (higherLevelCount !== 3 && higherLevelCount !== 4)
			return 'Three or four HL subjects are required.';
		if ((counts[1] || 0) >= 1) return 'A grade 1 was awarded in at least one subject.';
		if ((counts[2] || 0) > 2) return 'More than two grade 2s were awarded.';
		if ((counts[3] || 0) > 3) return 'More than three grade 3s were awarded.';
		if (higherLevelPoints < 12) return 'Fewer than 12 points across the three highest HL subjects.';
		if (standardLevelCount === 3 && standardLevelPoints < 9) return 'Fewer than 9 SL points.';
		if (standardLevelCount === 2 && standardLevelPoints < 5) return 'Fewer than 5 SL points.';
		if (tokGrade === 'E' || eeGrade === 'E') return 'TOK or EE received an E.';
		return '';
	}

	function getRowColor(mark) {
		if (typeof mark !== 'number' || mark <= 0) return 'var(--color-surface-variant)';
		const hue = (mark / 5) * 120;
		return `hsl(${hue}, 100%, 68%)`;
	}
</script>

<aside class="summary" aria-label="Diploma score summary">
	<table>
		<thead>
			<tr><th>Subject</th><th>Awarded mark</th></tr>
		</thead>
		<tbody>
			<tr>
				<td>Points</td>
				<td class="value" style={`background-color: ${getRowColor(totalPoints / 6.42)}`}>
					{gradesAvailable ? totalPoints : '—'} / 45
				</td>
			</tr>
			<tr>
				<td>Diploma awarded?</td>
				<td
					class="value status-cell"
					style={`background-color: ${getRowColor(diplomaAwarded ? 7 : 0)}`}
				>
					{gradesAvailable ? (diplomaAwarded ? 'YES' : 'NO') : allSubjectsComplete ? 'N/A' : '—'}
				</td>
			</tr>
			{#each rowValues as rowValue, index}
				<tr>
					<td>Group {index + 1}</td>
					<td
						class="value"
						class:unavailable={rowValue === 'N/A'}
						style={`background-color: ${getRowColor(rowValue)}`}
					>
						{rowValue}
					</td>
				</tr>
			{/each}
			<tr>
				<td>TOK</td>
				<td
					class="value"
					style={`background-color: ${getRowColor(
						tokGradeWeights[letterGrades.indexOf(gradeData.tokGrade)]
					)}`}
				>
					{gradeData.tokGrade}
				</td>
			</tr>
			<tr>
				<td>EE</td>
				<td
					class="value"
					style={`background-color: ${getRowColor(
						tokGradeWeights[letterGrades.indexOf(gradeData.eeGrade)]
					)}`}
				>
					{gradeData.eeGrade}
				</td>
			</tr>
			<tr>
				<td>Core points</td>
				<td
					class="value"
					style={`background-color: ${getRowColor((Number(gradeData.coreGrade) * 7) / 3)}`}
				>
					{gradeData.coreGrade}
				</td>
			</tr>
		</tbody>
	</table>

	{#if failureMessage}
		<div class:unavailable-message={unavailableSubjects.length > 0} class="notice">
			<strong>{unavailableSubjects.length ? 'Boundary unavailable' : 'Needs attention'}</strong>
			<span>{failureMessage}</span>
		</div>
	{/if}

	<div class="meta">
		<span>HL: {hlCount} · SL: {slCount}</span>
		<span>{$selectedBoundaryId} · TZ{$selectedTimezone + 1}</span>
	</div>
	<Refresh />
</aside>

<style>
	.summary {
		position: sticky;
		top: 90px;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface);
		text-align: center;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		border-bottom: 1px solid var(--color-border);
		padding: 8px 7px;
		background: var(--color-surface-variant);
		font-size: 0.82rem;
	}

	th + th,
	td + td {
		border-left: 1px solid var(--color-border);
	}

	th {
		padding: 11px 7px;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.value {
		color: #07111f;
		font-weight: 700;
	}

	.value.unavailable,
	.status-cell {
		color: var(--color-text-main);
	}

	.notice {
		display: grid;
		gap: 4px;
		margin: 12px;
		border-left: 3px solid #dc2626;
		padding: 4px 0 4px 10px;
		text-align: left;
	}

	.notice.unavailable-message {
		border-color: #d97706;
	}

	.notice strong {
		font-size: 0.74rem;
	}

	.notice span,
	.meta {
		color: var(--color-text-muted);
		font-size: 0.66rem;
		line-height: 1.45;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		border-top: 1px solid var(--color-border);
		padding: 10px 12px 0;
	}

	.summary :global(button) {
		border-width: 1px;
		padding: 8px 10px;
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
