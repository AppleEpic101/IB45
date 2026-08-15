<script>
	import corePerformance, {
		EE_SUBJECT_GROUPS,
		getCorePerformance
	} from '$lib/data/corePerformance.js';

	export let type;
	export let grade;
	export let sessionId;
	export let compact = false;
	export let subjectGroup = 'individuals-societies';

	$: comparison = getCorePerformance(sessionId, type, grade, subjectGroup);
	$: selectedGroup = EE_SUBJECT_GROUPS.find((group) => group.value === subjectGroup);
	const performanceSessions = Object.entries(corePerformance).reverse();
	const gradeName = (label) => (label === 'N' ? 'No grade' : `Grade ${label}`);
	const gradeColors = {
		A: '#8b5cf6',
		B: '#3b82f6',
		C: '#14b8a6',
		D: '#22c55e',
		E: '#f59e0b',
		N: '#ef476f'
	};
</script>

{#if comparison}
	<section
		class="core-performance"
		class:compact
		aria-label={`${type === 'ee' ? 'Extended Essay' : 'TOK'} ${comparison.sessionName} performance`}
	>
		<header>
			<div>
				<h4>{compact ? comparison.sessionName : 'Global Grade Distribution'}</h4>
			</div>

			<div class="filters">
				{#if !compact}
					<label>
						<span>Exam session</span>
						<select bind:value={sessionId} aria-label="Performance exam session">
							{#each performanceSessions as [id, session]}
								<option value={id}>{session.name}</option>
							{/each}
						</select>
					</label>
				{/if}
				{#if type === 'ee'}
					<label>
						{#if !compact}<span>EE subject group</span>{/if}
						<select bind:value={subjectGroup} aria-label="Extended Essay subject group">
							{#each EE_SUBJECT_GROUPS as group}
								<option value={group.value}>{group.label}</option>
							{/each}
						</select>
					</label>
				{/if}
			</div>
		</header>

		{#if type === 'tok'}
			<div class="tok-summary">
				<div class="grade-result">
					<span>Your result</span>
					<strong>Grade {grade}</strong>
				</div>
				<div class="benchmark">
					<strong>{comparison.lowerShare}%</strong>
					<span>Beats {comparison.lowerShare}% of TOK students</span>
				</div>
			</div>

			{#if !compact}
				<div class="tok-chart" aria-label={`${comparison.sessionName} TOK grade distribution`}>
					{#each [...comparison.entries].reverse() as entry}
						<div
							class="chart-column"
							class:current={entry.label === grade}
							aria-label={`${gradeName(entry.label)}: ${entry.percentage}%`}
						>
							<div
								class="chart-bar"
								style={`--bar-height:${Math.min(entry.percentage * 2, 100)}%;--bar-color:${
									gradeColors[entry.label]
								}`}
							>
								{#if entry.label === grade}<strong>{entry.percentage}%</strong>{/if}
							</div>
							<span>{entry.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if !compact}
				<details>
					<summary>View grade breakdown</summary>
					<div class="distribution" aria-label="Grade distribution">
						{#each comparison.entries as entry}
							<div
								class:current={entry.label === grade}
								style={`--share:${Math.max(entry.percentage, 0.6)}%`}
							>
								<span>{gradeName(entry.label)}</span>
								<strong>{entry.percentage}%</strong>
								<small>{entry.count.toLocaleString()}</small>
							</div>
						{/each}
					</div>
				</details>
			{/if}
		{:else}
			<div class="summary">
				<div class="grade-result">
					<span>Your result</span>
					<strong>Grade {grade}</strong>
				</div>
				<div>
					<span>Same grade</span>
					<strong>{comparison.gradeShare}%</strong>
				</div>
				<div>
					<span>Earned higher</span>
					<strong>{comparison.higherShare}%</strong>
				</div>
			</div>

			{#if !compact}
				<div class="distribution" aria-label="Grade distribution">
					{#each comparison.entries as entry}
						<div
							class:current={entry.label === grade}
							style={`--share:${Math.max(entry.percentage, 0.6)}%`}
						>
							<span>{gradeName(entry.label)}</span>
							<strong>{entry.percentage}%</strong>
							<small>{entry.count.toLocaleString()}</small>
						</div>
					{/each}
				</div>
			{/if}
		{/if}

		<footer>
			{comparison.total.toLocaleString()} students{type === 'ee' ? ` · ${selectedGroup.label}` : ''}
		</footer>
	</section>
{/if}

<style>
	.core-performance {
		margin: 24px 0 36px;
		padding: 20px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		box-shadow: var(--shadow-sm);
	}
	header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 18px;
	}
	h4 {
		margin: 0;
	}
	h4 {
		margin-top: 3px;
		color: var(--color-text-main);
		font-size: 1.15rem;
	}
	footer {
		color: var(--color-text-muted);
		font-size: 0.72rem;
	}
	label > span {
		color: var(--color-primary);
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	label {
		display: grid;
		gap: 5px;
	}
	.filters {
		display: flex;
		align-items: flex-end;
		gap: 10px;
	}
	select {
		max-width: 280px;
		padding: 8px 30px 8px 10px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface-variant);
		color: var(--color-text-main);
		font: inherit;
	}
	.summary {
		display: grid;
		grid-template-columns: 1.25fr 1fr 1fr;
		gap: 8px;
		margin-top: 16px;
	}
	.tok-summary {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 8px;
		margin-top: 16px;
	}
	.tok-summary > div {
		display: grid;
		align-content: center;
		gap: 2px;
		min-height: 72px;
		padding: 11px 12px;
		border: 1px solid var(--color-border);
		border-radius: 9px;
		background: var(--color-surface-variant);
	}
	.tok-summary span {
		color: var(--color-text-muted);
		font-size: 0.68rem;
	}
	.tok-summary strong {
		color: var(--color-text-main);
		font-size: 1rem;
	}
	.benchmark {
		grid-template-columns: auto 1fr;
		column-gap: 10px !important;
	}
	.benchmark strong {
		grid-row: 1 / 3;
		align-self: center;
		color: var(--color-primary);
		font-size: 1.5rem;
	}
	.tok-chart {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		align-items: end;
		gap: 12px;
		height: 230px;
		margin-top: 14px;
		padding: 24px 20px 12px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: repeating-linear-gradient(
				to bottom,
				transparent 0,
				transparent 24%,
				var(--color-border) 24.5%,
				transparent 25%
			),
			var(--color-surface-variant);
	}
	.chart-column {
		display: grid;
		grid-template-rows: 1fr auto;
		align-items: end;
		gap: 7px;
		height: 100%;
		text-align: center;
	}
	.chart-column > span {
		color: var(--color-text-muted);
		font-size: 0.72rem;
		font-weight: 800;
	}
	.chart-bar {
		position: relative;
		width: min(66px, 76%);
		height: var(--bar-height);
		min-height: 3px;
		margin: 0 auto;
		border-radius: 7px 7px 2px 2px;
		background: var(--bar-color);
		opacity: 0.68;
	}
	.chart-column.current .chart-bar {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
		opacity: 1;
	}
	.chart-bar strong {
		position: absolute;
		top: -22px;
		left: 50%;
		translate: -50% 0;
		color: var(--color-primary);
		font-size: 0.72rem;
	}
	details {
		margin-top: 10px;
		border-top: 1px solid var(--color-border);
	}
	summary {
		padding: 10px 0 0;
		color: var(--color-text-muted);
		font-size: 0.72rem;
		font-weight: 700;
		cursor: pointer;
	}
	.summary > div {
		display: grid;
		gap: 2px;
		padding: 11px 12px;
		border: 1px solid var(--color-border);
		border-radius: 9px;
		background: var(--color-surface-variant);
	}
	.summary span {
		color: var(--color-text-muted);
		font-size: 0.68rem;
	}
	.summary strong {
		color: var(--color-text-main);
		font-size: 1rem;
	}
	.grade-result strong {
		color: var(--color-primary);
	}
	.distribution {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
		margin-top: 12px;
	}
	.distribution > div {
		position: relative;
		display: grid;
		gap: 2px;
		overflow: hidden;
		padding: 9px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface-variant);
	}
	.distribution > div::after {
		position: absolute;
		bottom: 0;
		left: 0;
		width: var(--share);
		height: 3px;
		background: var(--color-text-muted);
		content: '';
	}
	.distribution > div.current {
		border-color: var(--color-primary);
	}
	.distribution > div.current::after {
		background: var(--color-primary);
	}
	.distribution span,
	.distribution small {
		color: var(--color-text-muted);
		font-size: 0.62rem;
	}
	.distribution strong {
		font-size: 0.9rem;
	}
	footer {
		margin-top: 10px;
	}

	.core-performance.compact {
		margin: 10px 0 4px;
		padding: 10px;
		border-radius: 10px;
		box-shadow: none;
	}
	.compact header {
		align-items: center;
	}
	.compact h4 {
		margin: 0;
		font-size: 0.72rem;
	}
	.compact select {
		max-width: 190px;
		padding: 5px 24px 5px 7px;
		font-size: 0.68rem;
	}
	.compact .summary {
		margin-top: 8px;
	}
	.compact .tok-summary {
		grid-template-columns: 0.8fr 1.5fr;
		margin-top: 8px;
	}
	.compact .tok-summary > div {
		min-height: 48px;
		padding: 7px;
	}
	.compact .tok-summary span {
		font-size: 0.58rem;
	}
	.compact .tok-summary strong {
		font-size: 0.78rem;
	}
	.compact .benchmark strong {
		font-size: 1rem;
	}
	.compact .summary > div {
		padding: 7px;
	}
	.compact .summary span {
		font-size: 0.58rem;
	}
	.compact .summary strong {
		font-size: 0.78rem;
	}
	.compact footer {
		margin-top: 7px;
		font-size: 0.6rem;
	}

	@media screen and (max-width: 600px) {
		.core-performance {
			padding: 14px;
		}
		header {
			align-items: stretch;
			flex-direction: column;
		}
		.filters {
			align-items: stretch;
			flex-direction: column;
		}
		select {
			width: 100%;
			max-width: none;
		}
		.summary {
			grid-template-columns: 1fr 1fr;
		}
		.tok-summary {
			grid-template-columns: 1fr;
		}
		.compact .tok-summary {
			grid-template-columns: 0.8fr 1.5fr;
		}
		.grade-result {
			grid-column: 1 / -1;
		}
		.distribution {
			grid-template-columns: repeat(3, 1fr);
		}
		.tok-chart {
			gap: 7px;
			height: 190px;
			padding-inline: 10px;
		}
		.compact .summary {
			grid-template-columns: repeat(3, 1fr);
		}
		.compact .grade-result {
			grid-column: auto;
		}
		.compact header {
			gap: 7px;
		}
	}
</style>
