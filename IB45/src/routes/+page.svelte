<script>
	import Group1 from './group1.svelte';
	import Group2 from './group2.svelte';
	import Group3 from './group3.svelte';
	import Group4 from './group4.svelte';
	import Group5 from './group5.svelte';
	import Group6 from './group6.svelte';
	import TOK from './TOK.svelte';
	import DetailedTable from './detailedTable.svelte';

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

	const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

	if (isLocalStorageAvailable) {
		selectedGroup6 = localStorage.getItem('selectedGroup6') ?? '6';
	}

	$: {
		if (isLocalStorageAvailable) {
			localStorage.setItem('selectedGroup6', selectedGroup6);
		}
	}

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
		totalScore += corePoints;
	}

	function resetStorage() {
		localStorage.removeItem('name6');
		localStorage.removeItem('level6');
		localStorage.removeItem('language6');
		localStorage.removeItem('sliderPosition6');
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
	<h1>Predicted Score Calculator</h1>
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
		NOTE: Subjects with fewer than 100 candidates do not have published boundaries. Therefore, you
		will have to rely on mocks and teacher predictions for guidance.
	</p>
	<p>
		If you are replacing your Group 6 selection with a subject from Groups 1-4, please mark the
		appropriate group.
	</p>

	<form>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="6" on:click={resetStorage} />
			<label for="group6">Group 6</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="1" on:click={resetStorage} />
			<label for="group1">Group 1</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="2" on:click={resetStorage} />
			<label for="group2">Group 2</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="3" on:click={resetStorage} />
			<label for="group3">Group 3</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={selectedGroup6} value="4" on:click={resetStorage} />
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
					{corePoints}
				/>
			</div>
		</div>
	</div>
</div>

<footer>
	<div class="create">
		Created by Alexander Du<br />Winston Thov
	</div>
</footer>

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
		width: 100%;
		display: flex;
		background-color: var(--primary);
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid black;
	}

	p {
		line-height: 2;
	}

	footer {
		background-color: var(--primary);
		height: 200px;
	}

	.create {
		margin: 20px;
	}

	nav h1 {
		margin-left: 7%;
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

	.intro {
		margin: 0 5%;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 1fr;
		margin: 20px 5%;
	}

	.option {
		margin-bottom: 10px;
	}

	.data {
		position: sticky;
		top: 10px;
	}
</style>
