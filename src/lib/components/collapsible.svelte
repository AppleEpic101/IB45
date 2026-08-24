<script>
	let open = false;
	export let question;
	const panelId = `faq-${question
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')}`;
</script>

<div class="collapsible">
	<button
		class="header"
		type="button"
		aria-expanded={open}
		aria-controls={panelId}
		on:click={() => (open = !open)}
	>
		<span>{question}</span>
		<span class="icon" aria-hidden="true"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="chevron"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg></span
		>
	</button>

	{#if open}
		<div class="content" id={panelId}>
			<slot />
		</div>
	{/if}
</div>

<style>
	.collapsible {
		border-bottom: 1px solid var(--color-border);
	}

	.header {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		border: 0;
		padding: 22px 0;
		background: transparent;
		color: var(--color-text-main);
		font: inherit;
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.45;
		text-align: left;
		cursor: pointer;
	}

	.header:hover {
		color: var(--color-primary-dark);
	}

	.header:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 6px;
	}

	.content {
		max-width: 700px;
		padding: 0 44px 24px 0;
	}

	.icon {
		display: grid;
		flex: 0 0 auto;
		place-items: center;
		width: 24px;
		height: 24px;
		color: var(--color-text-muted);
	}

	.chevron {
		width: 15px;
		height: 15px;
		transform-origin: center;
		transition: transform 0.2s ease;
	}

	.header[aria-expanded='true'] .chevron {
		transform: rotate(180deg);
	}

	@media (max-width: 640px) {
		.header {
			gap: 16px;
			padding: 19px 0;
		}

		.content {
			padding-right: 0;
			padding-bottom: 22px;
		}
	}
</style>
