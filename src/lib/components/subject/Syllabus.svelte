<script>
	export let data;
	export let version;
</script>

<div class="syllabus-select">
	<span class="label">Syllabus</span>
	<div class="button-group">
		<button
			class="btn-option {version === data.firstAssessment ? 'active' : ''}"
			on:click={() => {
				version = data.firstAssessment;
			}}
		>
			Current ({data.firstAssessment})
		</button>
		{#if data.old}
			{#each data.old as old}
				<button
					class="btn-option {version === old.firstAssessment ? 'active' : ''}"
					on:click={() => {
						version = old.firstAssessment;
					}}
				>
					{old.firstAssessment}–{old.lastAssessment}
				</button>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.syllabus-select {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-bottom: 2rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
		letter-spacing: 0.01em;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.btn-option {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		color: var(--color-text-main);
		padding: 6px 14px;
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: var(--color-primary);
			background-color: rgba(14, 165, 233, 0.05);
		}

		&.active {
			background-color: var(--color-primary-dark);
			border-color: var(--color-primary-dark);
			color: #fff;
			font-weight: 600;
			box-shadow: var(--shadow-sm);
		}
	}

	@media (max-width: 600px) {
		.syllabus-select {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
</style>
