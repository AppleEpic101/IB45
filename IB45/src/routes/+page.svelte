<script>
	import { selectedGroup6 } from '$lib/stores/store.js';
	import { fly, scale, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Group1 from '$lib/components/main/group1.svelte';
	import Group2 from '$lib/components/main/group2.svelte';
	import Group3 from '$lib/components/main/group3.svelte';
	import Group4 from '$lib/components/main/group4.svelte';
	import Group5 from '$lib/components/main/group5.svelte';
	import Group6 from '$lib/components/main/group6.svelte';
	import TOK from '$lib/components/main/TOK.svelte';
	import DetailedTable from '$lib/components/main/detailedTable.svelte';
	import GradeBoundary from '$lib/components/main/gradeboundary.svelte';
	import Timezone from '$lib/components/main/timezone.svelte';
	import Links from '$lib/components/links.svelte';
	import Refresh from '$lib/components/main/refresh.svelte';

	let ready = false;
	onMount(() => (ready = true));

	let scores = [];
	let totalScore;
	let tokGrade;
	let eeGrade;
	let corePoints;

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
		totalScore += corePoints;
	}
</script>

<svelte:head>
	<title>IB Grade Calculator</title>
	<meta
		name="description"
		content="Will YOU do well on your upcoming International Baccalaureate (IB) exams? Use this IB grade calculator to find out!"
	/>
</svelte:head>

{#if ready}
	<div class="banner">
		<h1 in:scale={{ duration: 1500, start: 0.3, opacity: 0.5 }}>
			International Baccalaureate Diploma Programme <br /> <br /> Predicted Score Calculator
		</h1>
	</div>
	<div class="intro">
		<div in:fly={{ delay: 400, duration: 1000, x: 200 }}>
			<h2>Welcome to IB Predict!</h2>
			<h4>Last updated September 22, 2023<br />Made By Alexander Du</h4>
		</div>
		<Links />
		<div in:fly={{ delay: 400, duration: 1000, y: 100 }}>
			<p class="main">
				The IB Predict score calculator serves as a valuable tool for International Baccalaureate
				(IB) Diploma Programme students. Its importance cannot be understated in the context of
				university applications, where predicted grades play a critical role in admissions. By
				utilizing official grade boundaries data from past IB exam sessions, the calculator ensures
				a high level of precision in its grade predictions, thereby aiding their university
				aspirations and decisions.
			</p>

			<p class="main">
				Introducing the latest feature to IB Predict! For all IB DP subjects, students may now view
				course descriptions, enter assessment scores, and view past grade boundaries on an
				individual subject page. Try it out <a href="/subjects">here!</a>
			</p>
			<p>
				<strong>
					NOTE: May 2023 grade boundaries are coming soon (whenever I can find them).
				</strong>
			</p>
		</div>
		<hr />

		<div in:fade={{ delay: 150, duration: 1300 }} class="multipleChoice">
			<GradeBoundary />
			<Timezone />
		</div>
		<div class="top-table">
			<div class="data">
				<div class="table">
					<DetailedTable
						points={totalScore}
						awardedMarks={scores}
						tok={tokGrade}
						ee={eeGrade}
						{corePoints}
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="layout">
		<div in:fly={{ delay: 250, duration: 1500, x: -300 }} class="left-column">
			<Refresh />
			<Group1 bind:awardedMark={scores[0]} />
			<Group2 bind:awardedMark={scores[1]} />
			<Group3 bind:awardedMark={scores[2]} />
			<Group4 bind:awardedMark={scores[3]} />
			<Group5 bind:awardedMark={scores[4]} />
			{#if $selectedGroup6 == '6'}
				<Group6 bind:awardedMark={scores[5]} />
			{:else if $selectedGroup6 == '1'}
				<Group1 bind:awardedMark={scores[5]} groupNumber="6" />
			{:else if $selectedGroup6 == '2'}
				<Group2 bind:awardedMark={scores[5]} groupNumber="6" />
			{:else if $selectedGroup6 == '3'}
				<Group3 bind:awardedMark={scores[5]} groupNumber="6" />
			{:else if $selectedGroup6 == '4'}
				<Group4 bind:awardedMark={scores[5]} groupNumber="6" />
			{:else if $selectedGroup6 == '5'}
				<Group5 bind:awardedMark={scores[5]} groupNumber="6" />
			{/if}
			<TOK bind:awardedMark={tokGrade} bind:ee={eeGrade} bind:corePoints />
			<Refresh />
		</div>
		<div class="right-column">
			<div class="data">
				<div class="table">
					<DetailedTable
						points={totalScore}
						awardedMarks={scores}
						tok={tokGrade}
						ee={eeGrade}
						{corePoints}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(html) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: var(--primary);
		color: black;
	}

	:global(body) {
		background-color: var(--background);
		margin: 0;
		padding: 0;
		overscroll-behavior-x: none;
	}

	:global(nav) {
		width: 100%;
		display: flex;
		background-color: var(--primary);
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid black;
	}

	:global(.top-links) {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: 5px;
		width: 100%;
	}

	:global(.top-links a) {
		margin-right: 10px;
		color: black;
		text-decoration: none;
		font-size: 1.2em;
	}

	p {
		line-height: 2;
	}

	.banner {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: var(--banner);
		color: white;
		text-shadow: 1px 1px 1px navyblue;
		padding: 0;
		border-bottom: 2px solid black;
		font-family: 'Courier New', Courier, monospace;
		border-right: 0.5px solid var(--lightprimary);
	}

	.banner h1 {
		margin: 80px 50px;
	}

	.intro {
		margin: 0 18%;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 275px;
		margin: 20px 18%;
	}

	.data {
		position: -webkit-sticky;
		position: sticky;
		top: 10px;
	}

	.top-table {
		display: none;
	}

	h2 {
		margin-bottom: 0;
	}

	@media screen and (max-width: 1000px) {
		p {
			line-height: 1.5;
		}
	}

	@media screen and (max-width: 710px) {
		.layout {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media screen and (max-width: 560px) {
		.right-column {
			display: none;
		}

		.top-table {
			display: initial;
		}
		.layout {
			display: block;
		}
	}

	@media screen and (max-width: 1000px) {
		.layout {
			margin: 20px 10px;
		}
	}

	@media screen and (max-width: 700px) {
		.banner h1 {
			font-size: 23px;
			margin: 50px 30px;
		}
		.intro {
			margin: 0 5%;
		}
		.main {
			font-size: small;
		}
	}

	@media screen and (max-width: 420px) {
		.main {
			font-size: 0.8em;
		}
		p {
			line-height: 1.3;
		}
	}
</style>
