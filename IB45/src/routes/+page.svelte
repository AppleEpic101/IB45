<script>
	import { selectedGroup6 } from '$lib/stores/store.js';
	import Group1 from '$lib/components/group1.svelte';
	import Group2 from '$lib/components/group2.svelte';
	import Group3 from '$lib/components/group3.svelte';
	import Group4 from '$lib/components/group4.svelte';
	import Group5 from '$lib/components/group5.svelte';
	import Group6 from '$lib/components/group6.svelte';
	import TOK from '$lib/components/TOK.svelte';
	import DetailedTable from '$lib/components/detailedTable.svelte';
	import GradeBoundary from '$lib/components/gradeboundary.svelte';
	import Timezone from '$lib/components/timezone.svelte';
	import Links from '$lib/components/links.svelte';
	import Refresh from '$lib/components/refresh.svelte';

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

<div class="banner">
	<h1>
		International Baccalaureate Diploma Programme <br /> <br /> Predicted Score Calculator
	</h1>
</div>
<div class="intro">
	<div>
		<h2>Welcome to IB Predict!</h2>
		<h3>Last updated August 25, 2023</h3>
	</div>
	<Links />
	<p class="main">
		The IB Predict score calculator serves as a valuable tool for International Baccalaureate (IB)
		Diploma Programme students, enabling them to make informed estimates of their eventual IB
		grades. Its importance is particularly evident in the context of university applications, where
		predicted grades play a pivotal role. By utilizing official grade boundaries data from past IB
		exam sessions, the calculator ensures a high level of precision in its grade predictions. This
		accuracy provides students with a clearer understanding of their potential outcomes, aiding
		their university aspirations and decisions.
	</p>

	<p class="main">
		The incorporation of historical grade boundaries lends credibility to the predictions, offering
		students a reliable source of information to gauge their performance. In essence, the calculator
		empowers students to plan ahead and make well-informed choices based on their predicted IB
		grades, which can significantly impact their higher education opportunities.
	</p>

	<p class="main">
		Introducing our latest enhancement to IB Predict! We're thrilled to introduce a brand new
		feature that enables students to accurately predict their grades for individual subjects. Try it
		out <a href="/subjects">here.</a>
	</p>
	<p>
		<strong>
			NOTE: May 2023 grade boundaries are coming soon (likely on September 11th, 2023 when IB
			releases its exam papers).
		</strong>
	</p>
	<hr />

	<div class="multipleChoice">
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
	<div class="left-column">
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

<svelte:head>
	<title>IB Grade Calculator</title>
	<meta
		name="description"
		content="Will YOU do well on your upcoming International Baccalaureate (IB) exams? Use this IB grade calculator to find out!"
	/>
</svelte:head>

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
		margin: 0 12%;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 275px;
		margin: 20px 12%;
	}

	.data {
		position: -webkit-sticky;
		position: sticky;
		top: 10px;
	}

	.top-table {
		display: none;
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

	@media screen and (max-width: 770px) {
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
