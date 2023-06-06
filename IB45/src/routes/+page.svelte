<script>
	import Group1 from './group1.svelte';
	import Group2 from './group2.svelte';
	import Group3 from './group3.svelte';
	import Group4 from './group4.svelte';
	import Group5 from './group5.svelte';
	import Group6 from './group6.svelte';
	import TOK from './TOK.svelte';
	import DetailedTable from './detailedTable.svelte';
	import SelectedGroup6 from './selectedGroup6.svelte';
	import GradeBoundary from "./gradeboundary.svelte";

	let scores = [];
	let totalScore;
	let tokGrade;
	let eeGrade;
	let corePoints;

	let HLCount = 0,
		SLCount = 0;
	let levels = [];

	$: {
		(HLCount = 0), (SLCount = 0);
		levels.forEach((item) => {
			item == 'HL' ? HLCount++ : item == 'SL' && SLCount++;
		});
	}

	let selectedGroup6 = '6';
	let gradeBoundary = "M22";

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	if (isLocalStorageAvailable) {
		selectedGroup6 = localStorage.getItem('selectedGroup6') ?? '6';
		gradeBoundary = localStorage.getItem('gradeBoundary') ?? "M22";
	}

	$: {
		if (isLocalStorageAvailable) {
			localStorage.setItem('selectedGroup6', selectedGroup6);
			localStorage.setItem('gradeBoundary', gradeBoundary);
		}
	}

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
		totalScore += corePoints;
	}
</script>

<nav>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<img
		src="flc_design20230531154582.png"
		alt="Logo"
		on:click={() => {
			location.reload();
		}}
	/>
	<div />
	<div />
</nav>

<div class="banner">
	<h1>International Baccalaureate Diploma Programme <br /> <br /> Predicted Score Calculator</h1>
</div>
<div class="intro">
	<h2>Welcome to IB Predict!</h2>
	<p>
		Our primary aim is to assist IB Diploma Programme students in estimating their final IB scores
		accurately. We understand the significance of score predictions when it comes to university
		applications.Our score prediction calculator has been meticulously designed to minimize
		deviations from the actual IB scores. By taking into account various factors such as your
		performance in internal assessments, coursework, mock exams, and historical data from previous
		IB students, our calculator strives to generate reliable predictions.
	</p>
	<p>
		The IB scoring system is complex, and
		individual performance can vary. Factors such as external exam conditions, personal
		circumstances, and other variables can influence actual scores.
	</p>
	<p>
		NOTE: For a given subject, if there is more than one timezone, the one with a stricter grading
		system (more challenging mark band) will be applied.
	</p>
	<p>
		NOTE: Subjects with fewer than 100 candidates do not have published boundaries. Therefore, you
		will have to rely on mocks and teacher predictions for guidance.
	</p>

	<div class="multipleChoice">
		<SelectedGroup6 bind:selectedGroup6 />
		<GradeBoundary bind:gradeBoundary />
	</div>
	<!-- <label>
		<input type="checkbox" />
		<span class="slider round">Detailed Mode</span>
	</label> -->
</div>

<div class="layout">
	<div class="left-column">
		<button
			on:click={() => {
				localStorage.clear();
				location.reload();
			}}
		>
			Reset Selections
		</button>
		<Group1 bind:awardedMark={scores[0]} bind:level={levels[0]} {gradeBoundary} />
		<Group2 bind:awardedMark={scores[1]} bind:level={levels[1]} {gradeBoundary} />
		<Group3 bind:awardedMark={scores[2]} bind:level={levels[2]} {gradeBoundary} />
		<Group4 bind:awardedMark={scores[3]} bind:level={levels[3]} {gradeBoundary} />
		<Group5 bind:awardedMark={scores[4]} bind:level={levels[4]} {gradeBoundary} />
		{#if selectedGroup6 == '6'}
			<Group6 bind:awardedMark={scores[5]} bind:level={levels[5]} {gradeBoundary} />
		{:else if selectedGroup6 == '1'}
			<Group1 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" {gradeBoundary} />
		{:else if selectedGroup6 == '2'}
			<Group2 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" {gradeBoundary} />
		{:else if selectedGroup6 == '3'}
			<Group3 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" {gradeBoundary} />
		{:else if selectedGroup6 == '4'}
			<Group4 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" {gradeBoundary} />
		{/if}
		<TOK bind:awardedMark={tokGrade} bind:ee={eeGrade} bind:corePoints />
	</div>
	<div class="right-column">
		<div class="data">
			<div class="table">
				<DetailedTable
					points={totalScore}
					awardedMarks={scores}
					tok={tokGrade}
					ee={eeGrade}
					{levels}
					{HLCount}
					{SLCount}
					{corePoints}
				/>
			</div>
		</div>
	</div>
</div>

<footer>
	<div>
		<strong>THE SYNDICATE</strong><br />Alexander Du<br />Winston Thov<br />Richard Yang
	</div>
	<div class="title">
		<strong>RESOURCES</strong><br /><a href="May 2022 Grade Boundaries.pdf" target="_blank"
			>May 2022 Grade Boundary</a><br /> <a href="November 2022 Grade Boundaries.pdf" target="_blank"
			>November 2022 Grade Boundary</a>
	</div>
	<div>
		<strong>CONTACT</strong><br />Report errors, ask questions, etc.<br />admin@ibpredict.com
	</div>
</footer>

<link rel="stylesheet" href="light.css" />

<style>
	:global(html) {
		font-family: 'Helvetica Neue', Arial, sans-serif;
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
		border-bottom: 2px solid black;
	}

	p {
		line-height: 2;
	}

	footer {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		background-color: var(--primary);
		height: 250px;
		border-top: 2px solid black;
	}

	footer div {
		text-align: center;
		line-height: 2;
	}

	footer div::before {
		content: '\A';
		white-space: pre;
	}

	nav img {
		width: 200px;
		height: 100px;
		cursor: pointer;
		align-self: flex-start !important;
		margin-left: 5px;
		transition: 0.3s ease-in-out;
	}

	nav img:hover {
		transform: scale(1.05);
		-webkit-transform: scale(1.05);
	}

	button {
		background-color: var(--lightprimary);
		padding: 15px;
		margin: 10px 0;
		cursor: pointer;
		border: 2px solid black;
		border-radius: 5px;
		color: black;
	}

	button:hover {
		background-color: var(--primary);
		transition: 0.3s ease-in-out;
	}

	.banner {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: var(--banner);
		color: white;
		padding: 0;
		height: 300px;
	}

	.intro {
		margin: 0 10%;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 1fr;
		margin: 20px 5%;
	}

	.data {
		position: sticky;
		top: 10px;
	}

	@media screen and (max-width: 560px) {
		.layout {
			display: block;
		}
		footer {
			display: block;
			height: 450px;
		}
	}
</style>
