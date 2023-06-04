<script>
	import Group1 from './group1.svelte';
	import Group2 from './group2.svelte';
	import Group3 from './group3.svelte';
	import Group4 from './group4.svelte';
	import Group5 from './group5.svelte';
	import Group6 from './group6.svelte';
	import TOK from './TOK.svelte';
	import DetailedTable from './detailedTable.svelte';
	import { onMount, onDestroy } from 'svelte';

	//let storage = [];

	onMount(async () => {});

	let names = [];
	let scores = [];
	let totalScore;
	let tokGrade;
	let eeGrade;
	let corePoints;

	let HLCount = 0,
		SLCount = 0;
	let levels = [];

	$: levels.forEach((item) => {
		(HLCount = 0), (SLCount = 0);
		item == 'HL' ? HLCount++ : item == 'SL' && SLCount++;
	});

	let selectedGroup6 = '6';

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	onMount(() => {
		selectedGroup6 = localStorage.getItem('selectedGroup6') ?? '6';
	});

	onDestroy(saveToLocalStorage);

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
		totalScore += corePoints;
	}

	let hasEarnedDiploma = false;

	function saveToLocalStorage() {
		if (window.localStorage) localStorage.setItem('selectedGroup6', selectedGroup6);
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
	<h1>International Baccalaureate Diploma Programme <br /> <br />Predicted Score Calculator</h1>
	<div />
	<div />
</nav>

<div class="intro">
	<img src="dp-programme-logo-en.png" alt="" style="max-width:40%;" />
	<h2>Welcome to IB Predict!</h2>
	<p>
		Our primary aim is to assist IB Diploma Programme students in estimating their final IB scores
		accurately. We understand the significance of score predictions when it comes to university
		applications.Our score prediction calculator has been meticulously designed to minimize
		deviations from the actual IB scores. By taking into account various factors such as your
		performance in internal assessments, coursework, mock exams, and historical data from previous
		IB students, our algorithm strives to generate reliable predictions.
	</p>
	<p>
		This calculator uses <a href="May 2022 Grade Boundaries.pdf" target="_blank">May 2022</a> grade boundaries.
	</p>

	<p>
		Please note that while our score predictions are based on historical trends, they should be
		regarded as estimates rather than definitive outcomes. The IB scoring system is complex, and
		individual performance can vary. Factors such as external exam conditions, personal
		circumstances, and other variables can influence actual scores.
	</p>
	<p>
		NOTE: For a given subject, if there is more than one timezone, the one with a stricter grading
		system (more challenging mark band) will be applied.
	</p>
	<p>
		If you are replacing your Group 6 selection with a subject from Groups 1-4, please mark the
		appropriate group.
	</p>

	<form>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="6" />
			<label for="group6">Group 6</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="1" />
			<label for="group1">Group 1</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="2" />
			<label for="group2">Group 2</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="3" />
			<label for="group3">Group 3</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="4" />
			<label for="group4">Group 4</label>
		</div>
	</form>

	<button
		on:click={() => {
			localStorage.clear();
			location.reload();
		}}
	>
		Reset Storage
	</button>

	<label>
		<input type="checkbox" />
		<span class="slider round">Detailed Mode</span>
	</label>
</div>

<div class="layout">
	<div class="left-column">
		<Group1 bind:awardedMark={scores[0]} bind:level={levels[0]} />
		<Group2 bind:awardedMark={scores[1]} bind:level={levels[1]} />
		<Group3 bind:awardedMark={scores[2]} bind:level={levels[2]} />
		<Group4 bind:awardedMark={scores[3]} bind:level={levels[3]} />
		<Group5 bind:awardedMark={scores[4]} bind:level={levels[4]} />
		{#if selectedGroup6 == '6'}
			<Group6 bind:awardedMark={scores[5]} bind:level={levels[5]} />
		{:else if selectedGroup6 == '1'}
			<Group1 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" />
		{:else if selectedGroup6 == '2'}
			<Group2 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" />
		{:else if selectedGroup6 == '3'}
			<Group3 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" />
		{:else if selectedGroup6 == '4'}
			<Group4 bind:awardedMark={scores[5]} bind:level={levels[5]} groupNumber="6" />
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
					{HLCount}
					{SLCount}
				/>
			</div>
		</div>
	</div>
</div>

<footer>Alexander Du</footer>

<link rel="stylesheet" href="light.css" />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(html) {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		background-color: var(--background);
		color: black;
	}

	:global(nav) {
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: var(--primary);
		text-align: center;
		top: 0px;
	}

	footer {
		background-color: var(--primary);
		height: 100px;
	}

	nav img {
		width: 200px;
		height: 100px;
		cursor: pointer;
		/* align-self: flex-start; */
	}

	.intro {
		margin: 0 5%;
		margin-top: 140px;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 1fr;
		margin: 20px 5%;
	}

	/* .diploma {
		border: 2px solid black;
		border-radius: 10px;
		padding: 10px;
		background-color: rgb(32, 169, 41);
		text-align: center;
	} */

	.option {
		margin-bottom: 10px;
	}

	.data {
		position: sticky;
		top: 140px;
	}
</style>
