<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<footer>
	<div>
		<strong>THE SYNDICATE</strong>
		<div>Alexander Du</div>
		<div>Richard Yang</div>
		<div>Winston Thov</div>
	</div>
	<br />
	<div>
		<strong>CONTACT</strong>
		<div>Report errors, ask questions, etc.</div>
		<div>
			<a href="mailto:admin@ibpredict.org">admin@ibpredict.org</a>
		</div>
		<Discord />
	</div>
</footer>

<style>
	footer {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		background-color: var(--primary);
		border-top: 1px solid black;
		padding: 25px 0 0 0;
	}

	footer div {
		text-align: center;
		margin: 15px 0;
	}

	/* s */

	@media screen and (max-width: 560px) {
		footer {
			display: block;
			height: 350px;
		}
	}
</style>
