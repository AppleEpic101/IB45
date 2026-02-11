<button
	on:click={() => {
		localStorage.clear();
		location.reload();
	}}
>
	Reset All Selections
</button>

<style>
	button {
		background-color: var(--color-surface-variant);
		padding: 12px;
		margin: 10px 5px;
		cursor: pointer;
		border: 2px solid var(--color-text-main);
		box-shadow: var(--shadow-sm);
		border-radius: 10px;
		font-size: 1rem;
		font-family: var(--font-body);
		color: var(--color-text-main);
	}

	button:hover {
		transition: all 0.2s ease;
		background-color: var(--color-primary-dark);
		color: white;
		text-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
	}
</style>
