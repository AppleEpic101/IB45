<script>
	import Links from '$lib/components/links.svelte';
</script>

<h1>Changelog</h1>
<Links />

<div class="changes">
	<div class="change">
		<h2>August 22, 2023</h2>
		<ul>
			<li>Dark mode</li>
			<li>Comments section</li>
			<li>Subject list</li>
			<li>Individual subject page w/ neat grade-boundary table</li>
			<li>November 2019 and November 2020 boundaries added</li>
		</ul>
	</div>
	<div class="change">
		<h2>August 19, 2023</h2>
		<ul>
			<li>Interface change</li>
			<li>Timezone selection</li>
			<li>Added changelog</li>
			<li>May 2021 boundaries added</li>
		</ul>
	</div>

	<div class="change">
		<h2>June 9, 2023</h2>
		<ul>
			<li>Bilingual Diploma support</li>
			<li>May 2019 boundaries added</li>
			<li>Additional subjects</li>
		</ul>
	</div>

	<div class="change">
		<h2>June 8, 2023</h2>
		<ul><li>Initial release</li></ul>
	</div>
</div>

<style>
	.changes {
		padding-bottom: 20px;
		margin: 0 50px;
	}

	h1 {
		margin: 20px 50px;
	}

	ul {
		list-style: none;
	}

	li::before {
		content: '• ';
	}

	@media screen and (max-width: 380px) {
		.changes {
			margin: 0 10px;
		}
		h1 {
			margin: 10px;
		}
	}
</style>
