<script>
	import Links from '$lib/components/links.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => (ready = true));
</script>

<svelte:head>
	<title>Changelog</title>
	<meta
		name="description"
		content="See the most recent updates in IB curricula and grade boundaries. Click to learn the latest features of the IB Predict."
	/>
</svelte:head>

<h1 in:fly={{ delay: 100, duration: 1300, x: 200 }}>Changelog</h1>
<Links />

<div in:fade={{ delay: 100, duration: 1300 }} class="changes">
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>November 17, 2023</h2>
		<ul>
			<li>
				Updated subject syllabus changes for upcoming May 2024 Exams
				<ul>
					<li><a href="./subjects/business-management?syl=2024">Business Management</a></li>
					<li><a href="./subjects/classical-language?syl=2024">Classical Language</a></li>
					<li><a href="./subjects/itgs?syl=2024">Digital Society</a></li>
					<li>
						<a href="./subjects/literature-and-performance?syl=2024">Literature And Performance</a>
					</li>
					<li><a href="./subjects/theatre?syl=2024">Theatre</a></li>
				</ul>
			</li>
		</ul>
	</div>
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>September 25, 2023</h2>
		<ul>
			<li>Added May 2023 grade boundaries (catastrophic)</li>
			<li>Added Marine Science</li>
		</ul>
	</div>
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>September 22, 2023</h2>
		<ul>
			<li>Probability distribution graphs</li>
			<li>More data representations coming soon</li>
		</ul>
	</div>
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>August 25, 2023</h2>
		<ul>
			<li>Added new subjects (classical language)</li>
			<li>Added school-based syllabi subjects</li>
			<li>Better looking buttons</li>
		</ul>
	</div>
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>August 22, 2023</h2>
		<ul>
			<li>Dark mode</li>
			<li>Comments section</li>
			<li>Subject list</li>
			<li>Individual subject page w/ neat grade-boundary table</li>
			<li>November 2019 and November 2020 boundaries added</li>
		</ul>
	</div>
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>August 19, 2023</h2>
		<ul>
			<li>Interface change</li>
			<li>Timezone selection</li>
			<li>Added changelog</li>
			<li>May 2021 boundaries added</li>
		</ul>
	</div>

	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>June 9, 2023</h2>
		<ul>
			<li>Bilingual Diploma support</li>
			<li>May 2019 boundaries added</li>
			<li>Additional subjects</li>
			<li>Modern greek language added</li>
		</ul>
	</div>

	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>June 8, 2023</h2>
		<ul><li>Initial release</li></ul>
	</div>
</div>

<style>
	.changes {
		padding-bottom: 20px;
		margin: 0 18%;
	}

	h1 {
		margin: 20px 18%;
	}

	ul {
		list-style: none;
	}

	li::before {
		content: '• ';
	}

	@media screen and (max-width: 480px) {
		.changes {
			margin: 0 10px;
		}
		h1 {
			margin: 10px;
		}
	}
</style>
