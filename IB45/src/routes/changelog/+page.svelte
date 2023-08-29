<script>
	import Links from '$lib/components/links.svelte';
	import { fade, fly, scale } from 'svelte/transition';
</script>

<h1 in:fly={{ delay: 400, duration: 1000, x: 200 }}>Changelog</h1>
<Links />

<div in:fade={{ delay: 400, duration: 1000 }} class="changes">
	<div class="change">
		<h2 in:fly={{ delay: 400, duration: 1000, x: 200 }}>August 25, 2023</h2>
		<ul>
			<li>Added new subjects (classical language)</li>
			<li>Added school-based syllabi subjects</li>
			<li>Better looking buttons</li>
		</ul>
	</div>
	<div class="change">
		<h2 in:fly={{ delay: 400, duration: 1000, x: 200 }}>August 22, 2023</h2>
		<ul>
			<li>Dark mode</li>
			<li>Comments section</li>
			<li>Subject list</li>
			<li>Individual subject page w/ neat grade-boundary table</li>
			<li>November 2019 and November 2020 boundaries added</li>
		</ul>
	</div>
	<div class="change">
		<h2 in:fly={{ delay: 400, duration: 1000, x: 200 }}>August 19, 2023</h2>
		<ul>
			<li>Interface change</li>
			<li>Timezone selection</li>
			<li>Added changelog</li>
			<li>May 2021 boundaries added</li>
		</ul>
	</div>

	<div class="change">
		<h2 in:fly={{ delay: 400, duration: 1000, x: 200 }}>June 9, 2023</h2>
		<ul>
			<li>Bilingual Diploma support</li>
			<li>May 2019 boundaries added</li>
			<li>Additional subjects</li>
			<li>Modern greek language added</li>
		</ul>
	</div>

	<div class="change">
		<h2>June 8, 2023</h2>
		<ul><li>Initial release</li></ul>
	</div>
</div>

<svelte:head>
	<title>Changelog</title>
	<meta
		name="description"
		content="See the most recent updates in IB curricula and grade boundaries. Click NOW to view the latest features of the IB Predict grade calculator!"
	/>
</svelte:head>

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
