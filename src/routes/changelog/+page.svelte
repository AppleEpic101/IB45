<script>
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => (ready = true));
	import Discord from '$lib/components/Discord.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Page from '../+page.svelte';
</script>

<PageHeader
	title="Changelog"
	description="See the most recent updates in IB curricula and grade boundaries. Click to learn the latest features of the IB Predict."
/>

<h1 in:fly={{ delay: 100, duration: 1300, x: 200 }}>Changelog</h1>

<div in:fade={{ delay: 100, duration: 1300 }} class="changes">
	<div in:fly={{ delay: 100, duration: 1300, x: 200 }} class="change">
		<h2>October 23, 2024</h2>
		<ul>
			<li>
				Updated subject syllabus changes for upcoming May 2025 Exams
				<ul>
					<li><a href="./subjects/physics?syl=2025">Physics (2025)</a></li>
					<li><a href="./subjects/chemistry?syl=2025">Chemistry(2025)</a></li>
					<li><a href="./subjects/biology?syl=2025">Biology (2025)</a></li>
				</ul>
			</li>
		</ul>

		<h2>September 26, 2024</h2>
		<ul>
			<li>Added May 2024 grade boundaries</li>
			<li>Individual grade calculators now use N23 instead of M23 by default</li>
			<li>Added historical grade boundary graph to subject pages</li>
		</ul>
		<h2>May 14, 2024</h2>
		<ul>
			<li>Added option to apply different grade boundaries to individual grade calculators</li>
			<li>Individual grade calculators now use M23 as default instead of N23 by default</li>
			<li>
				Join the Discord: <a href="https://discord.gg/G8UvbTJHp8">https://discord.gg/G8UvbTJHp8</a>
			</li>
		</ul>
		<h2>April 29, 2024</h2>
		<ul>
			<li>
				I have been getting a lot of questions lately and figured a discord server would offer
				faster and more efficient communication. You may use this server to talk academics and the
				discuss the test/grade boundaries after exam discussion is permitted. You may still contact
				me via admin@ibpredict.org.
			</li>
			<li>
				Permanent invite link: <a href="https://discord.gg/G8UvbTJHp8"
					>https://discord.gg/G8UvbTJHp8</a
				>
			</li>
		</ul>
		<h2>April 9, 2024</h2>
		<ul>
			<li>
				Archived old syllabuses for Business Management, Digital Society, Classical Language,
				Literature & Performance (M24 new syllabus changes)
			</li>
		</ul>
		<h2>March 15, 2024</h2>
		<ul>
			<li>Added November 2023 grade boundaries</li>
		</ul>
		<h2>January 2, 2024</h2>
		<ul>
			<li>Updated main page with buttons</li>
			<li>Sorry the domain got taken down, won't happen again</li>
		</ul>
		<h2>November 17, 2023</h2>
		<ul>
			<li>
				Updated subject syllabus changes for upcoming May 2024 Exams
				<ul>
					<li><a href="./subjects/business-management?syl=2024">Business Management</a></li>
					<li><a href="./subjects/classical-language?syl=2024">Classical Language</a></li>
					<li><a href="./subjects/digital-society?syl=2024">Digital Society</a></li>
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
		padding-bottom: 2rem;
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1.5rem 2rem;
	}

	h1 {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-size: 2.5rem;
		font-weight: 800;
	}

	ul {
		list-style: none;
		padding-left: 0;
	}

	li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.5rem;
	}

	li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: bold;
	}

	.change {
		margin-bottom: 3rem;
	}

	.change h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--color-primary-dark);
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
