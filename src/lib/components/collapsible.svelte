<script>
	let open = false;
	export let question;
</script>

<div class="collapsible">
	<div class="header" on:click={() => (open = !open)}>
		{question}
		<span class="icon" class:open
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
	</div>

	{#if open}
		<div class="content">
			<slot />
		</div>
	{/if}
</div>

<style>
	.collapsible {
		border-bottom: 1px solid #ccc;
		padding: 1rem 0;
	}

	.header {
		cursor: pointer;
		font-weight: bold;
		font-size: 1.1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.content {
		margin-top: 0.75rem;
		line-height: 1.6;
	}

	ul {
		margin-top: 0.5rem;
		padding-left: 1.25rem;
	}

	.icon {
		font-size: 1.2rem;
		transform: rotate(0deg);
		transition: transform 0.2s ease;
	}

	.icon.open {
		transform: rotate(180deg);
	}

	.chevron {
		width: 1rem;
		height: 1rem;
		transform-origin: center;
		transition: transform 0.2s ease;
	}

	.chevron.open {
		transform: rotate(180deg);
	}
</style>
