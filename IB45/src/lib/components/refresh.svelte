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
		background-color: var(--primary);
		transition: 0.3s ease-in-out;
	}
</style>
