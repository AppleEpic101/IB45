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
		background-color: #e0f2fe;
		padding: 12px;
		margin: 10px 5px;
		cursor: pointer;
		border: 2px solid black;
		box-shadow: 0 1px 1px black;
		border-radius: 10px;
		font-size: 1rem;
		font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
		color: black;
	}

	button:hover {
		transition: all 0.2s ease;
		background-color: #053f54;
		color: white;
		text-shadow: 0 2px 2px #808080;
	}
</style>
