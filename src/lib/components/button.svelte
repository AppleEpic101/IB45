<script>
	export let href;
	export let text;
</script>

<a {href}><button class="subject">{text}</button></a>

<style>
	.subject {
		margin: 5px;
		background-color: #e0f2fe;
		padding: 8px;
		border-radius: 10px;
		border: 2px solid black;
		text-decoration: none;
		font-weight: 500;
		font-size: 1em;
		font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
		color: black;
	}

	.subject:hover {
		transition: all 0.2s ease;
		cursor: pointer;
		background-color: #053f54;
		color: white;
	}
</style>
