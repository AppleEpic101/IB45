<script>
	export let gradeData;
	export let summaries = [];
	export let coreComplete = true;

	import { selectedBoundaryId, selectedTimezone } from '$lib/stores/stores.js';
	import diplomaSessions, { estimateDiplomaPercentile } from '$lib/data/diplomaSessions.js';
	import { formatApproximateShare } from '$lib/utils/standing.js';
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
	$: sessionStats = diplomaSessions[$selectedBoundaryId];
	$: diplomaPercentile = gradesAvailable
		? estimateDiplomaPercentile(totalPoints, sessionStats)
		: null;
	$: diplomaStanding =
		diplomaPercentile !== null ? formatApproximateShare(diplomaPercentile) : undefined;
	$: pointsFromMean =
		gradesAvailable && sessionStats ? totalPoints - sessionStats.meanTotalPoints : null;
	$: pointsComparison =
		pointsFromMean === null
			? ''
			: Math.abs(pointsFromMean) < 0.5
			? 'close to the typical score'
			: `about ${Math.round(Math.abs(pointsFromMean))} ${
					Math.round(Math.abs(pointsFromMean)) === 1 ? 'point' : 'points'
			  } ${pointsFromMean >= 0 ? 'above' : 'below'} the typical score`;

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
		if (!summary.inputsComplete) return '—';
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
			<tr><th>Diploma summary</th><th>Result</th></tr>
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
		</tbody>
	</table>

	<section class="score-breakdown" aria-label="Subject and core breakdown">
		<header>
			<span>Subject &amp; core breakdown</span>
			<small>6 subjects, TOK and EE</small>
		</header>
		<table aria-label="Subject and core score breakdown">
			<tbody>
				{#each rowValues as rowValue, index}
					<tr>
						<td>Group {index + 1}</td>
						<td
							class="value"
							class:unavailable={rowValue === 'N/A' || rowValue === '—'}
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
	</section>

	{#if failureMessage}
		<div class:unavailable-message={unavailableSubjects.length > 0} class="notice">
			<strong>{unavailableSubjects.length ? 'Boundary unavailable' : 'Needs attention'}</strong>
			<span>{failureMessage}</span>
		</div>
	{/if}

	{#if sessionStats}
		<section class="peer-comparison" aria-label={`${sessionStats.name} diploma comparison`}>
			<div class="comparison-heading">
				<span>Session comparison</span>
				<strong>{sessionStats.name}</strong>
			</div>

			{#if diplomaPercentile !== null}
				<div class="standing">
					<strong>Ahead of {diplomaStanding}</strong>
					<span>of students in this session</span>
				</div>
				<div
					class="percentile-track"
					aria-label={`Approximate standing: ahead of ${diplomaStanding}`}
				>
					<span style={`width: ${diplomaPercentile}%`} />
				</div>
				<p class:below-mean={pointsFromMean < 0}>
					Your total is {pointsComparison}.
				</p>
			{:else}
				<div class="waiting-comparison">
					<strong>Complete all six subjects</strong>
					<span>Then we’ll compare your total with this session.</span>
				</div>
			{/if}

			<details class="comparison-details">
				<summary>About this comparison</summary>
				<div>
					<ul>
						<li><strong>{sessionStats.meanTotalPoints}</strong> typical diploma score</li>
						<li><strong>{sessionStats.passRate}%</strong> earned the diploma</li>
						<li>
							<strong>{sessionStats.diplomaResultsStudents.toLocaleString()}</strong> published results
						</li>
					</ul>
					<a class="comparison-help" href="/blog/understanding-your-ib-predict-results"
						>Read the explanation <span aria-hidden="true">→</span></a
					>
				</div>
			</details>
		</section>
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

	.score-breakdown {
		border-bottom: 1px solid var(--color-border);
		text-align: left;
	}

	.score-breakdown header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 10px 12px;
		color: var(--color-text-main);
		font-size: 0.7rem;
		font-weight: 750;
	}

	.score-breakdown header small {
		color: var(--color-text-muted);
		font-size: 0.6rem;
		font-weight: 650;
	}

	.score-breakdown header {
		border-bottom: 1px solid var(--color-border);
	}

	.score-breakdown table td:first-child {
		text-align: left;
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

	.peer-comparison {
		display: grid;
		gap: 8px;
		border-top: 1px solid var(--color-border);
		padding: 12px;
		text-align: left;
	}

	.comparison-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.comparison-heading span {
		color: var(--color-text-muted);
		font-size: 0.62rem;
	}

	.comparison-heading span {
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.comparison-heading strong {
		font-size: 0.7rem;
	}

	.standing {
		display: grid;
		gap: 1px;
	}

	.standing strong {
		color: var(--color-primary-dark);
		font-size: 1.05rem;
	}

	.standing span,
	.peer-comparison p,
	.waiting-comparison span {
		color: var(--color-text-muted);
		font-size: 0.66rem;
	}

	.peer-comparison p {
		margin: 0;
	}

	.peer-comparison p.below-mean {
		color: #d97706;
	}

	.comparison-help {
		color: var(--color-primary);
		font-size: 0.64rem;
		font-weight: 750;
		text-decoration: none;
	}

	.comparison-details {
		font-size: 0.64rem;
	}

	.comparison-details summary {
		width: fit-content;
		color: var(--color-text-muted);
		font-weight: 700;
		cursor: pointer;
	}

	.comparison-details > div {
		display: grid;
		gap: 4px;
		margin-top: 5px;
	}

	.comparison-details ul {
		display: grid;
		gap: 3px;
		margin: 0;
		padding: 0;
		list-style: none;
		color: var(--color-text-muted);
	}

	.comparison-details li strong {
		color: var(--color-text-main);
	}

	.comparison-help:hover,
	.comparison-help:focus-visible {
		text-decoration: underline;
	}

	.percentile-track {
		height: 5px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-surface-variant);
	}

	.percentile-track span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--color-primary-dark);
	}

	.waiting-comparison {
		display: grid;
		gap: 2px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 9px;
		background: var(--color-surface-variant);
	}

	.waiting-comparison strong {
		font-size: 0.72rem;
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
