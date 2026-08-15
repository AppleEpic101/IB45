<script>
	import Bulletin from '$lib/data/bulletin.js';

	export let name;

	$: data = Bulletin[name]?.grades;
	const markbands = [1, 2, 3, 4, 5, 6, 7];
	let displayMode = 'percent';
	let sessionScope = 'all';
	const sessionScopes = [
		{ value: 'november', label: 'November Sessions', shortLabel: 'November' },
		{ value: 'may', label: 'May Sessions', shortLabel: 'May' },
		{ value: 'all', label: 'All Sessions', shortLabel: 'All' }
	];
	const compactCount = (value) =>
		new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

	const displayDistribution = (percentage, total, mode) =>
		mode === 'percent'
			? Number(percentage).toFixed(1)
			: Math.round((Number(percentage) / 100) * total).toLocaleString('en-US');

	const inSessionScope = (session, scope) =>
		scope === 'all' ||
		(scope === 'november' && session.short.startsWith('N')) ||
		(scope === 'may' && session.short.startsWith('M'));

	const buildSummary = (sessions, scope) => {
		const total = sessions.reduce((sum, session) => sum + session.total, 0);
		if (!total) return undefined;

		return {
			label: sessionScopes.find(({ value }) => value === scope)?.label,
			shortLabel: sessionScopes.find(({ value }) => value === scope)?.shortLabel,
			total,
			mean:
				sessions.reduce((sum, session) => sum + Number(session.mean) * session.total, 0) / total,
			distribution: Array.from(
				{ length: 8 },
				(_, index) =>
					sessions.reduce(
						(sum, session) => sum + Number(session.distribution[index] ?? 0) * session.total,
						0
					) / total
			)
		};
	};

	$: filteredData = (data ?? []).filter((session) => inSessionScope(session, sessionScope));
	$: summary = buildSummary(filteredData, sessionScope);
</script>

<div class="table-section">
	<div class="table-toolbar">
		<div>
			<strong>Distribution values</strong>
			<span>View each grade band as a percentage or candidate count.</span>
		</div>
		<div class="table-controls">
			<div class="session-switcher" aria-label="Exam session group">
				{#each sessionScopes as scope}
					<button
						type="button"
						class:active={sessionScope === scope.value}
						aria-pressed={sessionScope === scope.value}
						on:click={() => (sessionScope = scope.value)}>{scope.label}</button
					>
				{/each}
			</div>
			<div class="mode-switcher" aria-label="Distribution value format">
				<button
					type="button"
					class:active={displayMode === 'percent'}
					aria-pressed={displayMode === 'percent'}
					on:click={() => (displayMode = 'percent')}>Percentage (%)</button
				>
				<button
					type="button"
					class:active={displayMode === 'count'}
					aria-pressed={displayMode === 'count'}
					on:click={() => (displayMode = 'count')}>Candidates (#)</button
				>
			</div>
		</div>
	</div>

	<div class="table-wrapper">
		<table>
			<colgroup>
				<col class="session-column" />
				<col class="candidate-column" />
				<col class="mean-column" />
				<col class="band-column" />
				<col class="band-column" />
				<col class="band-column" />
				<col class="band-column" />
				<col class="band-column" />
				<col class="band-column" />
				<col class="band-column" />
				<col class="band-column" />
			</colgroup>
			<tr>
				<th colspan="11">{name} Grade Distribution</th>
			</tr>
			<tr>
				<th rowspan="2"
					><span class="desktop-text">Exam Session</span><span class="mobile-text">Session</span
					></th
				>
				<th rowspan="2"
					><span class="desktop-text">Total Candidates</span><span class="mobile-text"
						>Candidates</span
					></th
				>
				<th rowspan="2">Mean</th>
				<th colspan="8"
					><span class="desktop-text"
						>Markband ({displayMode === 'percent' ? '%' : 'estimated #'})</span
					><span class="mobile-text">{displayMode === 'percent' ? '%' : '#'}</span></th
				>
			</tr>

			<tr>
				<th>N</th>
				{#each markbands as markband}
					<th>{markband}</th>
				{/each}
			</tr>

			{#if filteredData.length}
				{#each filteredData as res}
					<tr>
						<td>{res.short}</td>
						<td
							><span class="desktop-text">{res.total.toLocaleString('en-US')}</span><span
								class="mobile-text">{compactCount(res.total)}</span
							></td
						>
						<td>{Number(res.mean).toFixed(1)}</td>
						{#each res?.distribution as dist}
							<td
								><span class="desktop-text"
									>{displayDistribution(dist, res.total, displayMode)}</span
								><span class="mobile-text"
									>{displayMode === 'percent'
										? Number(dist).toFixed(1)
										: compactCount(Math.round((Number(dist) / 100) * res.total))}</span
								></td
							>
						{/each}
					</tr>
				{/each}
				{#if summary}
					<tr class="summary-row">
						<td>
							<span class="desktop-text">{summary.label}</span><span class="mobile-text"
								>{summary.shortLabel}</span
							>
							<span class="desktop-text summary-description"
								>{displayMode === 'percent' ? 'Weighted average' : 'Combined total'}</span
							>
						</td>
						<td
							><span class="desktop-text">{summary.total.toLocaleString('en-US')}</span><span
								class="mobile-text">{compactCount(summary.total)}</span
							></td
						>
						<td>{summary.mean.toFixed(1)}</td>
						{#each summary.distribution as dist}
							<td
								><span class="desktop-text"
									>{displayDistribution(dist, summary.total, displayMode)}</span
								><span class="mobile-text"
									>{displayMode === 'percent'
										? Number(dist).toFixed(1)
										: compactCount(Math.round((Number(dist) / 100) * summary.total))}</span
								></td
							>
						{/each}
					</tr>
				{/if}
			{:else}
				<tr><td colspan="11">No results found</td></tr>{/if}
		</table>
	</div>

	{#if displayMode === 'count'}
		<p class="estimate-note">
			Candidate counts are estimates calculated from the published percentages and may differ
			slightly because of rounding.
		</p>
	{/if}
</div>

<style>
	.table-section {
		width: 100%;
	}

	.table-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		max-width: 1100px;
		margin: 0 auto 12px;
	}

	.table-toolbar > div:first-child {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.table-toolbar strong {
		color: var(--color-text-main);
		font-size: 0.9rem;
	}

	.table-toolbar span,
	.estimate-note {
		color: var(--color-text-muted);
		font-size: 0.8rem;
	}

	.table-controls {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 8px;
	}

	.session-switcher,
	.mode-switcher {
		display: inline-flex;
		flex-shrink: 0;
		gap: 3px;
		padding: 3px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface-variant);
	}

	.session-switcher button,
	.mode-switcher button {
		border: 0;
		border-radius: 7px;
		padding: 7px 10px;
		background: transparent;
		color: var(--color-text-muted);
		font: inherit;
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
	}

	.session-switcher button.active,
	.mode-switcher button.active {
		background: var(--color-surface);
		color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.session-switcher button:focus-visible,
	.mode-switcher button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.table-wrapper {
		display: flex;
		justify-content: center;
		overflow-x: auto;
		width: 100%;
		max-width: 100vw;
	}

	.mobile-text {
		display: none;
	}

	table {
		width: max-content;
		border-collapse: collapse;
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
	}

	th,
	td {
		border: 1px solid var(--color-border);
		text-align: center;
		padding: 8px;
		font-size: 14px;
		white-space: nowrap;
	}

	th[colspan='11'] {
		font-size: 16px;
	}

	.summary-row {
		background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface-variant));
		font-weight: 700;
	}

	.summary-row td:first-child .summary-description {
		display: block;
		margin-top: 2px;
		color: var(--color-text-muted);
		font-size: 0.7rem;
		font-weight: 500;
	}

	.estimate-note {
		max-width: 1100px;
		margin: 10px auto 0;
	}

	@media (max-width: 700px) {
		.table-toolbar {
			align-items: flex-start;
			flex-direction: column;
		}

		.table-controls {
			align-items: stretch;
			justify-content: flex-start;
			width: 100%;
		}

		.session-switcher {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			width: 100%;
		}

		.session-switcher button {
			padding: 7px 4px;
			white-space: normal;
		}

		.mode-switcher {
			width: fit-content;
		}

		.table-wrapper {
			display: flex;
			overflow: hidden;
		}

		table {
			width: 100%;
			table-layout: fixed;
		}

		.session-column {
			width: 12%;
		}

		.candidate-column {
			width: 15%;
		}

		.mean-column {
			width: 9%;
		}

		.band-column {
			width: 8%;
		}

		th,
		td {
			padding: 5px 1px;
			font-size: clamp(0.48rem, 2.1vw, 0.64rem);
			letter-spacing: -0.015em;
			overflow: hidden;
			text-overflow: clip;
		}

		th[colspan='11'] {
			padding: 6px 4px;
			font-size: 0.72rem;
			white-space: normal;
		}

		.desktop-text {
			display: none;
		}

		.mobile-text {
			display: inline;
		}

		.summary-row td:first-child span {
			margin: 0;
			font-size: inherit;
			font-weight: 700;
		}
	}
</style>
