<script>
	import BackButton from './BackButton.svelte';
	export let syllabus;
	export let level;
	export let language;
</script>

<header class="subject-header">
	<div class="nav-row">
		<BackButton />
	</div>

	<div class="header-main">
		<div class="metadata">
			<span class="badge group-badge">
				{#if (syllabus.groupNumber[0] || syllabus.groupNumber) === 99}
					Core
				{:else}
					Group {syllabus.groupNumber[0] || syllabus.groupNumber}
				{/if}
			</span>
			{#if (syllabus.groupNumber[0] || syllabus.groupNumber) !== 99}
				<span class="badge level-badge {level}">{level} Level</span>
			{/if}
		</div>
		<h1>
			{language || ''}
			{syllabus.name}
			<span class="assessment-year">{syllabus.firstAssessment}–Present</span>
		</h1>
		<div class="stats-row">
			<span class="subject-type">
				{#if syllabus.groupNumber.length === 2}
					{#if syllabus.groupNumber[1] === 's'}
						School-based Syllabus
					{:else}
						Interdisciplinary Subject
					{/if}
				{:else if syllabus.groupNumber[0] === 99}
					Core Subject
				{:else}
					Standard IB Subject
				{/if}
			</span>
		</div>
	</div>
</header>

<style lang="scss">
	.subject-header {
		margin-bottom: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.nav-row {
		margin-left: -8px;
	}

	.header-main {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.metadata {
		display: flex;
		gap: 0.5rem;
	}

	.badge {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		padding: 4px 12px;
		border-radius: 6px;
		letter-spacing: 0.05em;
	}

	.group-badge {
		background-color: var(--color-surface-variant);
		color: var(--color-text-main);
		border: 1px solid var(--color-border);
	}

	.level-badge {
		&.HL {
			background-color: #f97316;
			color: #fff;
		}
		&.SL {
			background-color: #0ea5e9;
			color: #fff;
		}
	}

	h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--color-text-main);

		.assessment-year {
			color: var(--color-text-muted);
			font-weight: 400;
			font-size: 1.5rem;
			margin-left: 0.5rem;
			letter-spacing: -0.01em;
		}
	}

	.stats-row {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 0.5rem;

		&::before {
			content: '';
			display: block;
			width: 12px;
			height: 2px;
			background: var(--color-primary);
			border-radius: 2px;
		}
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 1.85rem;
			.assessment-year {
				display: block;
				margin-left: 0;
				margin-top: 0.25rem;
				font-size: 1.25rem;
			}
		}
	}
</style>
