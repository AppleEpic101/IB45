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
		background-color: var(--lightprimary);
		padding: 15px;
		margin: 10px 0;
		cursor: pointer;
		border: 2px solid black;
		border-radius: 5px;
		color: black;
	}

	button:hover {
		transition: all 0.2s ease;
		background-color: var(--banner);
		color: white;
		text-shadow: 0 2px 2px #808080;
		box-shadow: 0 1px 1px black;
	}
</style>
