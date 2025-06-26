<script>
	export let href;
	export let text;
</script>

<a {href}><button class="subject">{text}</button></a>

<style>
	.subject {
		margin: 5px;
		background-color: var(--primary);
		padding: 8px;
		border-radius: 10px;
		border: 2px solid black;
		text-decoration: none;
		text-shadow: 0px 0px 0.8px black;
		color: black;
		font-size: 1em;
	}

	.subject:hover {
		transition: all 0.2s ease;
		cursor: pointer;
		background-color: var(--banner);
		color: white;
	}
</style>
