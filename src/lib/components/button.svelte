<script>
	export let href;
	export let text;
	export let variant;
</script>

<a {href}><button class={['subject', variant].join(' ')}>{text}</button></a>

<style>
	.subject {
		margin: 5px;
		background-color: #e0f2fe;
		padding: 7px 10px;
		border-radius: 10px;
		border: 2px solid black;
		box-shadow: 0 1px 1px black;
		text-decoration: none;
		font-size: 1em;
		font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
		color: black;
	}

	.subject:hover {
		transition: all 0.2s ease;
		cursor: pointer;
		background-color: #053f54;
		color: white;
		text-shadow: 0 2px 2px #808080;
	}

	.subject.larger {
		font-size: 1.25em;
	}
</style>
