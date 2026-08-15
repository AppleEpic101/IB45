<script>
	import corePerformance, {
		EE_SUBJECT_GROUPS,
		getCorePerformance
	} from '$lib/data/corePerformance.js';
	import GlobalBulletin from '$lib/components/subject/GlobalBulletin.svelte';
	import BulletinTable from '$lib/components/subject/BulletinTable.svelte';

	export let type;
	export let grade;
	export let sessionId;
	export let compact = false;
	export let subjectGroup = 'individuals-societies';

	const labels = ['N', 'E', 'D', 'C', 'B', 'A'];
	const colors = [
		'rgba(244, 63, 94, 0.7)',
		'rgba(249, 115, 22, 0.7)',
		'rgba(34, 197, 94, 0.7)',
		'rgba(20, 184, 166, 0.7)',
		'rgba(59, 130, 246, 0.7)',
		'rgba(139, 92, 246, 0.7)'
	];
	const subjectName = (performanceType) =>
		performanceType === 'ee' ? 'Extended Essay' : 'Theory Of Knowledge';
	const percentage = (count, total) => Math.round((count / total) * 1000) / 10;

	const buildSessions = (performance, performanceType, eeGroup) =>
		Object.entries(performance)
			.reverse()
			.map(([short, session]) => {
				const sourceCounts = performanceType === 'ee' ? session.ee?.[eeGroup] : session.tok;
				const counts = [...(sourceCounts ?? [])].reverse();
				const total = counts.reduce((sum, count) => sum + count, 0);
				const mean = total
					? counts.reduce((sum, count, index) => sum + count * index, 0) / total
					: 0;

				return {
					short,
					name: session.name,
					total,
					mean: Math.round(mean * 10) / 10,
					distribution: counts.map((count) => percentage(count, total))
				};
			});

	$: comparison = getCorePerformance(sessionId, type, grade, subjectGroup);
	$: selectedGroup = EE_SUBJECT_GROUPS.find((group) => group.value === subjectGroup);
	$: distributionSessions = buildSessions(corePerformance, type, subjectGroup);
</script>

{#if !compact}
	<section class="core-distribution" aria-label={`${subjectName(type)} global grade distribution`}>
		{#if type === 'ee'}
			<div class="ee-filter">
				<label>
					<span>EE subject group</span>
					<select bind:value={subjectGroup} aria-label="Extended Essay subject group">
						{#each EE_SUBJECT_GROUPS as group}
							<option value={group.value}>{group.label}</option>
						{/each}
					</select>
				</label>
			</div>
		{/if}

		<GlobalBulletin
			name={subjectName(type)}
			mark={grade}
			showBulletin={true}
			dataOverride={distributionSessions}
			labelsOverride={labels}
			colorsOverride={colors}
			showSubtitle={false}
			bind:selectedShort={sessionId}
			embedded
		/>

		<div class="bulletin-table">
			<BulletinTable
				name={type === 'ee' ? `${selectedGroup.label} Extended Essay` : 'Theory Of Knowledge'}
				dataOverride={distributionSessions}
				labelsOverride={labels}
				bandLabel="Grade"
			/>
		</div>
	</section>
{:else if comparison}
	<section
		class="core-performance compact"
		aria-label={`${subjectName(type)} ${comparison.sessionName} performance`}
	>
		<header>
			<h4>{comparison.sessionName}</h4>
			{#if type === 'ee'}
				<select bind:value={subjectGroup} aria-label="Extended Essay subject group">
					{#each EE_SUBJECT_GROUPS as group}
						<option value={group.value}>{group.label}</option>
					{/each}
				</select>
			{/if}
		</header>

		<div class="summary">
			<div class="grade-result">
				<span>Your result</span>
				<strong>Grade {grade}</strong>
			</div>
			<div>
				<span>Beats</span>
				<strong>{comparison.lowerShare}%</strong>
			</div>
			<div>
				<span>Students</span>
				<strong>{comparison.total.toLocaleString()}</strong>
			</div>
		</div>

		{#if type === 'ee'}<footer>{selectedGroup.label}</footer>{/if}
	</section>
{/if}

<style>
	.core-distribution {
		margin: 24px 0 36px;
		padding: 24px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		box-shadow: var(--shadow-md);
	}
	.ee-filter {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 12px;
	}
	label {
		display: grid;
		gap: 5px;
	}
	label > span {
		color: var(--color-primary);
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	select {
		max-width: 300px;
		padding: 8px 30px 8px 10px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface-variant);
		color: var(--color-text-main);
		font: inherit;
	}
	.bulletin-table {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid var(--color-border);
	}

	.core-performance {
		margin: 10px 0 4px;
		padding: 10px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	h4 {
		margin: 0;
		font-size: 0.72rem;
	}
	.compact select {
		max-width: 190px;
		padding: 5px 24px 5px 7px;
		font-size: 0.68rem;
	}
	.summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-top: 8px;
	}
	.summary > div {
		display: grid;
		gap: 2px;
		padding: 7px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface-variant);
	}
	.summary span,
	footer {
		color: var(--color-text-muted);
		font-size: 0.58rem;
	}
	.summary strong {
		font-size: 0.78rem;
	}
	.grade-result strong {
		color: var(--color-primary);
	}
	footer {
		margin-top: 7px;
	}

	@media screen and (max-width: 600px) {
		.core-distribution {
			padding: 14px;
		}
		.ee-filter,
		.ee-filter label,
		.ee-filter select {
			width: 100%;
			max-width: none;
		}
		header {
			align-items: stretch;
			flex-direction: column;
		}
		.compact select {
			width: 100%;
			max-width: none;
		}
	}
</style>
